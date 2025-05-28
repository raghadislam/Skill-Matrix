const z = require('zod');

const queryValidator = require('./queryValidator');
const idParamsValidator = require('./idParamsValidator');

exports.getAllAssessmentsZodSchema = z.object({
  query: queryValidator,
});

exports.getAssessmentZodSchema = z.object({
  params: idParamsValidator,
});
