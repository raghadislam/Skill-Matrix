const courseService = require('../services/courseService');
const { sendResponse } = require('../utils/responseUtils');
const AppError = require('../utils/appError');

exports.getAllCourses = async (req, res, next) => {
  const courses = await courseService.getAllCourses(req.query);

  sendResponse(res, {
    status: 'success',
    statusCode: 200,
    data: { courses },
  });
};

exports.getCourse = async (req, res, next) => {
  const course = await courseService.getCourse(req.params.id);
  if (!course) throw new AppError(`No course found with that ID`, 404);

  sendResponse(res, {
    status: 'success',
    statusCode: 200,
    data: { course },
  });
};

exports.createCourse = async (req, res, next) => {
  const newCourse = await courseService.createCourse(req.body);

  sendResponse(res, {
    statusCode: 201,
    status: 'success',
    data: { newCourse },
  });
};
