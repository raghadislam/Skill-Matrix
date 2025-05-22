const express = require('express');

const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { signupZodSchema } = require('../validators/authValidator');

const router = express.Router();

router.post('/signup', validate(signupZodSchema), authController.signup);

module.exports = router;
