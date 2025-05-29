const mongoose = require('mongoose');
require('./courseModel');

const learningPathSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Learning path must have a name'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Learning path must have a description'],
    },
    orderedCourseIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
          required: true,
        },
      ],
      required: [true, 'Learning path must include at least one course'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Learning path must include at least one course',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  },
);

learningPathSchema.path('createdAt').select(false);
learningPathSchema.path('updatedAt').select(false);

learningPathSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'orderedCourseIds',
    select: '-prerequisites',
  });
  next();
});

learningPathSchema.virtual('duration').get(function () {
  if (!this.populated('orderedCourseIds')) return 0;
  return this.orderedCourseIds.reduce(
    (total, course) => total + (course.durationHours || 0),
    0,
  );
});

learningPathSchema.virtual('category').get(function () {
  if (!this.populated('orderedCourseIds')) return '';
  return this.orderedCourseIds[0].category;
});

const learningPath = mongoose.model('LearningPath', learningPathSchema);
module.exports = learningPath;
