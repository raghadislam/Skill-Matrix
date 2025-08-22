const express = require('express');

const reportController = require('../controllers/Report.controller');

const router = express.Router();

router.get('/skill-popularity', reportController.getSkillPopularity);

module.exports = router;
