const { GradeType, StudentType, CourseType, courses, grades, students} = require('./index');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLError
} = require('graphql');

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addCourse: {
            type: CourseType,
            description: 'Add a Course',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const course = {
                    id: generateID(courses),
                    name: args.name,
                    description: args.description
                }
                courses.push(course);
                return course;
            }
        },
        addStudent: {
            type: StudentType,
            description: 'Add an Student',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                lastname: { type: GraphQLNonNull(GraphQLString) },
                courseId: {type: GraphQLNonNull(GraphQLInt) }  //validar q el curso exista
            },
            resolve: (parent, args) => {
                const student = {
                    id: generateID(students),
                    name: args.name,
                    lastname: args.lastname,
                    courseId: args.courseId
                }
                students.push(student);
                return student;
            }
        },
        addGrade: {
            type: GradeType,
            description: 'Add a Grade',
            args: {
                courseId: {type: GraphQLNonNull(GraphQLInt) }, //validar q el curso exista
                studentId: {type: GraphQLNonNull(GraphQLInt) },  //validar q el estudiante exista
                grade: {type: GraphQLNonNull(GraphQLInt) }  //validar q el grade sea del 1-10
            },
            resolve: (parent, args) => {
                const grade = {
                    id: generateID(grades),
                    courseId: args.courseId,
                    studentId: args.studentId,
                    grade: args.grade
                }
                grades.push(grade);
                return grade;
            }
        },
        deleteCourse: {
            type: GraphQLString,  //borrar los students y notas asociados
            description: 'Delete a Course',
            args: { id: {type: GraphQLNonNull(GraphQLInt)} },
            resolve: (parent, args) => {

                const courseExists = courses.find(course => course.id === args.id );   //undefined si no encuentra coicidencias
                if(!courseExists) return new GraphQLError(`ERROR - Course with id ${args.id} not found`);

                const studentExists = students.find(student => student.courseId === courseExists.id);
                if(studentExists)  return new GraphQLError(`ERROR - Course with id ${args.id} has referenced students. 
                    To remove this course you must remove all students first. Or you can use the 'x' mutation function to do it all in one step(coming soon)`);

                _.remove(courses, (course) => { return course.id === args.id });

                return `Course with id: ${args.id} was deleted`;
            }
        },
        deleteStudent: {
            type: GraphQLString,
            description: 'Delete a Student',
            args: { id: {type: GraphQLNonNull(GraphQLInt)} },
            resolve: (parent, args) => {

                const studentExists = students.find(student => student.id === args.id );
                if(!studentExists) return new GraphQLError(`ERROR - Student with id ${args.id} not found`);

                _.remove(grades, (grade) => { return grade.studentId === studentExists.id });
                _.remove(students, (student) => { return student.id === args.id });

                return `All data related about Student with id: ${args.id} was deleted`;
            }
        },
        deleteGrade: {
            type: GraphQLString,
            description: 'Delete a Grade',
            args: { id: {type: GraphQLNonNull(GraphQLInt)} },
            resolve: (parent, args) => {

                const gradeExists = grades.find(grade => grade.id === args.id );
                if(!gradeExists) return new GraphQLError(`ERROR - Grade with id ${args.id} not found`);

                _.remove(grades, (grade) => { return grade.id === args.id });

                return `Grade with id: ${args.id} was deleted`;
            }
        }
    })
})

module.exports =  RootMutationType;

function generateID(object){   //retorna el valor del id + 1 del ultimo objeto del array
    if (object.length) {
        return object[object.length-1].id + 1;
    }
    
    return 1;   //si el array esta vacio le asigna el id: 1
}
