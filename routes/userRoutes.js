const express = require('express');

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

const router = express.Router();

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
