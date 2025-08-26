const express = require('express');
const reviewController = require('../controllers/review.controller');
const protect = require('../middlewares/auth/protect');
const restrictTo = require('../middlewares/auth/restrictTo');

const router = express.Router({ mergeParams: true });
router.use(protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    restrictTo('employee'),
    reviewController.setCourseUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    restrictTo('employee', 'admin'),
    reviewController.checkIfAuthor,
    reviewController.updateReview,
  )
  .delete(
    restrictTo('employee', 'admin'),
    reviewController.checkIfAuthor,
    reviewController.deleteReview,
  );
module.exports = router;
