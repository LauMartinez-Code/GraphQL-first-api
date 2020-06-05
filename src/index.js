const express = require('express');
const app = express();
const expressGraphQL = require('express-graphql');
const RootQueryType = require('../types/RootQuery');
const RootMutationType = require('../types/RootMutation');

const { GraphQLSchema } = require('graphql');

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));

//npm run app
app.listen(3000, () => {
    console.log('Server running');  
});