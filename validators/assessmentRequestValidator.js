const z = require('zod');

const queryValidator = require('./queryValidator');
const idParamsValidator = require('./idParamsValidator');

const getAllRequestsZodSchema = z.object({
  query: queryValidator,
});

const getRequestZodSchema = z.object({
  params: idParamsValidator,
});

module.exports = { getAllRequestsZodSchema, getRequestZodSchema };
