const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const AppError = require('../../utils/appError');
const User = require('../../models/userModel');

module.exports = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    throw new AppError(
      'You are not logged in! Please log in to get access.',
      401,
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
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
