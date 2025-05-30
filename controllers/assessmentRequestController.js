const assessmentRequestService = require('../services/assessmentRequestService');
const { sendResponse } = require('../utils/responseUtils');
const AppError = require('../utils/appError');

exports.getAllAssessmentRequests = async (req, res, next) => {
  const requests = await assessmentRequestService.getAllRequests(req.query);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: {
      requests,
    },
  });
};

exports.getAssessmentRequest = async (req, res, next) => {
  const request = await assessmentRequestService.getRequest(req.params.id);
  if (!request)
    throw new AppError(`No assessment request found with that ID`, 404);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: {
      request,
    },
  });
};
