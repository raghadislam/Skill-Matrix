exports.sendResponse = (
  res,
  {
    statusCode,
    status,
    message,
    accessToken,
    refreshToken,
    data,
    assessmentStatus,
  },
) => {
  res.status(statusCode).json({
    status,
    accessToken,
    refreshToken,
    message,
    data,
    assessmentStatus,
  });
};

exports.sendCookie = (res, token) => {
  const expires = new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  );
  const cookieOptions = {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };
  res.cookie('jwt', token, cookieOptions);
};
