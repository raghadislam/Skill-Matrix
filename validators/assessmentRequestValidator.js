const z = require('zod');

const queryValidator = require('./queryValidator');

const getAllRequestsZodSchema = z.object({
  query: queryValidator,
});

module.exports = { getAllRequestsZodSchema };
