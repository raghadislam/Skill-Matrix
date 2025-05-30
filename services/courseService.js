const ApiFeatures = require('../utils/apiFeatures');
const Course = require('../models/courseModel');
const Assessment = require('../models/assessmentModel');
const Enrollment = require('../models/enrollmentModel');
const QuizResult = require('../models/quizResultModel');
const STATUS = require('../utils/courseStatus');
const AppError = require('../utils/appError');
const assessmentRequestService = require('./assessmentRequestService');

class CourseService {
  #population(query) {
    return query.populate({
      path: 'prerequisites',
      select: '-_id -__v -parentSkillId',
    });
  }

  async getAllCourses(queryString) {
    const query = this.#population(Course.find());
    const feature = new ApiFeatures(query, queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await feature.query.lean();
  }

  async getCourse(id) {
    const query = this.#population(Course.findById(id));
    return await query.lean();
  }

  async createCourse(data) {
    return await Course.create(data);
  }

  async updateCourse(id, data) {
    let query = Course.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    query = this.#population(query);

    return await query.lean();
  }

  async deleteCourse(id) {
    return await Course.findByIdAndDelete(id);
  }

  async getAssessments(courseId) {
    return await Assessment.findOne({ courseId });
  }

  async createQuizResult(data) {
    return await QuizResult.create(data);
  }

  async subminCourseAssessment({
    courseId,
    userId,
    answers,
    status,
    requestId,
    assessment,
  }) {
    if (status === STATUS.COMPLETED) {
      const result = await QuizResult.findOne({ assessmentId: assessment._id });
      if (!result) throw new AppError('Unexpected Error', 500);

      return {
        message:
          'You have already submitted this assessment! Here is your results',
        result,
      };
    }

    const submittedAnswers = answers.map((q) => q * 1);

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

    const result = await this.createQuizResult({
      assessmentId: assessment._id,
      userId,
      score,
    });

    let assessmentStatus = 'fail';
    // mark as completed
    if (score >= assessment.passingScore) {
      await Enrollment.findOneAndUpdate(
        {
          courseId,
          userId,
        },
        { $set: { status: STATUS.COMPLETED } },
        { new: true, runValidators: true },
      );
      assessmentStatus = 'pass';

      await assessmentRequestService.deleteRequest(requestId);
    }

    return { result, assessmentStatus };
  }
}

module.exports = new CourseService();
