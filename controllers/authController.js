const AuthService = require('../services/authService');
const { sendResponse, sendCookie } = require('../utils/responseUtils');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res) => {
  const { status, statusCode, token, user } = await AuthService.signup(
    req.body,
  );

  sendCookie(res, token);

  const message = 'Account created successfully.';
  sendResponse(res, { statusCode, status, message, token, data: { user } });
});

exports.login = catchAsync(async (req, res, next) => {
  const { status, statusCode, token, user } = await AuthService.login(req.body);

  sendCookie(res, token);

  const message = 'Logged in successfully.';
  sendResponse(res, { statusCode, status, message, token, data: { user } });
});
