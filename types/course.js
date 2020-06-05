const students = require('../data/Student.json');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

const CourseType = new GraphQLObjectType({    
    name: 'Course',   
    description: 'Represent courses',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        students: {
            type: GraphQLList(StudentType),
            resolve: (course) => {
                return students.filter(student => student.courseId === course.id)
            }
        }
    })
});

module.exports = CourseType;

// This is here to prevent circular dependencies problem which will lead to the formation of infinite loop
const StudentType = require('./student');   

