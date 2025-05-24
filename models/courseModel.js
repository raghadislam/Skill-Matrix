const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A course must have a title'],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    durationHours: {
      type: Number,
      required: [true, 'A course must have a duration in hours'],
      min: [0, 'Duration must be a positive number'],
    },
    prerequisites: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Skill',
      },
    ],
  },
  {
    timestamps: true,

    toJSON: { virtuals: true },
    toObject: { virtuals: true },

    versionKey: false,
  },
);

courseSchema.path('createdAt').select(false);
courseSchema.path('updatedAt').select(false);

courseSchema.pre(/^update|.*Update.*$/, function (next) {
  const update = this.getUpdate();
  if (this.isNew || !update) return next();

  update.$set = {
    ...(update.$set || {}),
    changedAt: Date.now(),
  };
  this.setUpdate(update);

  next();
});

courseSchema.pre(/^find$/, function (next) {
  this.populate({ path: 'prerequisites' });
  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
