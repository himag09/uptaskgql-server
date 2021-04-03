const { ApolloServer, gql } = require('apollo-server');

// type definition
const typeDefs = gql`
    

    type Token {
        token: String
    }
    type Project {
        name: String
        id: ID
    }
    type Task {
        name: String
        description: String
        id: ID
        project: String
        state: Boolean
    }
    type Query {
        getProjects : [Project]
        getTasks(input: ProjectIDInput): [Task]
    }
    input ProjectIDInput {
        project: String!
    }
    input UserInput {
        name: String!
        email: String!
        password: String!
    }
    input AuthenticateInput {
        email: String!
        password: String!
    }
    input ProjectInput {
        name: String!
    }
    input TaskInput {
        name: String!
        description: String
        project: String
    }
    type Mutation {

        # Users
        createUser(input: UserInput) : String
        authenticateUser(input: AuthenticateInput) : Token

        # Projects
        newProject(input: ProjectInput) : Project
        updateProject(id: ID!, input: ProjectInput) : Project
        deleteProject(id: ID!) : String

        # Tasks 
        createTask(input: TaskInput) : Task
        updateTask(id: ID!, input: TaskInput, state: Boolean) : Task
        deleteTask(id: ID!) : String
    } 
`
module.exports = typeDefs;