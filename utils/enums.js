const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

const WEIGHT = Object.freeze({
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
});

const ROLE = {
  EMPLOYEE: 'employee',
  TRAINER: 'trainer',
  MANAGER: 'manager',
  ADMIN: 'admin',
  MENTOR: 'mentor',
};

const TYPE = {
  COURSE_DEADLINE: 'COURSE_DEADLINE',
  SYSTEM_ALERT: 'SYSTEM_ALERT',

  ENROLLMENT_CONFIRMED: 'ENROLLMENT_CONFIRMED',
  ENROLLMENT_COMPLETED: 'ENROLLMENT_COMPLETED',

  ASSESSMENT_DEADLINE: 'ASSESSMENT_DEADLINE',
  ASSESSMENT_ASSIGNED: 'ASSESSMENT_ASSIGNED',
  ASSESSMENT_PASSED: 'ASSESSMENT_PASSED',
  ASSESSMENT_FAILED: 'ASSESSMENT_FAILED',
  QUIZ_RESULT: 'QUIZ_RESULT',
};

const DEPT = {
  MARKETING: 'Marketing',
  DESIGN: 'Design',
  DEVELOPMENT: 'Development',
};

const STATUS = {
  ENROLLED: 'enrolled',
  IN_PROGRESS: 'in progress',
  COMPLETED: 'completed',
};

const CRITERIA = {
  COURSE_COMPLETED: 'COURSE_COMPLETED',
  SKILL_ENDORSED: 'SKILL_ENDORSED',
};

const HISTORY_TYPE = {
  CREATE: 'create',
  RENAME: 'rename',
  MERGE: 'merge',
  SPLIT: 'split',
  UPDATE: 'update',
  DELETE: 'delete',
};

module.exports = {
  ROLE,
  DEPT,
  STATUS,
  TYPE,
  DIFFICULTY,
  WEIGHT,
  CRITERIA,
  HISTORY_TYPE,
};
