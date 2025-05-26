const express = require('express');
const pathController = require('../controllers/learningPathController');
// const validate = require('../middlewares/validate');
// const {
//   skillZodSchema,
//   updateSkillZodSchema,
// } = require('../validators/skillValidator');

const router = express.Router();

router
  .route('/')
  .get(pathController.getAllPaths)
  .post(pathController.createPath);

router
  .route('/:id')
  .get(pathController.getPath)
  .patch(pathController.updatePath)
  .delete(pathController.deletePath);

module.exports = router;
