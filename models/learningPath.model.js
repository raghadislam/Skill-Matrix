const mongoose = require('mongoose');
require('./course.model');

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
    orderedCourses: {
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
    id: false,
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
    path: 'orderedCourses',
  });
  next();
});

learningPathSchema.virtual('duration').get(function () {
  if (!this.populated('orderedCourses')) return 0;
  return this.orderedCourses.reduce(
    (total, course) => total + (course.durationHours || 0),
    0,
  );
});

learningPathSchema.virtual('category').get(function () {
  if (!this.populated('orderedCourses')) return '';
  return this.orderedCourses[0].category;
});

const learningPath = mongoose.model('LearningPath', learningPathSchema);
module.exports = learningPath;
