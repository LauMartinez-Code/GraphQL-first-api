const { courses, grades, students} = require('./index');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLError
} = require('graphql');

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        /////////////////////////___Add___\\\\\\\\\\\\\\\\\\\\\\\\\\
        addCourse: {
            type: GraphQLString,
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
                };
                courses.push(course);

                return `Course created with id: ${course.id}. Make a query to see more details`;
            }
        },
        addStudent: {
            type: GraphQLString,
            description: 'Add an Student',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                lastname: { type: GraphQLNonNull(GraphQLString) },
                courseId: {type: GraphQLNonNull(GraphQLInt) } 
            },
            resolve: (parent, args) => {

                const courseExists = courses.find(course => course.id === args.courseId );   //undefined si no encuentra coicidencias
                if(!courseExists) return new GraphQLError(`ERROR - Invalid courseId: ${args.courseId}. There is no course with that Id. Check the data and try again`);

                const student = {
                    id: generateID(students),
                    name: args.name,
                    lastname: args.lastname,
                    courseId: args.courseId
                };
                students.push(student);

                return `Student created with id: ${student.id}. Make a query to see more details`;
            }
        },
        addGrade: {
            type: GraphQLString,
            description: 'Add a Grade',
            args: {
                courseId: {type: GraphQLNonNull(GraphQLInt) },
                studentId: {type: GraphQLNonNull(GraphQLInt) },
                grade: {type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {

                const courseExists = courses.find(course => course.id === args.courseId ); 
                if(!courseExists) return new GraphQLError(`ERROR - Invalid courseId: ${args.courseId}. There is no course with that Id. Check the data and try again`);

                const studentExists = students.find(student => student.id === args.studentId );
                if(!studentExists) return new GraphQLError(`ERROR - Student with id: ${args.studentId} not found. Check the data and try again`);

                if (studentExists.courseId !== courseExists.id) {  
                    return new GraphQLError(`ERROR - Student with id: ${args.studentId} does not belong to the course with id: ${args.courseId}. Check the data and try again`);
                }

                if (args.grade <= 0 || args.grade > 10) {
                    return new GraphQLError(`ERROR - The grade entered is outside the allowed range(1 - 10). Check the data and try again`);
                }

                const grade = {
                    id: generateID(grades),
                    courseId: args.courseId,
                    studentId: args.studentId,
                    grade: args.grade
                }
                grades.push(grade);

                return `Grade created with id: ${grade.id}. Make a query to see more details `;
            }
        },
        /////////////////////////___Update___\\\\\\\\\\\\\\\\\\\\\\\\\\
        updateCourse: {
            type: GraphQLString,
            description: 'Update a specific Course',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },   //solo para determinar cual curso se va modificar, el id no se reemplazará por un nuevo valor
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {

                const courseExists = courses.find(course => course.id === args.id );
                if(!courseExists) return new GraphQLError(`ERROR - Course with id ${args.id} not found`);

                courseExists.name = args.name;  //al ser un object es copiada la referencia y puedo modificar directamente. Otra opcion seria usar Object.assign(target, source);
                courseExists.description = args.description;

                return `Course with id ${args.id} updated successfully`;
            }
        },
        updateStudent: {
            type: GraphQLString,
            description: 'Update a specific Student',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
                name: { type: GraphQLNonNull(GraphQLString) },
                lastname: { type: GraphQLNonNull(GraphQLString) },
                courseId: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {

                const studentExists = students.find(student => student.id === args.id );
                if(!studentExists) return new GraphQLError(`ERROR - Student with id: ${args.id} not found. Check the data and try again`);

                const courseExists = courses.find(course => course.id === args.courseId );  //verifica que el nuevo id del curso exista
                if(!courseExists) return new GraphQLError(`ERROR - Invalid courseId: ${args.courseId}. There is no course with that Id. Check the data and try again`);

                _.each(grades, (grade) => {       //modifca el courseId de las notas de ese estudiante, al tener este un solo curso no es encesario verificar si la nota es de ese curso
                if ( grade.studentId === studentExists.id  ) {
                        grade.courseId = args.courseId;
                    }
                });

                studentExists.name = args.name;
                studentExists.lastname = args.lastname;
                studentExists.courseId = args.courseId;

                return `Student with id ${args.id} updated successfully`;
            }
        },
        updateGrade: {
            type: GraphQLString,
            description: 'Update a specific Grade',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
                grade: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {

                const gradeExists = grades.find(grade => grade.id === args.id );
                if(!gradeExists) return new GraphQLError(`ERROR - Grade with id ${args.id} not found`);

                gradeExists.grade = args.grade;

                return `Grade with id ${args.id} updated successfully`;
            }
        },
        /////////////////////////___Delete___\\\\\\\\\\\\\\\\\\\\\\\\\\
        deleteCourse: {
            type: GraphQLString,
            description: 'Delete a Course',
            args: { id: {type: GraphQLNonNull(GraphQLInt)} },
            resolve: (parent, args) => {

                const courseExists = courses.find(course => course.id === args.id ); 
                if(!courseExists) return new GraphQLError(`ERROR - Course with id ${args.id} not found. Check the data and try again`);

                const studentExists = students.find(student => student.courseId === courseExists.id);
                if(studentExists)  return new GraphQLError(`ERROR - Course with id ${args.id} has referenced students. 
                    To remove this course you must remove all students first. Or you can use the 'deleteFullCourse' mutation function to do it all in one step`);

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
                if(!studentExists) return new GraphQLError(`ERROR - Student with id ${args.id} not found. Check the data and try again`);

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
                if(!gradeExists) return new GraphQLError(`ERROR - Grade with id ${args.id} not found. Check the data and try again`);

                _.remove(grades, (grade) => { return grade.id === args.id });

                return `Grade with id: ${args.id} was deleted`;
            }
        },
        deleteFullCourse: {
            type: GraphQLString,
            description: 'Delete a Course and all their students',
            args: { id: {type: GraphQLNonNull(GraphQLInt)} },
            resolve: (parent, args) => {

                const courseExists = courses.find(course => course.id === args.id ); 
                if(!courseExists) return new GraphQLError(`ERROR - Course with id ${args.id} not found. Check the data and try again`);

                _.remove(grades, (grade) => { return grade.courseId === args.id });  //elimina las notas relacionadas a ese curso
                
                _.remove(students, (student) => { return student.courseId === args.id });  //elimina los alumnos relacionados al curso
            
                _.remove(courses, (course) => { return course.id === args.id });

                return `Course with id: ${args.id} and their students were deleted :)`;
            }
        }
    })
});

module.exports = RootMutationType;

function generateID(object) {   //retorna el valor del id + 1 del ultimo objeto del array
    if (object.length) {
        return object[object.length-1].id + 1;
    }
    
    return 1;   //si el array esta vacio le asigna el id: 1
}
