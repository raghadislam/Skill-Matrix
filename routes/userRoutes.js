const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const validate = require('../middlewares/validate');
const protect = require('../middlewares/auth/protect');
const restrictTo = require('../middlewares/auth/restrictTo');
const ROLE = require('../utils/role');
const {
  getAllUsersZodSchema,
  getUserZodSchema,
  deleteUserZodSchema,
  updateUserZodSchema,
  createUserZodSchema,
} = require('../validators/userValidator');
const {
  signupZodSchema,
  loginZodSchema,
} = require('../validators/authValidator');

const router = express.Router();

router.post('/signup', validate(signupZodSchema), authController.signup);
router.post('/login', validate(loginZodSchema), authController.login);

router.use(protect, restrictTo(ROLE.ADMIN, ROLE.MANAGER));

router
  .route('/')
  .get(validate(getAllUsersZodSchema), userController.getAllUsers)
  .post(validate(createUserZodSchema), userController.createUser);

router
  .route('/:id')
  .get(validate(getUserZodSchema), userController.getUser)
  .delete(validate(deleteUserZodSchema), userController.deleteUser)
  .patch(validate(updateUserZodSchema), userController.updateUser);

module.exports = router;
