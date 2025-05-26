const express = require('express');
const pathController = require('../controllers/learningPathController');
const validate = require('../middlewares/validate');
// const {
//   skillZodSchema,
//   updateSkillZodSchema,
// } = require('../validators/skillValidator');

const {
  getAllPathsZodSchema,
  getPathZodSchema,
  deletePathZodSchema,
  createPathSchema,
  updatePathZodSchema,
} = require('../validators/pathValidators');

const router = express.Router();

router
  .route('/')
  .get(validate(getAllPathsZodSchema), pathController.getAllPaths)
  .post(validate(createPathSchema), pathController.createPath);

router
  .route('/:id')
  .get(validate(getPathZodSchema), pathController.getPath)
  .patch(validate(updatePathZodSchema), pathController.updatePath)
  .delete(validate(deletePathZodSchema), pathController.deletePath);

module.exports = router;
