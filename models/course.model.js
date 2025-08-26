const mongoose = require('mongoose');

const { DEPT } = require('../utils/enums');

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
      required: [true, 'Course must have a description'],
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
    category: {
      type: String,
      required: [true, 'A course must have a category'],
      enum: {
        values: Object.values(DEPT),
        message: `category must be one of ${Object.values(DEPT).join(', ')}`,
      },
    },
    skillGained: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Skill',
        required: [true, 'A course must specify at least one skill gained'],
      },
    ],
    ratingsQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Ratings quantity must be >= 0'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be >= 1.0'],
      max: [5, 'Rating must be <= 5.0'],
      set: (v) => (Number.isFinite(v) ? Math.round(v * 10) / 10 : undefined),
    },
  },
  {
    timestamps: true,

    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },

    versionKey: false,
  },
);

courseSchema.path('createdAt').select(false);
courseSchema.path('updatedAt').select(false);

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
