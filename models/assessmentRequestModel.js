const mongoose = require('mongoose');

const assessmentRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A crequest must have a user'],
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: [true, 'A crequest must have an assessment'],
    },
    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  },
);

assessmentRequestSchema.path('createdAt').select(false);
assessmentRequestSchema.path('updatedAt').select(false);

assessmentRequestSchema.index({ user: 1, assessment: 1 }, { unique: true });

assessmentRequestSchema.pre('save', async function (next) {
  await this.populate('user', 'name role department');
  await this.populate({
    path: 'assessment',
    populate: [
      { path: 'course', select: 'title category description' },
      { path: 'questions', select: 'question options' },
    ],
  });
  next();
});

assessmentRequestSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('assessment')) {
    const limit = this.assessment.timeLimitMinutes;
    const created = this.createdAt || new Date();
    this.deadline = new Date(created.getTime() + limit * 60 * 1000);
  }
  next();
});

assessmentRequestSchema.index({ deadline: 1 }, { expireAfterSeconds: 0 });

assessmentRequestSchema.pre(/^find/, function (next) {
  this.populate('user', 'name role department').populate({
    path: 'assessment',
    populate: [
      { path: 'course', select: 'title category description' },
      { path: 'questions', select: 'question options' },
    ],
  });
  next();
});

const AssessmentRequest = mongoose.model(
  'AssessmentRequest',
  assessmentRequestSchema,
);

module.exports = AssessmentRequest;
