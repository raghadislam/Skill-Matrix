const express = require('express');

const courseController = require('../controllers/course.controller');
const restrictTo = require('../middlewares/auth/restrictTo');
const protect = require('../middlewares/auth/protect');
const isEnrolled = require('../middlewares/enrolled');
const validate = require('../middlewares/validate');
const isRequested = require('../middlewares/requested');
const { ROLE } = require('../utils/enums');
const {
  getAllCoursesZodSchema,
  getCourseZodSchema,
  createCourseZodSchema,
  updateCourseZodSchema,
  deleteCourseZodSchema,
  answersSchema,
} = require('../validators/courseValidator');

const router = express.Router();

router.get(
  '/',
  validate(getAllCoursesZodSchema),
  courseController.getAllCourses,
);
router.get('/:id', validate(getCourseZodSchema), courseController.getCourse);

router.use(protect);

router.get(
  '/:id/assessments',
  restrictTo(ROLE.EMPLOYEE),
  validate(getCourseZodSchema),
  isEnrolled,
  courseController.getCourseAssessment,
);

router.post(
  '/:id/assessments/submit',
  restrictTo(ROLE.EMPLOYEE),
  validate(getCourseZodSchema),
  validate(answersSchema),
  isEnrolled,
  isRequested,
  courseController.submitCourseAssessment,
);

router.use(restrictTo(ROLE.TRAINER, ROLE.ADMIN));

router.post(
  '/',
  validate(createCourseZodSchema),
  courseController.createCourse,
);

router
  .route('/:id')
  .patch(validate(updateCourseZodSchema), courseController.updateCourse)
  .delete(validate(deleteCourseZodSchema), courseController.deleteCourse);

module.exports = router;
