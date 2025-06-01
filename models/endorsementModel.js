const mongoose = require('mongoose');

const endorsementSchema = new mongoose.Schema(
  {
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'An Endrosement should have a skill'],
      ref: 'Skill',
    },

    endorserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'An Endrosement should have an endorser'],
      ref: 'User',
    },

    endorseeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'An Endrosement should have an endorsee'],
      ref: 'User',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
endorsementSchema.index(
  { endorserId: 1, endorseeId: 1, skillId: 1 },
  { unique: true },
);

endorsementSchema.path('createdAt').select(false);
endorsementSchema.path('updatedAt').select(false);

module.exports = mongoose.model('Endorsement', endorsementSchema);
