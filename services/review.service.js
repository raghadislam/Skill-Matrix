const Review = require('../models/review.model');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

class ReviewService {
  async getAllReviews(queryString) {
    const query = Review.find();
    const feature = new APIFeatures(query, queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await feature.query.lean({ virtuals: true });
  }

  async createReview(data) {
    try {
      const review = await Review.create(data);
      return await review.populate([
        { path: 'course', select: 'title category description' },
        { path: 'user', select: 'name email role' },
      ]);
    } catch (err) {
      if (err.code === 11000) {
        throw new AppError('You have already reviewed this course.', 400);
      }
      throw err;
    }
  }

  async getReview(id) {
    const review = await Review.findById(id).lean({ virtuals: true });
    if (!review) throw new AppError(`No review found with that ID`, 404);

    return review;
  }

  async updateReview(id, data) {
    const review = await Review.findById(id);

    if (!review) throw new AppError(`No assessment found with that ID`, 404);
    review.set(data);
    await review.save();

    await review.populate([
      { path: 'course', select: 'title category description' },
      { path: 'user', select: 'name email role' },
    ]);

    return review.toObject({ virtuals: true });
  }

  async deleteReview(id) {
    const doc = await Review.findByIdAndDelete(id);
    if (!doc) throw new AppError('No review found with that ID', 404);
    return { success: true };
  }
}

module.exports = new ReviewService();
