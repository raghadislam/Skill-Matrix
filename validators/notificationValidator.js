const z = require('zod');
const mongoose = require('mongoose');

const { TYPE } = require('../utils/enums');
const queryZodSchema = require('./queryValidator');
const idParamsValidator = require('./idParamsValidator');

const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format',
  });

const getAllNotificationZodSchema = z.object({
  query: queryZodSchema,
});

const getNotificationZodSchema = z.object({
  params: idParamsValidator,
});

const createNotificationZodSchema = z.object({
  body: z
    .object(
      {
        user: objectId,

        type: z
          .enum(Object.values(TYPE), {
            errorMap: () => ({
              message: `Role must be one of ${Object.values(TYPE).join(', ')}`,
            }),
          })
          .optional(),

        message: z.string().min(1, 'A notification must have a message').trim(),
      },
      {
        // to catch the extra keys
        errorMap: (issue, ctx) => {
          if (issue.code === z.ZodIssueCode.unrecognized_keys) {
            const extraFields = issue.keys.join(', ');
            return {
              message: `No extra fields are permitted in the request body: ${extraFields}`,
            };
          }
          return { message: ctx.defaultError };
        },
      },
    )
    .strict(),
});

module.exports = {
  getAllNotificationZodSchema,
  getNotificationZodSchema,
  createNotificationZodSchema,
};
