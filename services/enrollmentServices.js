const Enrollment = require('../models/enrollmentModel');

class EnrollmentService {
  async enroll(req) {
    return await Enrollment.create({
      courseId: req.body.courseId,
      userId: req.user._id,
    });
  }
}

const enrollment = new EnrollmentService();

module.exports = enrollment;
