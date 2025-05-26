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
} = require('../validators/courseValidator');

const router = express.Router();

router.get(
  '/',
  validate(getAllCoursesZodSchema),
  courseController.getAllCourses,
);
router.get('/:id', validate(getCourseZodSchema), courseController.getCourse);

router.use(protect, restrictTo(ROLE.TRAINER, ROLE.ADMIN));

router.post(
  '/',
  validate(createCourseZodSchema),
  courseController.createCourse,
);

module.exports = router;
