const express = require('express');
const skillController = require('../controllers/skillController');
const endorsementController = require('../controllers/endorsementController');
const validate = require('../middlewares/validate');
const restrictTo = require('../middlewares/auth/restrictTo');
const protect = require('../middlewares/auth/protect');
const { ROLE } = require('../utils/enums');
const {
  skillZodSchema,
  updateSkillZodSchema,
} = require('../validators/skillValidator');
const { endorseSchema } = require('../validators/endorsementValidator');

const router = express.Router();

router.post(
  '/:id/endorse',
  validate(endorseSchema),
  protect,
  restrictTo(ROLE.ADMIN, ROLE.MANAGER),
  endorsementController.endorse,
);

router
  .route('/')
  .get(skillController.getAllSkills)
  .post(
    protect,
    restrictTo(ROLE.ADMIN, ROLE.MANAGER),
    validate(skillZodSchema),
    skillController.createSkill,
  );

router
  .route('/:id')
  .get(skillController.getSkill)
  .patch(
    protect,
    restrictTo(ROLE.ADMIN, ROLE.MANAGER),
    validate(updateSkillZodSchema),
    skillController.updateSkill,
  )
  .delete(
    protect,
    restrictTo(ROLE.ADMIN, ROLE.MANAGER),
    skillController.deleteSkill,
  );

module.exports = router;
