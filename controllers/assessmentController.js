const assessmentService = require('../services/assessmentService');
const { sendResponse } = require('../utils/responseUtils');
const AppError = require('../utils/appError');

exports.getAllAssessments = async (req, res, next) => {
  const assessments = await assessmentService.getAllAssessments(req.query);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: {
      assessments,
    },
  });
};

exports.getAssessment = async (req, res, next) => {
  const assessment = await assessmentService.getAssessment(req.params.id);
  if (!assessment) throw new AppError(`No assessment found with that ID`, 404);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: {
      assessment,
    },
  });
};

exports.createAssessment = async (req, res, next) => {
  const newAssessment = await assessmentService.createAssessment(req.body);

  sendResponse(res, {
    statusCode: 201,
    status: 'success',
    data: { newAssessment },
  });
};

exports.updateAssessment = async (req, res, next) => {
  const updatedAssessment = await assessmentService.updateAssessment(
    req.params.id,
    req.body,
  );
  if (!updatedAssessment)
    throw new AppError(`No assessment found with that ID`, 404);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { updatedAssessment },
  });
};

exports.updateQuestion = async (req, res, next) => {
  const assessment = await assessmentService.getAssessment(
    req.params.assessmentId,
  );
  if (!assessment) throw new AppError(`No assessment found with that ID`, 404);

  const updatedAssessment = await assessmentService.updateQuestion(
    assessment,
    req.params.questionId,
    req.body,
  );

  if (!updatedAssessment)
    throw new AppError(
      `No question found with that ID in this assessment`,
      404,
    );

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { updatedAssessment },
  });
};

exports.deleteAssessment = async (req, res, next) => {
  const assessment = await assessmentService.deleteAssessment(req.params.id);
  if (!assessment) throw new AppError(`No assessment found with that ID`, 404);

  sendResponse(res, {
    statusCode: 204,
    status: 'success',
  });
};
