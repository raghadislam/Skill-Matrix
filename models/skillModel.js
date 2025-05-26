const mongoose = require('mongoose');

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
        values: ['Development', 'Design', 'Marketing'],
        message: 'category must be either Development, Design, or Marketing',
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

skillSchema.pre(/^update|.*Update.*$/, function (next) {
  const update = this.getUpdate();
  if (this.isNew || !update) return next();

  update.$set = {
    ...(update.$set || {}),
    updatedAt: Date.now(),
  };

  this.setUpdate(update);

  next();
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
