const Assessment = require('../models/assessmentModel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

class AssessmentService {
  async getAllAssessments(queryString) {
    const feature = new ApiFeatures(Assessment.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await feature.query.findPopulate().lean();
  }

  async getAssessment(id) {
    const assessment = await Assessment.findById(id).findPopulate().lean();
    if (!assessment)
      throw new AppError(`No assessment found with that ID`, 404);

    return assessment;
  }

  async createAssessment(data) {
    return await Assessment.create(data);
  }

  async updateAssessment(id, data) {
    const assessment = await Assessment.findById(id);
    if (!assessment)
      throw new AppError(`No assessment found with that ID`, 404);

    assessment.set(data);

    await assessment.save();

    return await this.getAssessment(id);
  }

  async updateQuestion(assessmentId, oldQuestionId, newQuestionId) {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      throw new AppError(`No assessment found with that ID`, 404);
    }

    const idx = assessment.questions.findIndex(
      (qId) => qId.toString() === oldQuestionId.toString(),
    );
    if (idx === -1) {
      throw new AppError(
        `No question found with that ID in this assessment`,
        404,
      );
    }

    assessment.questions.splice(idx, 1);
    assessment.questions.push(newQuestionId);

    await assessment.save();

    return await this.getAssessment(assessmentId);
  }

  async deleteAssessment(id) {
    const assessment = await Assessment.findByIdAndDelete(id);
    if (!assessment)
      throw new AppError(`No assessment found with that ID`, 404);
  }
}

module.exports = new AssessmentService();
