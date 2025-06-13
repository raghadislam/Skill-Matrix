const mongoose = require('mongoose');
const DIFFICULTY = require('../utils/difficulty');

function validOptions(opts) {
  return (
    Array.isArray(opts) &&
    opts.length >= 2 &&
    opts.length <= 4 &&
    opts.every((o) => o.trim().length > 0)
  );
}

function validIndex(val) {
  return Array.isArray(this.options) && val >= 0 && val < this.options.length;
}

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      trim: true,
      required: [true, 'Each question must have text'],
      unique: true,
    },

    options: {
      type: [String],
      required: [true, 'Each question must have options'],
      validate: {
        validator: validOptions,
        message: 'Options must be 2–4 non‑empty strings',
      },
    },

    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: [true, 'An assessment must have a topic'],
    },

    difficulty: {
      type: String,
      required: [true, 'A question must have a difficulty'],
      enum: {
        values: Object.values(DIFFICULTY),
        message: `difficulty must be one of ${Object.values(DIFFICULTY).join(', ')}`,
      },
    },

    correctOptionIndex: {
      type: Number,
      required: [true, 'Each question must specify the correct option index'],
      validate: {
        validator: validIndex,
        message: 'correctOptionIndex must be within the range of options',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  },
);

questionSchema.path('createdAt').select(false);
questionSchema.path('updatedAt').select(false);

questionSchema.query.withTopic = function () {
  return this.populate('topic', 'name -_id');
};

questionSchema.index({ topic: 1, difficulty: 1 });

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
