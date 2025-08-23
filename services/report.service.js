const mongoose = require('mongoose');

const Endorsement = require('../models/endorsement.model');
const Enrollment = require('../models/enrollment.model');
const Notification = require('../models/notification.model');
const course = require('../models/course.model');
const AppError = require('../utils/appError');
const { STATUS } = require('../utils/enums');

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

  async getMonthlyNotificationVolume(year) {
    const start = new Date(`${year}-01-01T00:00:00.000Z`);
    const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);

    const report = await Notification.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lt: end },
        },
      },

      {
        $group: {
          _id: { month: { $month: '$createdAt' }, type: '$type' },
          count: { $sum: 1 },
        },
      },

      {
        $group: {
          _id: '$_id.month',
          notificationTypes: {
            $push: { type: '$_id.type', count: '$count' },
          },
        },
      },

      {
        $project: {
          month: '$_id',
          notificationTypes: 1,
          _id: 0,
        },
      },

      { $sort: { month: 1 } },
    ]).exec();

    return report;
  }

  async getCourseFunnel(courseId) {
    if (!(await course.exists({ _id: courseId })))
      throw new AppError(`No course found with that ID`, 404);

    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    const report = await Enrollment.aggregate([
      { $match: { course: courseObjectId } },

      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },

      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
    ]);

    const map = report.reduce((a, r) => {
      a[r.status] = r.count;
      return a;
    }, {});

    return Object.values(STATUS).map((status) => ({
      status,
      count: map[status] || 0,
    }));
  }
}

module.exports = new ReportService();
