const assessmentRequestService = require('../services/assessmentRequestService');
const { sendResponse } = require('../utils/responseUtils');
const AppError = require('../utils/appError');

exports.getAllAssessmentRequests = async (req, res) => {
  const requests = await assessmentRequestService.getAllRequests(req.query);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: {
      requests,
    },
  });
};

exports.getAssessmentRequest = async (req, res) => {
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

exports.createAssessmentRequest = async (req, res) => {
  const newRequest = await assessmentRequestService.createRequest(req.body);

  sendResponse(res, {
    statusCode: 201,
    status: 'success',
    data: { newRequest },
  });
};
