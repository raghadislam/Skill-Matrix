const mongoose = require('mongoose');

const endorsementSchema = new mongoose.Schema(
  {
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'An Endrosement should have a skill'],
      ref: 'Skill',
    },

    endorser: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'An Endrosement should have an endorser'],
      ref: 'User',
    },

    endorsee: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'An Endrosement should have an endorsee'],
      ref: 'User',
    },
  },
  {
    timestamps: true,
    id: false,
    versionKey: false,
  },
);
endorsementSchema.index(
  { endorser: 1, endorsee: 1, skill: 1 },
  { unique: true },
);

endorsementSchema.path('createdAt').select(false);
endorsementSchema.path('updatedAt').select(false);

module.exports = mongoose.model('Endorsement', endorsementSchema);
