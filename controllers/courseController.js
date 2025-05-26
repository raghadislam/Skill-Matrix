const courseService = require('../services/courseService');
const { sendResponse } = require('../utils/responseUtils');

exports.getAllCourses = async (req, res, err) => {
  const courses = await courseService.getAllCourses(req.query);

  sendResponse(res, {
    status: 'success',
    statusCode: 200,
    data: { courses },
  });
};
