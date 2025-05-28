const express = require('express');

const assessmentController = require('../controllers/assessmentController');
const protect = require('../middlewares/auth/protect');
const restrictTo = require('../middlewares/auth/restrictTo');
const ROLE = require('../utils/role');
const validate = require('../middlewares/validate');
const {
  getAllAssessmentsZodSchema,
} = require('../validators/assessmentValidator');

const router = express.Router();

router.use(protect, restrictTo(ROLE.ADMIN, ROLE.MANAGER, ROLE.TRAINER));

router
  .route('/')
  .get(
    validate(getAllAssessmentsZodSchema),
    assessmentController.getAllAssessment,
  );

module.exports = router;
