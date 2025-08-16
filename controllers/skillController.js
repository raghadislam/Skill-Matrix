const skillService = require('../services/skillServices');
const AppError = require('../utils/appError');
const { sendResponse } = require('../utils/responseUtils');

exports.getAllSkills = async (req, res, next) => {
  const skills = await skillService.getAllSkills(req.query);
  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { skills },
  });
};

exports.createSkill = async (req, res, next) => {
  const skill = await skillService.createSkill(req.body, req.user);
  sendResponse(res, {
    statusCode: 201,
    status: 'success',
    data: { skill },
  });
};

exports.updateSkill = async (req, res, next) => {
  const skill = await skillService.updateSkill(
    req.params.id,
    req.body,
    req.user,
  );

  if (!skill) return next(new AppError(`No skill found with that ID`, 404));
  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { skill },
  });
};

exports.deleteSkill = async (req, res, next) => {
  const skill = await skillService.deleteSkill(req.params.id, req.user);
  if (!skill) {
    return next(new AppError('No skill found with that ID', 404));
  }
  sendResponse(res, {
    statusCode: 204,
    status: 'success',
    data: null,
  });
};

exports.getSkill = async (req, res, next) => {
  const skill = await skillService.getSkill(req.params.id);
  if (!skill) return next(new AppError(`No skill found with that ID`, 404));

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { skill },
  });
};
