const AuthService = require('../services/authService');
const sendResponse = require('../utils/sendResponse');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const { status, statusCode, token, user } = await AuthService.signup(
    req.body,
  );

  const expires = new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  );
  const cookieOptions = {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };
  res.cookie('jwt', token, cookieOptions);

  const message = 'Account created successfully.';
  sendResponse(res, { statusCode, status, message, token, data: { user } });
});
