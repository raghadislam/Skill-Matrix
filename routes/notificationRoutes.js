const express = require('express');

const notificationController = require('../controllers/notificationController');
const protect = require('../middlewares/auth/protect');
const restrictTo = require('../middlewares/auth/restrictTo');
const ROLE = require('../utils/role');
const validate = require('../middlewares/validate');
const {
  getAllNotificationZodSchema,
  getNotificationZodSchema,
} = require('../validators/notificationValidator');

const router = express.Router();

router.route();

router.use(protect, restrictTo(ROLE.ADMIN, ROLE.MANAGER));

router
  .route('/')
  .get(
    validate(getAllNotificationZodSchema),
    notificationController.getAllNotifications,
  );

router
  .route('/:id')
  .get(
    validate(getNotificationZodSchema),
    notificationController.getNotification,
  );

module.exports = router;
