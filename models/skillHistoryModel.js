const mongoose = require('mongoose');

const { HISTORY_TYPE } = require('../utils/enums');

const skillHistorySchema = new mongoose.Schema(
  {
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: [true, 'Skill id is required'],
    },

    type: {
      type: String,
      required: [true, 'History type is required'],
      enum: {
        values: Object.values(HISTORY_TYPE),
        message: `Type must be one of ${Object.values(HISTORY_TYPE).join(', ')}`,
      },
    },

    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Actor (user) is required'],
    },

    before: {
      type: mongoose.Schema.Types.Mixed,
    },
    after: {
      type: mongoose.Schema.Types.Mixed,
    },

    note: { type: String, trim: true },
  },
  {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

skillHistorySchema.index({ skill: 1, createdAt: -1 });
skillHistorySchema.index({ actor: 1, createdAt: -1 });

const SkillHistory = mongoose.model('SkillHistory', skillHistorySchema);
module.exports = SkillHistory;
