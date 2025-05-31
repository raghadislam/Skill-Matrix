const endorsementService = require('../services/endorsementService');
const { sendResponse } = require('../utils/responseUtils');
// const STATUS = require('../utils/courseStatus');
const AppError = require('../utils/appError');

exports.getAllEndorsements = async (req, res) => {
  const endorsements = await endorsementService.getAllEndorsements(req.query);

  sendResponse(res, {
    status: 'success',
    statusCode: 200,
    data: { endorsements },
  });
};

exports.getEndorsement = async (req, res) => {
  const endorsement = await endorsementService.getEndorsement(req.params.id);
  if (!endorsement)
    throw new AppError(`No endorsement found with that ID`, 404);

  sendResponse(res, {
    status: 'success',
    statusCode: 200,
    data: { endorsement },
  });
};

exports.updateEndorsement = async (req, res) => {
  const endorsement = await endorsementService.updateEndorsement(
    req.params.id,
    req.body,
  );
  if (!endorsement)
    throw new AppError(`No endorsement found with that ID`, 404);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { endorsement },
  });
};

exports.deleteEndorsement = async (req, res) => {
  const endorsement = await endorsementService.deleteEndorsement(req.params.id);
  if (!endorsement) throw new AppError(`No course found with that ID`, 404);

  sendResponse(res, {
    statusCode: 204,
    status: 'success',
  });
};
