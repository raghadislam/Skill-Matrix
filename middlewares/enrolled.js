const Enrollment = require('../models/enrollmentModel');
const AppError = require('../utils/appError');

module.exports = (req, res, next) => {
  const enrollment = Enrollment.findOne({
    courseId: req.params.id,
    userId: req.user.id,
  });
  if (!enrollment) {
    throw new AppError(
      'You did not enroll to this coursr! Please enroll to get access.',
      401,
    );
  }
  next();
};
