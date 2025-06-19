const express = require('express');

const userController = require('../controllers/userController');
const endorsementController = require('../controllers/endorsementController');
const uploadService = require('../services/uploadServices');

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
} = require('../validators/userValidator');

const router = express.Router();

router.use(protect);

router.get('/my-enrollments', userController.getMyEnrollments);
router.get('/inbox', userController.getMyNotifications);
router.get('/me', userController.getMe);

router.patch(
  '/updateMe',
  uploadService.getPhotoAndResumeUploader(),
  uploadService.resizeUserPhoto,
  uploadService.uploadResumeToCloudinary,
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
