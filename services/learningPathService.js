const LearningPath = require('../models/learningPathModel');
const APIFeatures = require('../utils/apiFeatures');

class LearningPathService {
  async getAllLearningPaths(queryString) {
    const feature = new APIFeatures(LearningPath.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await feature.query.lean();
  }

  async getLearningPath(id) {
    return await LearningPath.findById(id).lean();
  }

  async createLearningPath(data) {
    const path = await LearningPath.create(data);
    return path.populate({
      path: 'orderedCourseIds',
      select: '-prerequisites',
    });
  }

  async updateLearningPath(id, data) {
    const query = LearningPath.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return await query.lean();
  }

  async deleteLearningPath(id) {
    return await LearningPath.findByIdAndDelete(id);
  }
}

module.exports = new LearningPathService();
