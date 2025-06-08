const notificationService = require('../services/notificationService');
const { sendResponse } = require('../utils/responseUtils');

exports.getAllNotifications = async (req, res) => {
  const notifications = await notificationService.getAllNotifications(
    req.query,
  );

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: {
      notifications,
    },
  });
};

exports.getNotification = async (req, res) => {
  const notification = await notificationService.getNotification(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: {
      notification,
    },
  });
};

exports.deleteNotification = async (req, res) => {
  await notificationService.deleteNotification(req.params.id);

  sendResponse(res, {
    statusCode: 204,
    status: 'success',
  });
};

exports.markNotificationAsRead = async (req, res) => {
  const notification = await notificationService.markRead(
    req.params.id,
    req.user._id,
  );

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: {
      notification,
    },
  });
};
