const express = require('express');

const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');

const {
  signupZodSchema,
  loginZodSchema,
  refreshZodSchema,
} = require('../validators/authValidator');

const router = express.Router();

router.post('/signup', validate(signupZodSchema), authController.signup);
router.post('/login', validate(loginZodSchema), authController.login);
router.post('/refresh', validate(refreshZodSchema), authController.refresh);

module.exports = router;
