const express = require('express');

const reportController = require('../controllers/Report.controller');

const router = express.Router();

router.get('/skill-popularity', reportController.getSkillPopularity);
router.get('/avg-completion-time', reportController.getAvgCompletionTime);

module.exports = router;
