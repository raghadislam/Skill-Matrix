const express = require('express');

const courseController = require('../controllers/courseController');
const restrictTo = require('../middlewares/auth/restrictTo');
const protect = require('../middlewares/auth/protect');
const validate = require('../middlewares/validate');
const ROLE = require('../utils/role');
const {
  getAllCoursesZodSchema,
  getCourseZodSchema,
  createCourseZodSchema,
  updateCourseZodSchema,
  deleteCourseZodSchema,
} = require('../validators/courseValidator');

const router = express.Router();

router.get(
  '/',
  validate(getAllCoursesZodSchema),
  courseController.getAllCourses,
);
router.get('/:id', validate(getCourseZodSchema), courseController.getCourse);
router.get(
  '/:id/assessments',
  validate(getCourseZodSchema),
  courseController.getCourseAssessment,
);

router.use(protect, restrictTo(ROLE.TRAINER, ROLE.ADMIN));

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
