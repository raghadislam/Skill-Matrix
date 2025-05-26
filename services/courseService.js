const ApiFeatures = require('../utils/apiFeatures');
const Course = require('../models/courseModel');

class CourseService {
  #drop(course) {
    course.prerequisites = course.prerequisites.map((skill) => {
      const { parentSkillId, ...rest } = skill;
      return rest;
    });
    return course;
  }

  async getAllCourses(queryString) {
    const feature = new ApiFeatures(Course.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let courses = await feature.query.lean();
    courses = courses.map((course) => this.#drop(course));

    return courses;
  }

  async getCourse(id) {
    let course = await Course.findById(id).lean();
    course = this.#drop(course);

    return course;
  }
}

module.exports = new CourseService();
