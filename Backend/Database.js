const mongoose = require('mongoose');
// https://www.youtube.com/watch?v=9cibNk2eJFU
// Load environment variables from .env file
require('dotenv').config();

// MongoDB connection URI
const uri = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, // Added to avoid deprecation warning
    useFindAndModify: false // Added to avoid deprecation warning
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose.connection;
