const courseService = require('../services/courseService');
const { sendResponse } = require('../utils/responseUtils');
const AppError = require('../utils/appError');

exports.getAllCourses = async (req, res) => {
  const courses = await courseService.getAllCourses(req.query);

  sendResponse(res, {
    status: 'success',
    statusCode: 200,
    data: { courses },
  });
};

exports.getCourse = async (req, res) => {
  const course = await courseService.getCourse(req.params.id);
  if (!course) throw new AppError(`No course found with that ID`, 404);

  sendResponse(res, {
    status: 'success',
    statusCode: 200,
    data: { course },
  });
};

exports.createCourse = async (req, res) => {
  const newCourse = await courseService.createCourse(req.body);

  sendResponse(res, {
    statusCode: 201,
    status: 'success',
    data: { newCourse },
  });
};

exports.updateCourse = async (req, res) => {
  const updatedCourse = await courseService.updateCourse(
    req.params.id,
    req.body,
  );
  if (!updatedCourse) throw new AppError(`No course found with that ID`, 404);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { updatedCourse },
  });
};

exports.deleteCourse = async (req, res) => {
  const course = await courseService.deleteCourse(req.params.id);
  if (!course) throw new AppError(`No course found with that ID`, 404);

  sendResponse(res, {
    statusCode: 204,
    status: 'success',
  });
};

exports.getAssessments = async (req, res) => {
  const assessment = await courseService.getAssessments(req.params.courseId);
  if (!assessment)
    throw new AppError('No assessment found for this course ID', 404);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { assessment },
  });
};
