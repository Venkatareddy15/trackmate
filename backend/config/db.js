const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;

    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI is not defined in environment variables');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

module.exports = connectDB;
