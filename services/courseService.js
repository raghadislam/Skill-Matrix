const ApiFeatures = require('../utils/apiFeatures');
const Course = require('../models/courseModel');
const Assessment = require('../models/assessmentModel');
const User = require('../models/userModel');
const Enrollment = require('../models/enrollmentModel');
const QuizResult = require('../models/quizResultModel');
const STATUS = require('../utils/courseStatus');
const TYPE = require('../utils/notificationType');
const AppError = require('../utils/appError');
const assessmentRequestService = require('./assessmentRequestService');
const notificationService = require('./notificationService');

class CourseService {
  #population(query) {
    return query.populate({
      path: 'prerequisites',
      select: '-_id -__v -parentSkill',
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

  async requestCourseAssessment(courseId, userId) {
    const assessment = await Assessment.findOne({ course: courseId });
    if (!assessment)
      throw new AppError('No assessment found for this course ID', 404);

    const data = await assessmentRequestService.createRequest({
      assessment: assessment._id,
      user: userId,
    });

    const deadlineDate = new Date(data.deadline);
    const formattedDeadline = deadlineDate.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Cairo',
    });
    const message = `Your assessment request has been received. Please complete it by ${formattedDeadline}.`;

    notificationService
      .createNotification(userId, TYPE.ASSESSMENT_DEADLINE, message)
      .catch((err) => {
        console.error('Notification failed', err);
      });

    return { data };
  }

  async submitCourseAssessment({
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

    const result = await QuizResult.create({
      assessmentId: assessment._id,
      user: userId,
      score,
    });

    let assessmentStatus = 'fail';
    let notificationType = TYPE.ASSESSMENT_FAILED;

    // mark as completed
    if (score >= assessment.passingScore) {
      const { skillGained } = await Course.findById(courseId)
        .select('skillGained')
        .lean();

      await Promise.all([
        Enrollment.findOneAndUpdate(
          { course: courseId, user: userId },
          { status: STATUS.COMPLETED },
          { new: true, runValidators: true },
        ),

        assessmentRequestService.deleteRequest(requestId),

        User.findByIdAndUpdate(
          userId,
          { $addToSet: { skills: { $each: skillGained } } },
          { new: true },
        ),
      ]);

      assessmentStatus = 'pass';
      notificationType = TYPE.ASSESSMENT_PASSED;
    }

    await notificationService.createNotification(
      userId,
      notificationType,
      `You scored ${(score * 100) / assessment.fullMark}% on the '${assessment.course.title}' assessment. Please review and retake.`,
    );

    return { result, assessmentStatus };
  }
}

module.exports = new CourseService();
