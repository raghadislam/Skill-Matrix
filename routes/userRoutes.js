const express = require('express');

const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { signupSchema } = require('../validators/authValidator');

const router = express.Router();

router.post('/signup', validate(signupSchema), authController.signup);

module.exports = router;
