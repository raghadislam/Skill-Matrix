const assessmentRequestService = require('../services/assessmentRequestService');
const { sendResponse } = require('../utils/responseUtils');

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
