const express = require('express');
const skillController = require('../controllers/skillController');
const validate = require('../middlewares/validate');
const {
  skillZodSchema,
  updateSkillZodSchema,
} = require('../validators/skillValidator');

const router = express.Router();

router
  .route('/')
  .get(skillController.getAllSkills)
  .post(validate(skillZodSchema), skillController.createSkill);

router
  .route('/:id')
  .patch(validate(updateSkillZodSchema), skillController.updateSkill)
  .delete(skillController.deleteSkill);

module.exports = router;
