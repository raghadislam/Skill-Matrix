const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const validate = require('../middlewares/validate');
const protect = require('../middlewares/auth/protect');
const restrictTo = require('../middlewares/auth/restrictTo');
const ROLE = require('../utils/role');
const { signupZodSchema } = require('../validators/authValidator');
const {
  getAllUsersZodSchema,
  getUserZodSchema,
  deleteUserZodSchema,
} = require('../validators/userValidator');

const router = express.Router();

router.post('/signup', validate(signupZodSchema), authController.signup);

router.use(protect, restrictTo(ROLE.ADMIN, ROLE.MANAGER));

router
  .route('/')
  .get(validate(getAllUsersZodSchema), userController.getAllUsers);

router
  .route('/:id')
  .get(validate(getUserZodSchema), userController.getUser)
  .delete(validate(deleteUserZodSchema), userController.deleteUser);

module.exports = router;
