const catchAsync = require('../utils/catchAsync');
const userService = require('../services/userService');
const sendResponse = require('../utils/sendResponse');
const AppError = require('../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { users },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await userService.getUser(req.params.id);
  if (!user) return next(new AppError(`No user found with that ID`, 404));

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { user },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await userService.deleteUser(req.params.id);
  if (!user) return next(new AppError(`No user found with that ID`, 404));

  sendResponse(res, {
    statusCode: 204,
    status: 'success',
  });
});
