const mongoose = require('mongoose');

const userBadgeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge',
      required: true,
    },
  },
  {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

userBadgeSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email department',
  }).populate({
    path: 'badge',
    select: 'name description',
  });
  next();
});

module.exports = mongoose.model('UserBadge', userBadgeSchema);
