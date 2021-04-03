const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
require('dotenv').config('variables.env');

const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const connectDB = require('./config/db');


// connect to the db
connectDB();

// create server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers['authorization'] || '';
        if (token) {
            try {
                // save authenticated user
                const user = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA);
                console.log(user);
                return {
                    user
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
});

// initialize 
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`Servidor listo en ${url}`);
})