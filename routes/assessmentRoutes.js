const express = require('express');

const assessmentController = require('../controllers/assessmentController');
const protect = require('../middlewares/auth/protect');
const restrictTo = require('../middlewares/auth/restrictTo');
const ROLE = require('../utils/role');
const validate = require('../middlewares/validate');
const {
  getAllAssessmentsZodSchema,
  getAssessmentZodSchema,
  createAssessmentZodSchema,
} = require('../validators/assessmentValidator');

const router = express.Router();

router.use(protect, restrictTo(ROLE.ADMIN, ROLE.TRAINER));

router.post(
  '/',
  validate(createAssessmentZodSchema),
  assessmentController.createAssessment,
);

router.use(restrictTo(ROLE.MANAGE));

router.get(
  '/',
  validate(getAllAssessmentsZodSchema),
  assessmentController.getAllAssessments,
);
router.get(
  '/:id',
  validate(getAssessmentZodSchema),
  assessmentController.getAssessment,
);

module.exports = router;
