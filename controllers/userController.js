const userService = require('../services/userService');
const { sendResponse } = require('../utils/responseUtils');
const AppError = require('../utils/appError');

exports.getAllUsers = async (req, res, next) => {
  const users = await userService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { users },
  });
};

exports.getUser = async (req, res, next) => {
  const user = await userService.getUser(req.params.id);
  if (!user) return next(new AppError(`No user found with that ID`, 404));

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { user },
  });
};

exports.deleteUser = async (req, res, next) => {
  const user = await userService.deleteUser(req.params.id);
  if (!user) return next(new AppError(`No user found with that ID`, 404));

  sendResponse(res, {
    statusCode: 204,
    status: 'success',
  });
};

exports.updateUser = async (req, res, next) => {
  const updateUser = await userService.updateUser(req.params.id, req.body);
  if (!updateUser) throw new AppError(`No user found with that ID`, 404);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { updateUser },
  });
};

exports.createUser = async (req, res, next) => {
  const newUser = await userService.createUser(req.body);

  sendResponse(res, {
    statusCode: 201,
    status: 'success',
    data: { newUser },
  });
};

exports.getEnrollments = async (req, res) => {
  const enrollments = await userService.getEnrollments(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { enrollments },
  });
};

exports.getMyEnrollments = async (req, res) => {
  const enrollments = await userService.getEnrollments(req.user._id);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { enrollments },
  });
};
