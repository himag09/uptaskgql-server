const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
// creates and signing a token
const createToken = (user, secreta, expiresIn) => {
    const { id, email, name } = user;
    return jwt.sign({ id, email, name }, secreta, { expiresIn })
}

// resolvers, lo que se tenga en type query tambien debe estar en resolver
const resolvers = {
    Query: {
        getProjects: async (_, { }, ctx) => {
            const projects = await Project.find({ creator: ctx.user.id });

            return projects;
        },
        getTasks: async (_, { input }, ctx) => {
            // filter by the creator and the task
            const tasks = await Task.find({ creator: ctx.user.id }).where('project').equals(input.project);

            return tasks;
        }
    },
    Mutation: {
        // Users
        createUser: async (_, { input }) => {
            const { email, password } = input;

            const existUser = await User.findOne({ email });
            if (existUser) {
                throw new Error("El usuario ya está registrado");
            }
            try {
                // hash passowrd
                const salt = await bcryptjs.genSalt(10);
                input.password = await bcryptjs.hash(password, salt);

                // register new user
                const newUser = new User(input);
                newUser.save();
                return "Usuario creado correctamente";
            } catch (error) {
                console.log(error);
            }
        },
        authenticateUser: async (_, { input }) => {
            const { email, password } = input;
            // if the user exist
            const existUser = await User.findOne({ email });
            if (!existUser) {
                throw new Error("El usuario no existe");
            }
            // if the password is correct
            const correctPassword = await bcryptjs.compare(password, existUser.password);
            if (!correctPassword) {
                throw new Error("Contraseña incorrecta");
            };
            //give access to the app
            return {
                token: createToken(existUser, process.env.SECRETA, '23hr')
            }
        },
        // Projects
        newProject: async (_, { input }, ctx) => {

            try {
                const project = new Project(input);
                // associate the creator 
                project.creator = ctx.user.id;
                // storage in the db
                const result = await project.save();

                return result;
            } catch (error) {
                console.log(error);

            }
        },
        updateProject: async (_, { id, input }, ctx) => {
            // check if the project exist
            let project = await Project.findById(id);
            if (!project) {
                throw new Error('Proyecto no encontrado');
            }
            // check if it is the creator 
            if (project.creator.toString() !== ctx.user.id) {
                throw new Error('No tienes las credenciales para editar');
            }
            // storage in the db
            project = await Project.findOneAndUpdate({ _id: id }, input, { new: true });
            return project;
        },
        deleteProject: async (_, { id }, ctx) => {
            // check if the project exist 
            let project = await Project.findById(id);
            if (!project) {
                throw new Error('Proyecto no encontrado')
            }
            // check if it is the creator 
            if (project.creator.toString() !== ctx.user.id) {
                throw new Error('No tienes las credenciales para editar');
            }
            // delete
            await Project.findOneAndDelete({ _id: id });
            return "Proyecto eliminado";
        },
        // Tasks
        createTask: async (_, { input }, ctx) => {
            try {
                const task = new Task(input);
                task.creator = ctx.user.id;
                const result = await task.save();
                return result;

            } catch (error) {
                console.log(error);

            }
        },
        updateTask: async (_, { id, input, state }, ctx) => {
            //check if the task exist
            let task = await Task.findById(id);
            if (!task) {
                throw new Error('Tarea no encontrada');
            }
            // if the user is the creator
            if (task.creator.toString() !== ctx.user.id) {
                throw new Error('No tienes las credenciales para editar');
            }
            // asign state
            input.state = state;
            // save and return task
            task = await Task.findOneAndUpdate({ _id: id }, input, { new: true });
            return task;
        },
        deleteTask: async (_, { id }, ctx) => {
            // check if the tasks exist 
            let task = await Task.findById(id);
            if (!task) {
                throw new Error('Tarea no encontrada')
            }
            // check if it is the creator 
            if (task.creator.toString() !== ctx.user.id) {
                throw new Error('No tienes las credenciales para editar');
            }
            // delete
            await Task.findOneAndDelete({ _id: id });
            return "Tarea eliminada";
        }

    }
}
module.exports = resolvers;