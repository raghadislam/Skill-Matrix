const sendResponse = (res, { statusCode, status, message, token, data }) => {
  res.status(statusCode).json({
    status,
    token,
    message,
    data,
  });
};

module.exports = sendResponse;
