const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    trim: true,
    required: [true, 'Each question must have text'],
  },

  options: {
    type: [
      {
        type: String,
        trim: true,
      },
    ],
    validate: [
      {
        validator: (opts) => opts.length >= 2 && opts.length <= 4,
        message: 'Each question must have between 2 and 4 options',
      },
      {
        validator: (opts) =>
          opts.every((opt) => typeof opt === 'string' && opt.trim().length > 0),
        message: 'Options cannot be empty strings',
      },
    ],
  },

  correctOptionIndex: {
    type: Number,
    required: [true, 'Each question must specify the correct option index'],
    min: [0, 'correctOptionIndex must be a non-negative integer'],
    validate: {
      validator: function (val) {
        return val < this.options.length;
      },
      message:
        'correctOptionIndex must be within the range of available options',
    },
  },
});

const assessmentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'An assessment must have a courseId'],
      unique: true,
    },

    questions: {
      type: [questionSchema],
      validate: [
        {
          validator: (qs) => qs.length >= 15,
          message: 'An assessment must contain at least 15 questions',
        },
        {
          validator: function (qs) {
            const texts = qs.map((q) => q.question);
            return texts.length === new Set(texts).size;
          },
          message: 'All questions in an assessment must be unique',
        },
      ],
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
            return `Time limit cannot exceed ${this.questions.length * 8} minutes (8 min per question)`;
          },
        },
      ],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

assessmentSchema.path('createdAt').select(false);
assessmentSchema.path('updatedAt').select(false);

assessmentSchema.virtual('fullMark').get(function () {
  return this.questions.length;
});

assessmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'courseId',
    select: 'title -_id',
  });
  next();
});

const Assessment = mongoose.model('Assessment', assessmentSchema);
module.exports = Assessment;
