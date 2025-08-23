const express = require('express');

const notificationController = require('../controllers/notification.controller');
const protect = require('../middlewares/auth/protect');
const restrictTo = require('../middlewares/auth/restrictTo');
const { ROLE } = require('../utils/enums');
const validate = require('../middlewares/validate');
const {
  getAllNotificationZodSchema,
  getNotificationZodSchema,
  createNotificationZodSchema,
} = require('../validators/notificationValidator');

const router = express.Router();

router.route();

router.use(protect);

router.patch(
  '/:id/mark-read',
  validate(getNotificationZodSchema),
  notificationController.markNotificationAsRead,
);

router.use(restrictTo(ROLE.ADMIN, ROLE.MANAGER));

router
  .route('/')
  .get(
    validate(getAllNotificationZodSchema),
    notificationController.getAllNotifications,
  )
  .post(
    validate(createNotificationZodSchema),
    notificationController.createNotification,
  );

router
  .route('/:id')
  .get(
    validate(getNotificationZodSchema),
    notificationController.getNotification,
  );

module.exports = router;
