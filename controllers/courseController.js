const courseService = require('../services/courseService');
const Enrollment = require('../models/enrollmentModel');
const QuizResult = require('../models/quizResultModel');
const { sendResponse } = require('../utils/responseUtils');
const STATUS = require('../utils/courseStatus');
const AppError = require('../utils/appError');

exports.getAllCourses = async (req, res) => {
  const courses = await courseService.getAllCourses(req.query);

  sendResponse(res, {
    status: 'success',
    statusCode: 200,
    data: { courses },
  });
};

exports.getCourse = async (req, res) => {
  const course = await courseService.getCourse(req.params.id);
  if (!course) throw new AppError(`No course found with that ID`, 404);

  sendResponse(res, {
    status: 'success',
    statusCode: 200,
    data: { course },
  });
};

exports.createCourse = async (req, res) => {
  const newCourse = await courseService.createCourse(req.body);

  sendResponse(res, {
    statusCode: 201,
    status: 'success',
    data: { newCourse },
  });
};

exports.updateCourse = async (req, res) => {
  const updatedCourse = await courseService.updateCourse(
    req.params.id,
    req.body,
  );
  if (!updatedCourse) throw new AppError(`No course found with that ID`, 404);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { updatedCourse },
  });
};

exports.deleteCourse = async (req, res) => {
  const course = await courseService.deleteCourse(req.params.id);
  if (!course) throw new AppError(`No course found with that ID`, 404);

  sendResponse(res, {
    statusCode: 204,
    status: 'success',
  });
};

exports.getCourseAssessment = async (req, res) => {
  const assessment = await courseService.getAssessments(req.params.id);
  if (!assessment)
    throw new AppError('No assessment found for this course ID', 404);

  let data = assessment;

  if (req.enrollmentStatus === STATUS.COMPLETED) {
    data = await QuizResult.findOne({ assessmentId: assessment._id });
  }

  if (!data) throw new AppError('Unexpected Error', 500);

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data,
  });
};

exports.submitCourseAssessment = async (req, res) => {
  const assessment = await courseService.getAssessments(req.params.id);
  if (!assessment)
    throw new AppError('No assessment found for this course ID', 404);

  if (req.enrollmentStatus === STATUS.COMPLETED) {
    const result = await QuizResult.findOne({ assessmentId: assessment._id });
    if (!result) throw new AppError('Unexpected Error', 500);

    return sendResponse(res, {
      statusCode: 200,
      status: 'success',
      message:
        'You have already submitted this assessment! Here is your results',
      data: result,
    });
  }

  const submittedAnswers = req.body.answers.map((q) => q * 1);

  const correctAnswers = assessment.questions.map(
    (q) => q.correctOptionIndex * 1 + 1,
  );

  if (submittedAnswers.length !== correctAnswers.length) {
    throw new AppError(
      'Number of answers does not match number of questions',
      400,
    );
  }

  // Compare each answer
  let score = 0;
  for (let iterator = 0; iterator < submittedAnswers.length; iterator += 1) {
    if (submittedAnswers[iterator] === correctAnswers[iterator]) {
      score += 1;
    }
  }

  const result = await courseService.createQuizResult({
    assessmentId: assessment._id,
    userId: req.user._id,
    score,
  });

  let assessmentStatus = 'fail';
  // mark as completed
  if (score >= assessment.passingScore) {
    await Enrollment.findOneAndUpdate(
      {
        courseId: req.params.id,
        userId: req.user.id,
      },
      { $set: { status: STATUS.COMPLETED } },
      { new: true, runValidators: true },
    );
    assessmentStatus = 'pass';
  }

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: result,
    assessmentStatus,
  });
};
