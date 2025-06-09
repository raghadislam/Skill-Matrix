const Notification = require('../models/notificationModel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

class NotificationService {
  async getAllNotifications(queryString) {
    const feature = new ApiFeatures(Notification.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await feature.query.lean();
  }

  async getNotification(id) {
    const notification = await Notification.findById(id).lean();
    if (!notification)
      throw new AppError(`No notification found with that ID`, 404);

    return notification;
  }

  async createNotification(userId, type, message) {
    const newNotification = await Notification.create({
      user: userId,
      type,
      message,
    });

    return newNotification;
  }

  async createNotification(userId, type, message) {
    const newNotification = await Notification.create({
      user: userId,
      type,
      message,
    });

    return newNotification;
  }

  async markRead(notificationId, userId) {
    const notification = await Notification.findById(notificationId);
    if (!notification)
      throw new AppError(`No notification found with that ID`, 404);

    if (notification.user._id.toString() !== userId.toString())
      throw new AppError(
        `You are not authorized to view this notification.`,
        401,
      );

    notification.isRead = true;
    await notification.save();

    return notification;
  }
}

module.exports = new NotificationService();
