const learningPathService = require('../services/learningPath.service');
const { sendResponse } = require('../utils/responseUtils');
const AppError = require('../utils/appError');

exports.getAllPaths = async (req, res, next) => {
  const paths = await learningPathService.getAllLearningPaths(req.query);
  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { paths },
  });
};

exports.createPath = async (req, res, next) => {
  const path = await learningPathService.createLearningPath(req.body);
  sendResponse(res, {
    statusCode: 201,
    status: 'success',
    data: { path },
  });
};

exports.updatePath = async (req, res, next) => {
  const path = await learningPathService.updateLearningPath(
    req.params.id,
    req.body,
  );

  if (!path)
    return next(new AppError(`No learning path found with that ID`, 404));
  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { path },
  });
};

exports.deletePath = async (req, res, next) => {
  const path = await learningPathService.deleteLearningPath(req.params.id);
  if (!path) {
    return next(new AppError('No learning path found with that ID', 404));
  }
  sendResponse(res, {
    statusCode: 204,
    status: 'success',
    data: null,
  });
};

exports.getPath = async (req, res, next) => {
  const path = await learningPathService.getLearningPath(req.params.id);
  if (!path)
    return next(new AppError(`No learning path found with that ID`, 404));

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { path },
  });
};
