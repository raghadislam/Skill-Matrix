const Review = require('../models/review.model');
const reviewService = require('../services/review.service');
const AppError = require('../utils/appError');
const { sendResponse } = require('../utils/responseUtils');

exports.setCourseUserIds = (req, res, next) => {
  if (!req.body.course) req.body.course = req.params.courseId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.checkIfAuthor = async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (req.user.role !== 'admin') {
    if (!review.user._id.equals(req.user._id))
      return next(
        new AppError(`You cannot edit or delete someone's else review.`, 403),
      );
  }
  next();
};

exports.getAllReviews = async (req, res, next) => {
  const reviews = await reviewService.getAllReviews(req.query);
  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { reviews },
  });
};

exports.createReview = async (req, res, next) => {
  const review = await reviewService.createReview(req.body, req.user);
  sendResponse(res, {
    statusCode: 201,
    status: 'success',
    data: { review },
  });
};

exports.updateReview = async (req, res, next) => {
  const review = await reviewService.updateReview(
    req.params.id,
    req.body,
    // req.user,
  );

  if (!review) return next(new AppError(`No review found with that ID`, 404));
  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { review },
  });
};

exports.deleteReview = async (req, res, next) => {
  const review = await reviewService.deleteReview(req.params.id);
  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }
  sendResponse(res, {
    statusCode: 204,
    status: 'success',
    data: null,
  });
};

exports.getReview = async (req, res, next) => {
  const review = await reviewService.getReview(req.params.id);
  if (!review) return next(new AppError(`No review found with that ID`, 404));

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    data: { review },
  });
};

// exports.getReview = factory.getOne(Review);

// exports.createReview = factory.createOne(Review);

// exports.updateReview = factory.updateOne(Review);

// exports.deleteReview = factory.deleteOne(Review);
