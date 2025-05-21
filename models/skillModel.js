const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A skill must have a name'],
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
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    updatedAt: {
      type: Date,
      select: false,
    },
    category: {
      type: String,
      required: [true, 'A skill must have a category'],
      enum: {
        values: ['Development', 'Design', 'Marketing'],
        message: 'category must be either Development, Design, or Marketing',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

skillSchema.pre('save', function (next) {
  if (this.isNew) return next();
  if (
    this.isModified('name') ||
    this.isModified('description') ||
    this.isModified('parentSkillId')
  ) {
    this.updatedAt = Date.now();
  }
  next();
});

skillSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'parentSkillId',
    select: '-__v',
  });
  next();
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
