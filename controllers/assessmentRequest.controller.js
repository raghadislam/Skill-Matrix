const assessmentRequestService = require('../services/assessmentRequest.service');
const { sendResponse } = require('../utils/responseUtils');

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

exports.updateAssessmentRequest = async (req, res) => {
  const updatedRequest = await assessmentRequestService.updateRequest(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { updatedRequest },
  });
};

exports.deleteAssessmentRequest = async (req, res) => {
  await assessmentRequestService.deleteRequest(req.params.id);

  sendResponse(res, {
    statusCode: 204,
    status: 'success',
  });
};
