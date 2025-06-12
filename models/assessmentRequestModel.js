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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  },
);

assessmentRequestSchema.path('createdAt').select(false);
assessmentRequestSchema.path('updatedAt').select(false);

assessmentRequestSchema.index({ user: 1, assessment: 1 }, { unique: true });

assessmentRequestSchema.pre('save', async function (next) {
  await this.populate({
    path: 'user',
    select: 'name role department -_id',
  });
  await this.populate({
    path: 'assessment',
    select: 'course timeLimitMinutes -_id',
  });
  next();
});

assessmentRequestSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('assessment')) {
    const limit = this.assessment.timeLimitMinutes;
    this.deadline = new Date(this.createdAt.getTime() + limit * 60 * 1000);
  }
  next();
});

assessmentRequestSchema.index({ deadline: 1 }, { expireAfterSeconds: 0 });

assessmentRequestSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name role department -_id',
  }).populate({
    path: 'assessment',
    select: 'course timeLimitMinutes -_id',
  });
  next();
});

const AssessmentRequest = mongoose.model(
  'AssessmentRequest',
  assessmentRequestSchema,
);

module.exports = AssessmentRequest;
