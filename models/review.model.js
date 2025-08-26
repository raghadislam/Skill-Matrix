const mongoose = require('mongoose');
const Course = require('./course.model');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
      trim: true,
      minlength: [2, 'Review is too short'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be >= 1'],
      max: [5, 'Rating must be <= 5'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Review must belong to a course'],
      index: true,
    },
  },
  {
    timestamps: true,
    id: false,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.index({ course: 1, user: 1 }, { unique: true, background: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate(
    'course',
    'title category description ratingsAverage ratingsQuantity',
  ).populate('user', 'name email role');
  next();
});

const toObjectId = (v) => {
  const id = v && typeof v === 'object' && v._id ? v._id : v;

  if (id instanceof mongoose.Types.ObjectId) return id;
  if (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  }
  return null;
};

reviewSchema.statics.calcAverageRatings = async function (courseId) {
  const _id = toObjectId(courseId);
  if (!_id) return;

  const stats = await this.aggregate([
    { $match: { course: _id } },
    {
      $group: {
        _id: '$course',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
    { $project: { nRating: 1, avgRating: { $round: ['$avgRating', 1] } } },
  ]);

  if (stats.length > 0) {
    await Course.updateOne(
      { _id },
      {
        $set: {
          ratingsQuantity: stats[0].nRating,
          ratingsAverage: stats[0].avgRating,
        },
      },
    );
  } else {
    await Course.updateOne(
      { _id },
      { $set: { ratingsQuantity: 0 }, $unset: { ratingsAverage: '' } },
    );
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatings(this.course, {
    session: this.$session?.(),
  });
});

reviewSchema.pre(/^find/, function (next) {
  if (this.getOptions && this.getOptions().skipAutoPopulate) return next();
  this.populate(
    'course',
    'title category description ratingsAverage ratingsQuantity',
  ).populate('user', 'name email role');
  next();
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  const filter = this.getFilter?.() || this.getQuery();
  // disable auto-populate here so course stays as an ObjectId
  this._docBefore = await this.model
    .findOne(filter)
    .select('course')
    .setOptions({ skipAutoPopulate: true });
  next();
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (this._docBefore?.course) {
    await this._docBefore.constructor.calcAverageRatings(
      this._docBefore.course,
    );
  }
  if (
    doc?.course &&
    (!this._docBefore || !doc.course.equals(this._docBefore.course))
  ) {
    await doc.constructor.calcAverageRatings(doc.course);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
