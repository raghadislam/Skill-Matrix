const userService = require('../services/userService');
const { sendResponse } = require('../utils/responseUtils');
const AppError = require('../utils/appError');

// TODO -> get rid of this and handle it using ZOD
// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach((el) => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });
//   return newObj;
// };

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

exports.getUserEnrollments = async (req, res) => {
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

exports.getMyNotifications = async (req, res) => {
  const notifications = await userService.getNotifications(
    req.user._id,
    req.query.onlyUnRead,
  );

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { notifications },
  });
};

exports.getMe = async (req, res) => {
  const user = await userService.getUser(req.user._id);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { user },
  });
};

exports.updateMe = async (req, res) => {
  const updateData = {
    ...req.body,
  };

  if (req.uploadedPhoto) {
    updateData.photo = req.uploadedPhoto.url;
    updateData.photoPublicId = req.uploadedPhoto.public_id;
  }

  if (req.uploadedResume) {
    updateData.resume = req.uploadedResume.url;
    updateData.resumePublicId = req.uploadedResume.public_id;
  }

  const updatedUser = await userService.updateMe(req.user._id, updateData);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { updatedUser },
  });
};

exports.deleteMe = async (req, res) => {
  await userService.deleteMe(req.user.id);
  sendResponse(res, {
    statusCode: 204,
    status: 'success',
  });
};
