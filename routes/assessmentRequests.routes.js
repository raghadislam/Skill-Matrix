const express = require('express');

const assessmentRequestController = require('../controllers/assessmentRequest.controller');
const protect = require('../middlewares/auth/protect');
const restrictTo = require('../middlewares/auth/restrictTo');
const { ROLE } = require('../utils/enums');
const validate = require('../middlewares/validate');
const {
  getAllRequestsZodSchema,
  getRequestZodSchema,
  createRequestZodSchema,
  updateRequestZodSchema,
  deleteRequestZodSchema,
} = require('../validators/assessmentRequestValidator');

const router = express.Router();

router.route();

router.use(
  protect,
  restrictTo(ROLE.ADMIN, ROLE.TRAINER, ROLE.MANAGER, ROLE.MENTOR),
);

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
  )
  .delete(
    validate(deleteRequestZodSchema),
    assessmentRequestController.deleteAssessmentRequest,
  );

module.exports = router;
