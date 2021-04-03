const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('database connected');
    } catch (error) {
        console.log('An error has happeing');
        console.log(error);
        process.exit(1); //stop the app
    }
}

module.exports = connectDB;