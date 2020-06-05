const courses = require('../data/Course.json');
const grades = require('../data/Grade.json');
const students = require('../data/Student.json');
const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

const GradeType = new GraphQLObjectType({
    name: 'Grade',
    description: 'Represent grades',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        courseId: { type: GraphQLNonNull(GraphQLInt) },
        studentId: { type: GraphQLNonNull(GraphQLInt) },
        grade: { type: GraphQLNonNull(GraphQLInt) },
        student: {
            type: StudentType,
            resolve: (grade) => {
                return students.find(student => student.id === grade.studentId)
            }
        },
        course: {
            type: CourseType,
            resolve: (grade) => {
                return courses.find(course => course.id === grade.courseId)
            }
        }
    })
});

module.exports = GradeType;

// This is here to prevent circular dependencies problem which will lead to the formation of infinite loop
const CourseType = require('./course');
const StudentType = require('./student');