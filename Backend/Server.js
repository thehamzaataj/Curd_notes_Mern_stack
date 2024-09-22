const express = require('express');
require('dotenv').config(); 
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const config = require('./config.json');
const bodyParser = require('body-parser');

const Notes = require("./Model/NoteMode"); 
const User = require('./Model/User');

const app = express();
const port = process.env.PORT || 3000; 

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json()); 

// MongoDB connection
mongoose.connect(config.connectionString, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Authentication Middleware
// const authenticateToken = async (req, res, next) => {
//     const token = req.headers.authorization;

//     if (!token) {
//         return res.status(401).json({ message: 'Please login to continue' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         req.user = await User.findById(decoded.id);
//         next();
//     } catch (err) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
// };



// Create Account Route
app.post('/create-account', async (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
        return res.status(400).json({
            error: true,
            message: "All fields are required",
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            error: true,
            message: "Passwords do not match",
        });
    }

    try {
        const isUser = await User.findOne({ email: email });

        if (isUser) {
            return res.status(400).json({
                error: true,
                message: "User Already Exists",
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({
            fullName,
            email,
            password: hashedPassword, 
            createdOn: new Date(), 
        });

        await user.save();

        const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1h",
        });

        return res.status(201).json({
            error: false,
            user: { id: user._id, fullName: user.fullName, email: user.email },
            accessToken,
            message: "Registration Successful",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Error creating account",
            details: error.message,
        });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email){
        return res.status(400).json({ error: true, message: "Email is Required" });
    }
    if(!password){
        return res.status(400).json({ error: true, message: "Password is Required" });
    }

    try {
        const userInfo = await User.findOne({ email: email });

        if (!userInfo){
            return res.status(400).json({ error: true, message: "User Not Found" });
        }

        const isMatch = await bcrypt.compare(password, userInfo.password);
        if (!isMatch){
            return res.status(400).json({ error: true, message: "Invalid Credentials" });
        }

        const accessToken = jwt.sign({ id: userInfo._id, email: userInfo.email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "60m"
        });

        return res.json({
            error: false,
            message: "Login Successfully",
            email: userInfo.email,
            accessToken,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Error during login",
            details: error.message,
        });
    }
});

// Add Notes Route
app.post('/add-notes', async (req, res) => {
    const { title, content, tags } = req.body;
    if (!title) {
        return res.status(400).json({ error: true, message: "Title is Required" });
    }
    if (!content) {
        return res.status(400).json({ error: true, message: "Content is Required" });
    }

    try {
        const note = new Notes({
            title,
            content,
            tags: tags || [],
        });

        await note.save();

        return res.json({
            note,
            message: "Note Added Successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});
//get
app.get('/notes',  async (req, res) => {
    try {
        const userId = req.user.id; 
        const userNotes = await Notes.find({ userId }); 
        res.status(200).json(userNotes);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: true, message: "Internal Server Error", details: err.message });
    }
});

// Update Notes Route
app.put('/update-notes/:id',  async (req, res) => {
    const { title, content, tags } = req.body;
    const noteId = req.params.id;

    try {
        const note = await Notes.findById(noteId);
        if (!note){
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (note.userId.toString() !== req.user.id){
            return res.status(403).json({ error: true, message: "Unauthorized" });
        }

        note.title = title || note.title;
        note.content = content || note.content;
        note.tags = tags || note.tags;

        await note.save();
        return res.status(200).json({ error: false, message: "Note updated successfully", note });
    } catch(err){
        console.error(err);
        return res.status(500).json({ error: true, message: "Internal Server Error", details: err.message });
    }
});

// Delete Notes Route
app.delete('/delete-notes/:id',async (req, res) => { 
    const noteId = req.params.id;

    try{
        const note = await Notes.findById(noteId);
        if(!note){
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        // Ensure the user owns the note
        if (note.userId.toString() !== req.user.id){
            return res.status(403).json({ error: true, message: "Unauthorized" });
        }

        await Notes.findByIdAndDelete(noteId);
        return res.status(200).json({ error: false, message: "Note deleted successfully" });
    } catch(err){
        console.error(err);
        return res.status(500).json({ error: true, message: "Internal Server Error", details: err.message });
    }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
