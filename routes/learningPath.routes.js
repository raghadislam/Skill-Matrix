const express = require('express');
const pathController = require('../controllers/learningPath.controller');
const validate = require('../middlewares/validate');
const restrictTo = require('../middlewares/auth/restrictTo');
const protect = require('../middlewares/auth/protect');
const { ROLE } = require('../utils/enums');

const {
  getAllPathsZodSchema,
  getPathZodSchema,
  deletePathZodSchema,
  createPathSchema,
  updatePathZodSchema,
  autoEnrollZodSchema,
} = require('../validators/pathValidators');

const router = express.Router();

router.get('/', validate(getAllPathsZodSchema), pathController.getAllPaths);
router.get('/:id', validate(getPathZodSchema), pathController.getPath);

router.post(
  '/:pathId/auto-enroll',
  protect,
  restrictTo(ROLE.EMPLOYEE),
  validate(autoEnrollZodSchema),
  pathController.autoEnroll,
);

router.use(protect, restrictTo(ROLE.MANAGER, ROLE.ADMIN));

router.post('/', validate(createPathSchema), pathController.createPath);

router
  .route('/:id')
  .patch(validate(updatePathZodSchema), pathController.updatePath)
  .delete(validate(deletePathZodSchema), pathController.deletePath);

module.exports = router;
