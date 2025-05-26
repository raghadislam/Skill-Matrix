const z = require('zod');

const idParamsValidator = require('./idParamsValidator');
const queryZodSchema = require('./queryValidator');

exports.getAllCoursesZodSchema = z.object({
  query: queryZodSchema,
});

exports.getCourseZodSchema = z.object({
  params: idParamsValidator,
});
