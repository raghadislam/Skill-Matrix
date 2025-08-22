const mongoose = require('mongoose');

const Question = require('./question.model');

const assessmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'An assessment must have a course'],
      unique: true,
    },

    questions: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          required: [true, 'An assessment must have questions'],
        },
      ],
      validate: [
        {
          validator: (qs) => qs.length >= 15,
          message: 'An assessment must contain at least 15 questions',
        },
        {
          validator: function (qs) {
            const ids = qs.map((id) => id.toString());
            return ids.length === new Set(ids).size;
          },
          message: 'All questions in an assessment must be unique',
        },
        {
          validator: async function (qs) {
            const count = await Question.countDocuments({ _id: { $in: qs } });
            return count === qs.length;
          },
          message: 'One or more question IDs are invalid',
        },
      ],
    },

    fullMark: {
      type: Number,
    },

    passingScore: {
      type: Number,
      required: [true, 'An assessment must have a passing score'],
      validate: [
        {
          validator: function (score) {
            return score >= Math.ceil(this.questions.length * 0.4);
          },
          message: 'Passing score must be at least 40% of total questions',
        },
        {
          validator: function (score) {
            return score <= Math.ceil(this.questions.length * 0.7);
          },
          message: 'Passing score cannot exceed 70% of total questions',
        },
      ],
    },

    timeLimitMinutes: {
      type: Number,
      required: [true, 'An assessment must have a time limit (in minutes)'],
      validate: [
        {
          validator: function (duration) {
            return duration >= this.questions.length * 5;
          },
          message: function () {
            return `Time limit must be at least ${this.questions.length * 5} minutes (5 min per question)`;
          },
        },
        {
          validator: function (duration) {
            return duration <= this.questions.length * 8;
          },
          message: function () {
            const qCount = Array.isArray(this.questions)
              ? this.questions.length
              : 0;
            return `Time limit cannot exceed ${qCount * 8} minutes (8 min per question)`;
          },
        },
      ],
    },
  },
  {
    timestamps: true,
    id: false,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

assessmentSchema.path('createdAt').select(false);
assessmentSchema.path('updatedAt').select(false);

assessmentSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('questions')) {
    await this.populate('questions', 'weight');

    this.fullMark = this.questions.reduce((sum, q) => sum + (q.weight || 1), 0);
  }
  next();
});

assessmentSchema.post('save', async (doc) => {
  await doc.populate('course', 'title category description');
  await doc.populate('questions', 'question options weight');
});

assessmentSchema.query.findPopulate = function () {
  return this.populate('course', 'title category description').populate(
    'questions',
    'question options weight',
  );
};

assessmentSchema.query.submitPopulate = function () {
  return this.populate('questions', 'correctOptionIndex weight');
};

const Assessment = mongoose.model('Assessment', assessmentSchema);
module.exports = Assessment;
