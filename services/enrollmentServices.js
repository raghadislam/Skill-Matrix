const Enrollment = require('../models/enrollmentModel');
const notificationService = require('./notificationService');
const ApiFeatures = require('../utils/apiFeatures');
const TYPE = require('../utils/notificationType');

class EnrollmentService {
  async enroll(courseId, userId) {
    const enrollment = await Enrollment.create({
      courseId,
      userId,
    });

    notificationService
      .createNotification(
        userId,
        TYPE.ENROLLMENT_CONFIRMED,
        'Your enrollment is confirmed!',
      )
      .catch((err) => {
        console.error('Notification failed', err);
      });

    return enrollment;
  }

  #population(query) {
    query.populate({
      path: 'userId',
    });
    return query.populate({
      path: 'courseId',
      select: 'title',
    });
  }

  async getAllEnrollments(queryString) {
    const query = this.#population(Enrollment.find());
    const feature = new ApiFeatures(query, queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await feature.query.lean();
  }

  async getEnrollment(id) {
    const query = this.#population(Enrollment.findById(id));
    return await query.lean();
  }

  async updateEnrollment(id, data) {
    let query = Enrollment.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    query = this.#population(query);

    return await query.lean();
  }

  async deleteEnrollment(id) {
    return await Enrollment.findByIdAndDelete(id);
  }
}

const enrollment = new EnrollmentService();

module.exports = enrollment;
