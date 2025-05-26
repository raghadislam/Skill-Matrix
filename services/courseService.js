const ApiFeatures = require('../utils/apiFeatures');
const Course = require('../models/courseModel');

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
}

module.exports = new CourseService();
