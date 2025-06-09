const enrollmentService = require('../services/enrollmentServices');
const AppError = require('../utils/appError');
const { sendResponse } = require('../utils/responseUtils');

exports.enroll = async (req, res) => {
  const enrollment = await enrollmentService.enroll(
    req.body.courseId,
    req.user._id,
  );

  sendResponse(res, {
    statusCode: 201,
    status: 'success',
    data: { enrollment },
  });
};

exports.getAllEnrollments = async (req, res) => {
  const enrollments = await enrollmentService.getAllEnrollments(req.query);

  sendResponse(res, {
    status: 'success',
    statusCode: 200,
    data: { enrollments },
  });
};

exports.getEnrollment = async (req, res) => {
  const Enrollment = await enrollmentService.getEnrollment(req.params.id);
  if (!Enrollment) throw new AppError(`No Enrollment found with that ID`, 404);

  sendResponse(res, {
    status: 'success',
    statusCode: 200,
    data: { Enrollment },
  });
};

exports.updateEnrollment = async (req, res) => {
  const updatedEnrollment = await enrollmentService.updateEnrollment(
    req.params.id,
    req.body,
  );
  if (!updatedEnrollment)
    throw new AppError(`No Enrollment found with that ID`, 404);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { updatedEnrollment },
  });
};

exports.deleteEnrollment = async (req, res) => {
  const enrollment = await enrollmentService.deleteEnrollment(req.params.id);
  if (!enrollment) throw new AppError(`No enrollment found with that ID`, 404);

  sendResponse(res, {
    statusCode: 204,
    status: 'success',
  });
};
