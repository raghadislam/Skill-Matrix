const z = require('zod');

const idParamsValidator = require('./idParamsValidator');

exports.getCourseZodSchema = z.object({
  params: idParamsValidator,
});
