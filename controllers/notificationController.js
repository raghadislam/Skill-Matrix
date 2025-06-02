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
