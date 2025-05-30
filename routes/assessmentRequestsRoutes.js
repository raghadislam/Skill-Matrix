const express = require('express');

const assessmentRequestController = require('../controllers/assessmentRequestController');
const protect = require('../middlewares/auth/protect');
const restrictTo = require('../middlewares/auth/restrictTo');
const ROLE = require('../utils/role');
const validate = require('../middlewares/validate');
const {
  getAllRequestsZodSchema,
} = require('../validators/assessmentRequestValidator');

const router = express.Router();

router.route();

router.use(protect, restrictTo(ROLE.ADMIN, ROLE.TRAINER, ROLE.MANAGER));

router
  .route('/')
  .get(
    validate(getAllRequestsZodSchema),
    assessmentRequestController.getAllAssessmentRequests,
  );

module.exports = router;
