const reportService = require('../services/report.service');
const { sendResponse } = require('../utils/responseUtils');

exports.getSkillPopularity = async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 1000;
  const { category } = req.query;
  const min = req.query.min * 1 || 0;

  const report = await reportService.getSkillPopularity(
    limit,
    page,
    category,
    min,
  );
  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { report },
  });
};

exports.getAvgCompletionTime = async (req, res) => {
  const report = await reportService.getAvgCompletionTime();

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { report },
  });
};

exports.getMonthlyNotificationVolume = async (req, res) => {
  const year = req.query.year * 1 || new Date().getFullYear();

  const report = await reportService.getMonthlyNotificationVolume(year);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { report },
  });
};
