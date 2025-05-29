const express = require('express');

const enrollmentController = require('../controllers/enrollmentController');
const validate = require('../middlewares/validate');
const protect = require('../middlewares/auth/protect');
const { enrollSchema } = require('../validators/enrollmentValidators');
const ROLE = require('../utils/role');
const restrictTo = require('../middlewares/auth/restrictTo');

const router = express.Router();

router.use(protect, restrictTo(ROLE.EMPLOYEE));

router.route('/').post(validate(enrollSchema), enrollmentController.enroll);

module.exports = router;
