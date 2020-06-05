const courses = require('../data/Course.json');
const grades = require('../data/Grade.json');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

const StudentType = new GraphQLObjectType({
    name: 'Student',
    description: 'Represent students',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        lastname: { type: GraphQLNonNull(GraphQLString) },
        courseId: { type: GraphQLNonNull(GraphQLInt) },
        courses: {
            type: CourseType,
            resolve: (student) => {
                return courses.find(course => course.id === student.courseId)
            }
        },
        grades: {
            type: GraphQLList(GradeType),
            resolve: (student) => {
                return grades.filter(grade => grade.studentId === student.id)
            }
        }
    })
});

module.exports = StudentType;

// This is here to prevent circular dependencies problem which will lead to the formation of infinite loop
const CourseType = require('./course');
const GradeType = require('./grade');