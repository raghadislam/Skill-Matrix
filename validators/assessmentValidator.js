const z = require('zod');

const queryValidator = require('./queryValidator');

exports.getAllAssessmentsZodSchema = z.object({
  query: queryValidator,
});
