const assessmentService = require('../services/assessmentService');
const { sendResponse } = require('../utils/responseUtils');

exports.getAllAssessment = async (req, res, next) => {
  const assessments = await assessmentService.getAllAssessments(req.query);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: {
      assessments,
    },
  });
};
