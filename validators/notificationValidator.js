const z = require('zod');

const queryZodSchema = require('./queryValidator');

const getAllNotificationZodSchema = z.object({
  query: queryZodSchema,
});

module.exports = {
  getAllNotificationZodSchema,
};
