const Endorsement = require('../models/endorsement.model');
const Enrollment = require('../models/enrollment.model');

class ReportService {
  async getSkillPopularity(limit, page, category, min) {
    const skip = (page - 1) * limit;

    const report = await Endorsement.aggregate([
      {
        $group: {
          _id: '$skill',
          endorsementCount: { $sum: 1 },
        },
      },

      {
        $lookup: {
          from: 'skills',
          localField: '_id',
          foreignField: '_id',
          as: 'skill',
        },
      },

      { $unwind: '$skill' },

      ...(category ? [{ $match: { 'skill.category': category } }] : []),

      { $match: { endorsementCount: { $gte: min } } },

      {
        $project: {
          skillId: '$_id',
          name: '$skill.name',
          description: '$skill.description',
          endorsementCount: 1,
          _id: 0,
        },
      },

      { $sort: { endorsementCount: -1, name: 1 } },
      { $skip: skip },
      { $limit: limit },
    ]).exec();

    return report;
  }

  async getAvgCompletionTime() {
    const report = await Enrollment.aggregate([
      {
        $match: {
          completedAt: { $exists: true, $ne: null },
        },
      },

      {
        $project: {
          course: 1,
          durationHours: {
            $divide: [
              { $subtract: ['$completedAt', '$enrolledAt'] },
              1000 * 60 * 60,
            ],
          },
        },
      },

      {
        $match: {
          durationHours: { $gte: 0 },
        },
      },

      {
        $group: {
          _id: '$course',
          avgDuration: { $avg: '$durationHours' },
          count: { $sum: 1 },
        },
      },

      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course',
        },
      },

      {
        $unwind: '$course',
      },

      {
        $project: {
          courseId: '$_id',
          title: '$course.title',
          avgDuration: { $round: ['$avgDuration', 2] },
          count: 1,
        },
      },

      { $sort: { avgDuration: -1 } },
    ]).exec();

    return report;
  }
}

module.exports = new ReportService();
