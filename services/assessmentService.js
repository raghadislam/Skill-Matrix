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
    return await query.lean();
  }

  async createAssessment(data) {
    return await Assessment.create(data);
  }

  async updateAssessment(id, data) {
    const assessment = await Assessment.findById(id);
    if (!assessment) return;

    assessment.set(data);

    let query = await assessment.save();
    query = this.#population(query);

    return await query;
  }

  async deleteAssessment(id) {
    return await Assessment.findByIdAndDelete(id);
  }
}

module.exports = new AssessmentService();
