const catchAsync = require('../utils/catchAsync');
const userService = require('../services/userService');
const sendResponse = require('../utils/sendResponse');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const { users } = await userService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { users },
  });
});
