const express = require('express');

const courseController = require('../controllers/courseController');
const validate = require('../middlewares/validate');
const {
  getAllCoursesZodSchema,
  getCourseZodSchema,
} = require('../validators/courseValidator');

const router = express.Router();

router
  .route('/')
  .get(validate(getAllCoursesZodSchema), courseController.getAllCourses);

router
  .route('/:id')
  .get(validate(getCourseZodSchema), courseController.getCourse);

module.exports = router;
