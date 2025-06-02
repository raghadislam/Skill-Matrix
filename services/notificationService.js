const Notification = require('../models/notificationModel');
const ApiFeatures = require('../utils/apiFeatures');

class NotificationService {
  async getAllNotifications(queryString) {
    const feature = new ApiFeatures(Notification.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await feature.query.lean();
  }
}

module.exports = new NotificationService();
