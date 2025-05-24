const SkillService = require('../services/skillServices');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const skillService = new SkillService();

const sendResponse = (res, statusCode, status, data, message) => {
  res.status(statusCode).json({ status, data, message });
};

exports.getAllSkills = catchAsync(async (req, res, next) => {
  const allSkills = await skillService.getAllSkills(req.query);
  sendResponse(res, 200, 'success', allSkills);
});

exports.createSkill = catchAsync(async (req, res, next) => {
  const newSkill = await skillService.createSkill(req.body);
  sendResponse(res, 201, 'success', newSkill);
});

exports.updateSkill = catchAsync(async (req, res, next) => {
  const updatedSkill = await skillService.updateSkill(req.params.id, req.body);

  if (!updatedSkill)
    return sendResponse(res, 404, 'fail', updatedSkill, 'Skill not found');
  sendResponse(res, 200, 'success', updatedSkill);
});

exports.deleteSkill = catchAsync(async (req, res, next) => {
  const skill = await skillService.deleteSkill(req.params.id);
  if (!skill) {
    return next(new AppError('No skill found with that ID', 404));
  }
  sendResponse(res, 204, 'success', null);
});

exports.getSkill = catchAsync(async (req, res, next) => {
  const skill = await skillService.getSkill(req.params.id);
  if (!skill) return next(new AppError(`No skill found with that ID`, 404));
  sendResponse(res, 200, 'success', skill);
});
