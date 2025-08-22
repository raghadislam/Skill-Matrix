const express = require('express');

const userController = require('../controllers/user.controller');
const endorsementController = require('../controllers/endorsement.controller');

const validate = require('../middlewares/validate');
const protect = require('../middlewares/auth/protect');
const restrictTo = require('../middlewares/auth/restrictTo');
const { ROLE } = require('../utils/enums');
const {
  getAllUsersZodSchema,
  getUserZodSchema,
  deleteUserZodSchema,
  updateUserZodSchema,
  createUserZodSchema,
  changeMeZodSchema,
} = require('../validators/userValidator');

const router = express.Router();

router.use(protect);

router.get('/my-enrollments', userController.getMyEnrollments);
router.get('/inbox', userController.getMyNotifications);
router.get('/me', userController.getMe);

const upload = require('../middlewares/multer');
const {
  handlePhotoUpload,
  handleResumeUpload,
} = require('../middlewares/uploadsHandler');

router.patch(
  '/updateMe',
  validate(changeMeZodSchema),
  upload,
  handlePhotoUpload,
  handleResumeUpload,
  userController.updateMe,
);

router.use(restrictTo(ROLE.ADMIN, ROLE.MANAGER));

router.get(
  '/:id/skills',
  validate(getUserZodSchema),
  endorsementController.getSkillsAndEndorsements,
);

router
  .route('/')
  .get(validate(getAllUsersZodSchema), userController.getAllUsers)
  .post(validate(createUserZodSchema), userController.createUser);

router
  .route('/:id')
  .get(validate(getUserZodSchema), userController.getUser)
  .delete(validate(deleteUserZodSchema), userController.deleteUser)
  .patch(validate(updateUserZodSchema), userController.updateUser);

router.get(
  '/:id/enrollments',
  validate(getUserZodSchema),
  userController.getUserEnrollments,
);

module.exports = router;
