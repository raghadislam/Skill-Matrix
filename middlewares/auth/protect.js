const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const AppError = require('../../utils/appError');
const User = require('../../models/user.model');

module.exports = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token || token === 'null')
    throw new AppError(
      'You are not logged in! Please log in to get access.',
      401,
    );

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.ACCESS_TOKEN_SECRET,
  );
  const user = await User.findById(decoded.id).select(
    '+photoPublicId +resumePublicId',
  );
  if (!user)
    throw new AppError(
      'The user belonging to this token does no longer exist.',
      401,
    );

  if (user.changedPasswordAfter(decoded.iat))
    throw new AppError('Password changed recently. Please log in again.', 401);

  req.user = user;
  next();
};
