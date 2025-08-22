const assessmentRequestService = require('./assessmentRequestService');
const notificationService = require('./notificationService');
const Course = require('../models/courseModel');
const Assessment = require('../models/assessmentModel');
const User = require('../models/userModel');
const Enrollment = require('../models/enrollmentModel');
const QuizResult = require('../models/quizResultModel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const eventBus = require('../utils/eventBus');
const STATUS = require('../utils/courseStatus');
const { TYPE } = require('../utils/enums');
const { CRITERIA } = require('../utils/enums');
const redisClient = require('../config/redis');

class CourseService {
  async #getOrSetCache(key, cb) {
    const data = await redisClient.get(key);

    if (data != null) return JSON.parse(data);

    const freshData = await cb();
    await redisClient.setEx(key, 3600, JSON.stringify(freshData));
    return freshData;
  }

  /* eslint-disable no-await-in-loop */
  async #deleteBatch(keys) {
    const BATCH_SIZE = 500;
    if (!keys || keys.length === 0) return;

    if (typeof redisClient.unlink === 'function') {
      for (let i = 0; i < keys.length; i += BATCH_SIZE) {
        await redisClient.unlink(...keys.slice(i, i + BATCH_SIZE));
      }
    } else {
      for (let i = 0; i < keys.length; i += BATCH_SIZE) {
        await redisClient.del(...keys.slice(i, i + BATCH_SIZE));
      }
    }
  }

  async #clearCourseCache() {
    const BATCH_SIZE = 500;
    let batch = [];

    // eslint-disable-next-line no-restricted-syntax, node/no-unsupported-features/es-syntax
    for await (const key of redisClient.scanIterator({
      MATCH: 'courses:*',
      COUNT: 1000,
    })) {
      batch.push(key);
      if (batch.length >= BATCH_SIZE) {
        await this.#deleteBatch(batch);
        batch = [];
      }
    }
    if (batch.length) this.#deleteBatch(batch);
  }

  #population(query) {
    return query.populate({
      path: 'prerequisites',
      select: '-_id -__v -parentSkill',
    });
  }

  async getAllCourses(queryString) {
    const cacheKey = `courses:${JSON.stringify(queryString)}}`;

    const data = await this.#getOrSetCache(cacheKey, async () => {
      const query = this.#population(Course.find());
      const feature = new ApiFeatures(query, queryString)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      return await feature.query.lean();
    });

    return data;
  }

  async getCourse(id) {
    const cacheKey = `courses:${id}`;

    const data = await this.#getOrSetCache(cacheKey, async () => {
      const query = this.#population(Course.findById(id));
      return await query.lean();
    });

    return data;
  }

  async createCourse(data) {
    const newCourse = await Course.create(data);

    this.#clearCourseCache();

    return newCourse;
  }

  async updateCourse(id, data) {
    let query = Course.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    query = this.#population(query);
    const updatedCourse = await query.lean();

    if (!updatedCourse) throw new AppError(`No course found with that ID`, 404);

    this.#clearCourseCache();

    return updatedCourse;
  }

  async deleteCourse(id) {
    const course = await Course.findByIdAndDelete(id);
    if (!course) throw new AppError(`No course found with that ID`, 404);

    this.#clearCourseCache();
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
      const result = await QuizResult.findOne({ assessment: assessment._id });
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

    const weightQuestions = assessment.questions.map((q) => q.weight * 1);

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
        score += weightQuestions[iterator];
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
          { status: STATUS.COMPLETED, completedAt: Date.now() },
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
      eventBus.emit(CRITERIA.COURSE_COMPLETED, userId);
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
