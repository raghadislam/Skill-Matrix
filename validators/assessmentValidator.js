const z = require('zod');
const mongoose = require('mongoose');

const queryValidator = require('./queryValidator');
const idParamsValidator = require('./idParamsValidator');

const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format',
  });

const questionSchema = z
  .object({
    question: z.string().trim().min(1, 'Each question must have text'),

    options: z.array(z.string().trim()).superRefine((opts, ctx) => {
      if (opts.length < 2 || opts.length > 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['options'],
          message: 'Each question must have between 2 and 4 options',
        });
      }

      if (opts.some((opt) => opt === '')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['options'],
          message: 'Options cannot be empty strings',
        });
      }
    }),

    correctOptionIndex: z.coerce
      .number()
      .int('correctOptionIndex must be an integer')
      .nonnegative('correctOptionIndex must be a non-negative integer'),
  })
  .strict();

const baseAssessmentBody = z
  .object(
    {
      courseId: objectId,

      questions: z.array(questionSchema),

      passingScore: z.coerce.number().int('passingScore must be an integer'),

      timeLimitMinutes: z.coerce
        .number()
        .int('timeLimitMinutes must be an integer'),
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
  .strict();

const assessmentBodySchema = baseAssessmentBody.superRefine((data, ctx) => {
  const numQs = data.questions.length;

  const minPass = Math.ceil(numQs * 0.4);
  if (data.passingScore < minPass) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['passingScore'],
      message: `Passing score must be at least ${minPass} (40% of ${numQs} questions)`,
    });
  }

  const maxPass = Math.ceil(numQs * 0.7);
  if (data.passingScore > maxPass) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['passingScore'],
      message: `Passing score cannot exceed ${maxPass} (70% of ${numQs} questions)`,
    });
  }

  const minTime = numQs * 5;
  if (data.timeLimitMinutes < minTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['timeLimitMinutes'],
      message: `Time limit must be at least ${minTime} minutes (5 min per question)`,
    });
  }

  const maxTime = numQs * 8;
  if (data.timeLimitMinutes > maxTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['timeLimitMinutes'],
      message: `Time limit cannot exceed ${maxTime} minutes (8 min per question)`,
    });
  }
});

exports.getAllAssessmentsZodSchema = z.object({
  query: queryValidator,
});

exports.getAssessmentZodSchema = z.object({
  params: idParamsValidator,
});

exports.createAssessmentZodSchema = z.object({
  body: assessmentBodySchema,
});

exports.updateAssessmentZodSchema = z.object({
  params: idParamsValidator,
  body: baseAssessmentBody
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'You must provide at least one field to update',
      path: ['body'],
    }),
});
