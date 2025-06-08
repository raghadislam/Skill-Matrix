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
}

module.exports = new NotificationService();
