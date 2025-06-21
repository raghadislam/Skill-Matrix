const eventBus = require('../utils/eventBus');
const { evaluateAndAwardBadges } = require('./badgeEngine');
const { CRITERIA } = require('../utils/enums');

eventBus.on('COURSE_COMPLETED', async (user) => {
  try {
    await evaluateAndAwardBadges(user, CRITERIA.COURSE_COMPLETED);
  } catch (err) {
    console.error('Failed to evaluate badges on COURSE_COMPLETED:', err);
  }
});

eventBus.on('SKILL_ENDORSED', async (user) => {
  try {
    await evaluateAndAwardBadges(user, CRITERIA.SKILL_ENDORSED);
  } catch (err) {
    console.error('Failed to evaluate badges on SKILL_ENDORSED:', err);
  }
});
