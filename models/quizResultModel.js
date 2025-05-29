const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    userId: {
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
    versionKey: false,
  },
);
quizResultSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'assessmentId',
  }).populate({
    path: 'userId',
    select: 'name email role department',
  });
  next();
});

quizResultSchema.virtual('status').get(function () {
  if (!this.assessmentId || !this.assessmentId.passingScore) return undefined;
  return this.score >= this.assessmentId.passingScore ? 'passed' : 'failed';
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
