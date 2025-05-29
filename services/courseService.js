const ApiFeatures = require('../utils/apiFeatures');
const Course = require('../models/courseModel');
const Assessment = require('../models/assessmentModel');

class CourseService {
  #population(query) {
    return query.populate({
      path: 'prerequisites',
      select: '-_id -__v -parentSkillId',
    });
  }

  async getAllCourses(queryString) {
    const query = this.#population(Course.find());
    const feature = new ApiFeatures(query, queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await feature.query.lean();
  }

  async getCourse(id) {
    const query = this.#population(Course.findById(id));
    return await query.lean();
  }

  async createCourse(data) {
    return await Course.create(data);
  }

  async updateCourse(id, data) {
    let query = Course.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    query = this.#population(query);

    return await query.lean();
  }

  async deleteCourse(id) {
    return await Course.findByIdAndDelete(id);
  }

  async getAssessments(courseId) {
    return await Assessment.findOne({ courseId });
  }
}

module.exports = new CourseService();
