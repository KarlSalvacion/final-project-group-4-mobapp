const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://user:EJ8tyckpS64hmbLf@lost-and-found.6ip20g0.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const dbConfig = {
    mongoURI: 'mongodb+srv://user:EJ8tyckpS64hmbLf@lost-and-found.6ip20g0.mongodb.net/',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};

module.exports = dbConfig; 