const z = require('zod');

const { ROLE, DEPT } = require('../utils/enums');

const signupZodSchema = z.object({
  body: z
    .object(
      {
        name: z
          .string()
          .min(3, 'Name must be at least 3 characters long')
          .max(30, 'Name must not be more than 30 characters long')
          .trim(),
        email: z.string().email({ message: 'Invalid email address' }).trim(),
        password: z
          .string()
          .min(8, 'Password must be at least 8 characters long')
          .trim(),
        confirmPassword: z.string().trim(),
        role: z
          .enum([ROLE.EMPLOYEE], {
            errorMap: () => ({
              message: `Role must be "${ROLE.EMPLOYEE}"`,
            }),
          })
          .optional()
          .default(ROLE.EMPLOYEE),
        department: z.enum(Object.values(DEPT), {
          errorMap: () => ({
            message: `category must be one of: ${Object.values(DEPT).join(', ')}`,
          }),
        }),
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

const loginZodSchema = z.object({
  body: z
    .object(
      {
        email: z.string().email({ message: 'Invalid email address' }).trim(),
        password: z
          .string()
          .min(8, 'Password must be at least 8 characters long')
          .trim(),
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

const emptyObject = z
  .object(
    {},
    {
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
  .strict();

const refreshZodSchema = z
  .object({
    body: emptyObject,
    params: emptyObject,
    query: emptyObject,
  })
  .partial();

const logoutZodSchema = z
  .object({
    body: emptyObject,
    params: emptyObject,
    query: emptyObject,
  })
  .partial();

module.exports = {
  signupZodSchema,
  loginZodSchema,
  refreshZodSchema,
  logoutZodSchema,
};
