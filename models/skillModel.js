const mongoose = require('mongoose');
const DEPT = require('../utils/departments');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A skill must have a name'],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    parentSkillId: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Skill',
      },
    ],
    category: {
      type: String,
      required: [true, 'A skill must have a category'],
      enum: {
        values: Object.values(DEPT),
        message: `Category must be one of ${Object.values(DEPT).join(', ')}`,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

skillSchema.path('createdAt').select(false);
skillSchema.path('updatedAt').select(false);

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
