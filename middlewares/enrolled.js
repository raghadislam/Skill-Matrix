const Enrollment = require('../models/enrollmentModel');
const AppError = require('../utils/appError');
const ROLE = require('../utils/role');

module.exports = async (req, res, next) => {
  if (
    req.user.role === ROLE.ADMIN ||
    req.user.role === ROLE.TRAINER ||
    req.user.role === ROLE.MANAGER
  )
    next();

  const enrollment = await Enrollment.findOne({
    courseId: req.params.id,
    userId: req.user.id,
  });

  if (!enrollment) {
    throw new AppError(
      'You did not enroll to this course! Please enroll to get access.',
      401,
    );
  }
  req.enrollmentStatus = enrollment.status;
  next();
};
