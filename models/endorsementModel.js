const mongoose = require('mongoose');

const endorsementSchema = new mongoose.Schema(
  {
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'An Endrosement should have a skill'],
    },

    endorserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'An Endrosement should have an endorser'],
    },

    endorseeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'An Endrosement should have an endorsee'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

endorsementSchema.path('createdAt').select(false);
endorsementSchema.path('updatedAt').select(false);

endorsementSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'skillId',
    select: 'name category',
  });

  this.populate({
    path: 'endorserId',
    select: 'name email department',
  });

  this.populate({
    path: 'endorseeId',
    select: 'name email department',
  });

  next();
});

module.exports = mongoose.model('Endorsement', endorsementSchema);
