const AuthService = require('../services/auth.service');
const { sendResponse, sendCookie } = require('../utils/responseUtils');

exports.signup = async (req, res, next) => {
  const { status, statusCode, accessToken, refreshToken, user } =
    await AuthService.signup(req.body);

  sendCookie(res, refreshToken);

  const message = 'Account created successfully.';
  sendResponse(res, {
    statusCode,
    status,
    message,
    accessToken,
    data: { user },
  });
};

exports.login = async (req, res, next) => {
  const { status, statusCode, accessToken, refreshToken, user } =
    await AuthService.login(req.body);

  sendCookie(res, refreshToken);

  const message = 'Logged in successfully.';
  sendResponse(res, {
    statusCode,
    status,
    message,
    accessToken,
    data: { user },
  });
};

exports.refresh = async (req, res, next) => {
  const oldToken = req.cookies?.jwt;
  const { status, statusCode, accessToken, refreshToken } =
    await AuthService.refresh(oldToken);

  sendCookie(res, refreshToken);

  const message = 'Token refreshed successfully.';
  sendResponse(res, {
    statusCode,
    status,
    message,
    accessToken,
  });
};

exports.logout = async (req, res, next) => {
  const oldToken = req.cookies?.jwt;
  const { status, statusCode } = await AuthService.logout(oldToken);

  const message = 'Logged out successfully.';
  sendResponse(res, {
    statusCode,
    status,
    message,
  });
};
