const AssessmentRequest = require('../models/assessmentRequest.model');
const Assessment = require('../models/assessment.model');
const AppError = require('../utils/appError');

module.exports = async (req, res, next) => {
  const assessment = await Assessment.findOne({
    course: req.params.id,
  }).submitPopulate();
  if (!assessment)
    throw new AppError('No assessment found for this course ID', 404);

  const request = await AssessmentRequest.findOne({
    user: req.user._id,
    assessment: assessment._id,
  });

  if (!request)
    throw new AppError(
      'You have not requested this assessment, or the deadline has passed. Please request access before proceeding.',
      401,
    );

  req.request = request;
  req.assessment = assessment;
  next();
};
