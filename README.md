# About the App
This Node application solves the following problem:<br/>

**Pre-requisites**<br/>
1 - Create 3 JSON files with Course, Student and Grade <br/>
2 - Course have an id, name and description <br/>
3 - Student have id, name, lastname, courseId (Assumption: 1 student only can be in one course) <br/>
4 - Grade have id, courseId, studentId, grade <br/>

**Create a Graphql structure in order to:**<br/>
1 - Query all Courses, Students and Grades <br/>
2 - Query by id a Course, Student and Grade <br/>
3 - Create a Course, Student and Grade <br/>
4 - Delete a Course, Student and Grade <br/>

# To run this app:
## Download npm dependencies
At the project root folder run
```bash
npm install
```
## Run
Start node app
```bash
npm run app
```

To test the GraphQL queries through GraphiQL access to
[http://localhost:3000/graphql](http://localhost:3000/graphql) to view it in the browser.