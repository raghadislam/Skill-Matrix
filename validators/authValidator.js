const z = require('zod');

const ROLE = require('../utils/role');

exports.signupSchema = z.object({
  body: z
    .object({
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
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    })
    .transform(({ confirmPassword, ...data }) => data),
});
