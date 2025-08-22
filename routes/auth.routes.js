const express = require('express');

const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');

const {
  signupZodSchema,
  loginZodSchema,
  refreshZodSchema,
  logoutZodSchema,
} = require('../validators/authValidator');

const router = express.Router();

router.post('/signup', validate(signupZodSchema), authController.signup);
router.post('/login', validate(loginZodSchema), authController.login);
router.post('/refresh', validate(refreshZodSchema), authController.refresh);
router.post('/logout', validate(logoutZodSchema), authController.logout);

module.exports = router;
