const { GradeType, StudentType, CourseType, courses, grades, students} = require('./index');

const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLInt
} = require('graphql');

const RootQueryType = new GraphQLObjectType({   //declara las posibles querys
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        courses: {    //query: books
            type: new GraphQLList(CourseType),    //tipo del return: List(tipo book)
            description: 'List of All Courses',
            resolve: () => courses   //logica
        },
        course: {
            type: CourseType,
            description: 'Particular Course',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => courses.find(course => course.id === args.id)
        },
        students: {
            type: new GraphQLList(StudentType),
            description: 'List of All Students',
            resolve: () => students
        },
        student: {
            type: StudentType,
            description: 'Particular Student',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => students.find(student => student.id === args.id)
        },
        grades: {
            type: new GraphQLList(GradeType),
            description: 'List of All Grades',
            resolve: () => grades
        },
        grade: {
            type: GradeType,
            description: 'Particular Grade',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => grades.find(grade => grade.id === args.id)
        }
    }),
});

module.exports = RootQueryType;