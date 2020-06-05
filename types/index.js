//Types
const CourseType = require('./course');
const StudentType = require('./student');
const GradeType = require('./grade');

//data
const courses = require('../data/Course.json');
const students = require('../data/Student.json');
const grades = require('../data/Grade.json');

module.exports = {
    CourseType,
    StudentType,
    GradeType,
    courses,
    grades,
    students
};
