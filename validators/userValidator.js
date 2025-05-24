const { z } = require('zod');

const queryZodSchema = require('./queryValidator');
const idParamsValidator = require('./idParamsValidator');
const ROLE = require('../utils/role');

exports.getAllUsersZodSchema = z.object({
  query: queryZodSchema.partial(),
});

exports.getUserZodSchema = z.object({
  params: idParamsValidator.partial(),
});

exports.deleteUserZodSchema = z.object({
  params: idParamsValidator.partial(),
});

exports.updateUserZodSchema = z.object({
  body: z
    .object(
      {
        name: z
          .string()
          .min(3, 'Name must be at least 3 characters long')
          .max(30, 'Name must not be more than 30 characters long')
          .trim()
          .optional(),

        email: z
          .string()
          .email({ message: 'Invalid email address' })
          .trim()
          .optional(),

        role: z
          .enum(Object.values(ROLE), {
            errorMap: () => ({
              message: `Role must be one of ${Object.values(ROLE).join(', ')}`,
            }),
          })
          .optional(),
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
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'You must provide at least one field to update',
      path: ['body'],
    }),
});

exports.createUserZodSchema = z.object({
  body: z
    .object(
      {
        name: z
          .string()
          .min(3, 'Name must be at least 3 characters long')
          .max(30, 'Name must not be more than 30 characters long')
          .trim(),

        email: z.string().email({ message: 'Invalid email address' }).trim(),

        role: z
          .enum(Object.values(ROLE), {
            errorMap: () => ({
              message: `Role must be one of ${Object.values(ROLE).join(', ')}`,
            }),
          })
          .default(ROLE.TRAINER),

        password: z
          .string()
          .min(8, 'Password must be at least 8 characters long')
          .trim(),

        confirmPassword: z.string().trim(),
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
    .strict()

    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    })

    .transform(({ confirmPassword, ...data }) => data),
});
