const badgeCache = new Map();
const Badge = require('../models/BadgeModel');
const UserBadge = require('../models/userBadgeModel');
const Endorsement = require('../models/endorsementModel');
const Enrollment = require('../models/enrollmentModel');
const { STATUS } = require('../utils/enums');
const { CRITERIA } = require('../utils/enums');

async function loadBadgesToCache() {
  badgeCache.clear();

  const badges = await Badge.find();

  badges.forEach((badge) => {
    const { type, count } = badge.criteria;
    if (!badgeCache.has(type)) {
      badgeCache.set(type, new Map());
    }
    badgeCache.get(type).set(count, badge);
  });

  console.log('✅ Badge cache loaded');
}

const badgeEvaluators = {
  [CRITERIA.COURSE_COMPLETED]: async (user, count) => {
    const completed = await Enrollment.find({
      user: user._id,
      status: STATUS.COMPLETED,
    });
    return completed.length >= count;
  },
  [CRITERIA.SKILL_ENDORSED]: async (user, count) => {
    const endorsed = await Endorsement.find({
      endorsee: user._id,
    });

    return endorsed.length >= count;
  },
};

async function evaluateAndAwardBadges(user, type) {
  const typeMap = badgeCache.get(type);
  if (!typeMap) return;

  await Promise.all(
    Array.from(typeMap.entries()).map(async ([count, badge]) => {
      const hasReached = await badgeEvaluators[type](user, count);
      if (!hasReached) return;

      const alreadyAwarded = await UserBadge.exists({
        userId: user._id,
        badgeId: badge._id,
      });
      if (alreadyAwarded) return;

      await UserBadge.create({ userId: user._id, badgeId: badge._id });

      console.log(`🏅 ${user.name} earned badge: ${badge.name}`);
    }),
  );
}

module.exports = {
  loadBadgesToCache,
  evaluateAndAwardBadges,
};
