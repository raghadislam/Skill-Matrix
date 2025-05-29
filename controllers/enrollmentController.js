const enrollmentService = require('../services/enrollmentServices');

const { sendResponse } = require('../utils/responseUtils');

exports.enroll = async (req, res) => {
  const enrollment = await enrollmentService.enroll(req);

  sendResponse(res, {
    statusCode: 201,
    status: 'success',
    data: { enrollment },
  });
};
