const { fromError } = require('zod-validation-error');

const AppError = require('../utils/appError');

module.exports = (schema) => async (req, res, next) => {
  const result = await schema.safeParseAsync({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const error = fromError(result.error);
    throw new AppError(error.message, 400);
  }

  Object.entries(result.data).forEach(([key, data]) => {
    req[key] = data;
  });

  next();
};
