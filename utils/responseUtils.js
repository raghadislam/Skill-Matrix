exports.sendResponse = (
  res,
  { statusCode, status, message, token, data, assessmentStatus },
) => {
  res.status(statusCode).json({
    status,
    token,
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
