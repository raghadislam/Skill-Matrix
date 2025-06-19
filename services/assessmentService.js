const Question = require('../models/questionModel');
const Assessment = require('../models/assessmentModel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

class AssessmentService {
  async #ensureAllIdsExist(questions) {
    const uniqueIds = [...new Set(questions.map(String))];

    const count = await Question.countDocuments({ _id: { $in: uniqueIds } });

    if (count !== uniqueIds.length) {
      const found = await Question.find({ _id: { $in: uniqueIds } }).select(
        '_id',
      );

      const foundSet = new Set(found.map((q) => q._id.toString()));
      const missing = uniqueIds.filter((id) => !foundSet.has(id));

      throw new AppError(`Invalid question IDs: ${missing.join(', ')}`, 400);
    }
  }

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
    await this.#ensureAllIdsExist(data.questions);
    return await Assessment.create(data);
  }

  async updateAssessment(id, data) {
    const assessment = await Assessment.findById(id);
    if (!assessment)
      throw new AppError(`No assessment found with that ID`, 404);

    await this.#ensureAllIdsExist(data.questions || []);

    assessment.set(data);

    return await assessment.save();
  }

  async updateQuestion(assessmentId, oldQuestionId, newQuestionId) {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      throw new AppError(`No assessment found with that ID`, 404);
    }

    if (!(await Question.exists({ _id: newQuestionId })))
      throw new AppError(`No question found with ID ${newQuestionId}`, 404);

    const idx = assessment.questions.findIndex(
      (qId) => qId.toString() === oldQuestionId.toString(),
    );
    if (idx === -1)
      throw new AppError(
        `No question found with ID ${oldQuestionId} in this assessment`,
        404,
      );

    assessment.questions.splice(idx, 1);
    assessment.questions.push(newQuestionId);

    return await assessment.save();
  }

  async deleteAssessment(id) {
    const assessment = await Assessment.findByIdAndDelete(id);
    if (!assessment)
      throw new AppError(`No assessment found with that ID`, 404);
  }
}

module.exports = new AssessmentService();
