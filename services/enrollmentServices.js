const Enrollment = require('../models/enrollmentModel');
const ApiFeatures = require('../utils/apiFeatures');

class EnrollmentService {
  async enroll(req) {
    return await Enrollment.create({
      courseId: req.body.courseId,
      userId: req.user._id,
    });
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
