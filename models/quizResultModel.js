const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    id: false,
    versionKey: false,
  },
);
quizResultSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email role department',
  });
  next();
});

quizResultSchema.post('save', function () {
  this.populate({
    path: 'user',
    select: 'name email department',
  });
});

quizResultSchema.virtual('status').get(function () {
  if (!this.assessmentId || !this.assessmentId.passingScore) return undefined;
  return this.score >= this.assessmentId.passingScore ? 'passed' : 'failed';
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
