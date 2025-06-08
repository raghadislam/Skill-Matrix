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

exports.createNotification = async (req, res) => {
  const newNotification = await notificationService.createNotification(
    req.body.user,
    req.body.type,
    req.body.message,
  );

  sendResponse(res, {
    statusCode: 201,
    status: 'success',
    data: { newNotification },
  });
};
