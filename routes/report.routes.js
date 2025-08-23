const express = require('express');

const reportController = require('../controllers/report.controller');
const restrictTo = require('../middlewares/auth/restrictTo');
const protect = require('../middlewares/auth/protect');
const { ROLE } = require('../utils/enums');

const router = express.Router();

router.use(
  protect,
  restrictTo(ROLE.ADMIN, ROLE.MANAGER, ROLE.TRAINER, ROLE.MENTOR),
);

router.get('/skill-popularity', reportController.getSkillPopularity);

router.get('/avg-completion-time', reportController.getAvgCompletionTime);

router.get(
  '/monthly-notification-volume',
  restrictTo(ROLE.ADMIN, ROLE.MANAGER),
  reportController.getMonthlyNotificationVolume,
);

router.get('/course-funnel/:courseId', reportController.getCourseFunnel);

module.exports = router;
