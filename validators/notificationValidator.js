const z = require('zod');

const queryZodSchema = require('./queryValidator');
const idParamsValidator = require('./idParamsValidator');

const getAllNotificationZodSchema = z.object({
  query: queryZodSchema,
});

const getNotificationZodSchema = z.object({
  params: idParamsValidator,
});

module.exports = {
  getAllNotificationZodSchema,
  getNotificationZodSchema,
};
