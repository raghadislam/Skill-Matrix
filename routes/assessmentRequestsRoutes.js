const express = require('express');

const assessmentRequestController = require('../controllers/assessmentRequestController');
const protect = require('../middlewares/auth/protect');
const restrictTo = require('../middlewares/auth/restrictTo');
const ROLE = require('../utils/role');
const validate = require('../middlewares/validate');
const {
  getAllRequestsZodSchema,
  getRequestZodSchema,
  createRequestZodSchema,
  updateRequestZodSchema,
} = require('../validators/assessmentRequestValidator');

const router = express.Router();

router.route();

router.use(protect, restrictTo(ROLE.ADMIN, ROLE.TRAINER, ROLE.MANAGER));

router
  .route('/')
  .get(
    validate(getAllRequestsZodSchema),
    assessmentRequestController.getAllAssessmentRequests,
  )
  .post(
    validate(createRequestZodSchema),
    assessmentRequestController.createAssessmentRequest,
  );

router
  .route('/:id')
  .get(
    validate(getRequestZodSchema),
    assessmentRequestController.getAssessmentRequest,
  )
  .patch(
    validate(updateRequestZodSchema),
    assessmentRequestController.updateAssessmentRequest,
  );

module.exports = router;
