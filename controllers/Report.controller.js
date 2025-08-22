const reportService = require('../services/Report.service');
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
    statusCode: 201,
    status: 'success',
    data: { report },
  });
};
