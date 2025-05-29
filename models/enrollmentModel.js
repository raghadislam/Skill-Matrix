const mongoose = require('mongoose');
const STATUS = require('../utils/assesmentStatus');

const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      required: true,
      default: STATUS.ENROLLED,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

enrollmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
    select: 'name email role department',
  }).populate({
    path: 'courseId',
    select: 'title',
  });
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
