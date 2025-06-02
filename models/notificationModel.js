const mongoose = require('mongoose');

const TYPE = require('../utils/notificationType');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A notification must have a user'],
    },

    type: {
      type: String,
      required: [true, 'A notification must have a type'],
      enum: {
        values: Object.values(TYPE),
        message: `type must be one of ${Object.values(TYPE).join(', ')}`,
      },
    },

    message: {
      type: String,
      required: [true, 'A notification must have a message'],
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  },
);

notificationSchema.path('createdAt').select(false);
notificationSchema.path('updatedAt').select(false);

notificationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name -_id',
  });
  next();
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
