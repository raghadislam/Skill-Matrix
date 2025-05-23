const { fromError } = require('zod-validation-error');

const AppError = require('../utils/appError');

module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse({
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
