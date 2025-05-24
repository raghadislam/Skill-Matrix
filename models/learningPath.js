const mongoose = require('mongoose');

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
    timestamps: true,
    versionKey: false,
  },
);

learningPathSchema.path('createdAt').select(false);
learningPathSchema.path('updatedAt').select(false);

learningPathSchema.pre(/^update|.*Update.*$/, function (next) {
  const update = this.getUpdate();
  if (this.isNew || !update) return next();

  update.$set = {
    ...(update.$set || {}),
    changedAt: Date.now(),
  };
  this.setUpdate(update);

  next();
});

learningPathSchema.pre(/^find$/, function (next) {
  this.populate({ path: 'orderedCourseIds' });
  next();
});

const learningPath = mongoose.model('LearningPath', learningPathSchema);
module.exports = learningPath;
