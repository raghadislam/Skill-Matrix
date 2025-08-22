const express = require('express');

const enrollmentController = require('../controllers/enrollment.controller');
const validate = require('../middlewares/validate');
const protect = require('../middlewares/auth/protect');
const { ROLE } = require('../utils/enums');
const restrictTo = require('../middlewares/auth/restrictTo');
const {
  enrollSchema,
  getAllEnrollmentsZodSchema,
  getEnrollmentZodSchema,
  updateEnrollmentZodSchema,
  deleteEnrollmentZodSchema,
} = require('../validators/enrollmentValidators');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(
    validate(getAllEnrollmentsZodSchema),
    restrictTo(ROLE.ADMIN),
    enrollmentController.getAllEnrollments,
  )
  .post(
    restrictTo(ROLE.EMPLOYEE),
    validate(enrollSchema),
    enrollmentController.enroll,
  );

restrictTo(ROLE.ADMIN);
router
  .route('/:id')
  .get(validate(getEnrollmentZodSchema), enrollmentController.getEnrollment)
  .patch(
    validate(updateEnrollmentZodSchema),
    enrollmentController.updateEnrollment,
  )
  .delete(
    validate(deleteEnrollmentZodSchema),
    enrollmentController.deleteEnrollment,
  );

module.exports = router;
