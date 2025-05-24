const z = require('zod');

const ROLE = require('../utils/role');

exports.signupZodSchema = z.object({
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
          .enum([ROLE.EMPLOYEE, ROLE.TRAINER], {
            errorMap: () => ({
              message: `Role must be either "${ROLE.EMPLOYEE}" or "${ROLE.TRAINER}"`,
            }),
          })
          .optional()
          .default(ROLE.TRAINER),
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

exports.loginZodSchema = z.object({
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
