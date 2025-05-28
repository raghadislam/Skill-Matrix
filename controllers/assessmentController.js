const assessmentService = require('../services/assessmentService');
const { sendResponse } = require('../utils/responseUtils');
const AppError = require('../utils/appError');

exports.getAllAssessments = async (req, res, next) => {
  const assessments = await assessmentService.getAllAssessments(req.query);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: {
      assessments,
    },
  });
};

exports.getAssessment = async (req, res, next) => {
  const assessment = await assessmentService.getAssessment(req.params.id);
  if (!assessment) throw new AppError(`No assessment found with that ID`, 404);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: {
      assessment,
    },
  });
};
