const express = require('express');

const endorsementController = require('../controllers/endorsementController');
const restrictTo = require('../middlewares/auth/restrictTo');
const protect = require('../middlewares/auth/protect');
const validate = require('../middlewares/validate');
const { ROLE } = require('../utils/enums');

const {
  getAllEndorsementsZodSchema,
  getEndorsementZodSchema,
  updateEndorsementZodSchema,
  deleteEndorsementZodSchema,
} = require('../validators/endorsementValidator');

const router = express.Router();

router.use(protect, restrictTo(ROLE.TRAINER, ROLE.ADMIN, ROLE.MANAGER));

router.get(
  '/',
  validate(getAllEndorsementsZodSchema),
  endorsementController.getAllEndorsements,
);

router
  .route('/:id')
  .get(validate(getEndorsementZodSchema), endorsementController.getEndorsement)
  .patch(
    validate(updateEndorsementZodSchema),
    endorsementController.updateEndorsement,
  )
  .delete(
    validate(deleteEndorsementZodSchema),
    endorsementController.deleteEndorsement,
  );

module.exports = router;
