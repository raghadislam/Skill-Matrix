const Endorsement = require('../models/endorsementModel');

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
}

module.exports = new ReportService();
