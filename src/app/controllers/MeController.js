const { multipleMongooseToObject } = require('../../utils/mongoose');
const Course = require('../models/Course');

class MeController {
  // [GET] /me/stored/courses
  async storedCourses(req, res, next) {
    let courseQuery = Course.find({});

    if (req.query.hasOwnProperty('_sort')) {
      courseQuery = courseQuery.sort({
        [req.query.column]: req.query.type,
      });
    }
    Promise.all([courseQuery, Course.findDeleted({})])
      .then(([courses, deletedCount]) =>
        res.render('me/stored-courses', {
          courses: multipleMongooseToObject(courses),
          deletedCount: deletedCount.filter(courses => courses.deleted).length,
        }),
      )
      .catch(next);
  }

  // [GET] /me/trash/courses
  async trashCourses(req, res, next) {
    Course.findDeleted({ deleted: true })
      .then(courses =>
        res.render('me/trash-courses', {
          courses: multipleMongooseToObject(
            courses.filter(course => course.deleted),
          ),
        }),
      )
      .catch(next);
  }
}

module.exports = new MeController();
