const mongoose = require('mongoose');
const { CRITERIA } = require('../utils/enums');

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A badge must have a name'],
      description: String,
    },
    description: String,
    icon: {
      type: String,
      trim: true,
      required: [true, 'A badge must have an icon'],
    },
    criteria: {
      type: {
        type: String,
        enum: Object.values(CRITERIA),
        required: true,
      },
      count: { type: Number, required: true },
    },
  },
  {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

module.exports = mongoose.model('Badge', badgeSchema);
