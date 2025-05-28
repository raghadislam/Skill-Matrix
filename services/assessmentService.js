const Assessment = require('../models/assessmentModel');
const ApiFeatures = require('../utils/apiFeatures');

class AssessmentService {
  #population(query) {
    return query.populate({
      path: 'courseId',
      select: 'title category description -_id',
    });
  }

  async getAllAssessments(queryString) {
    const query = this.#population(Assessment.find());
    const feature = new ApiFeatures(query, queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await feature.query.lean();
  }

  async getAssessment(id) {
    const query = this.#population(Assessment.findById(id));
    return query.lean();
  }
}

module.exports = new AssessmentService();
