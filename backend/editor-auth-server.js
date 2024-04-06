require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;
const saltRounds = 10;




app.use(cors());
app.use(express.json());


const router = express.Router();

// Define routes
router.get('/editor-route', (req, res) => {
  res.send('Editor specific route response');
});


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/creative-hub-db');

const db = mongoose.connection;
db.on('connected', () => console.log('successfully connected to editor document in database'));
console.log('CONNECTED TO DATABASE');
db.on('error', (err) => console.error('Database connection error:', err));

// Editor Schema
const editorSchema = new mongoose.Schema({
    fullname: String,
    gender: String,
    phone: String,
    yearsOfExperience: Number,
    skillLevel: String,
    email: String,
    password: String
});

const Editor = mongoose.model('Editor', editorSchema);

// Temporary Registration Schema for Editor
const tempEditorRegistrationSchema = new mongoose.Schema({
    fullname: String,
    gender: String,
    phone: String,
    yearsOfExperience: Number,
    skillLevel: String,
    email: String,
    password: String,
    verificationCode: String,
    createdAt: { type: Date, default: Date.now, index: { expires: '5h' } }
});

const TempEditorRegistration = mongoose.model('TempEditorRegistration', tempEditorRegistrationSchema);

// Middleware to hash password before saving a temp editor document
tempEditorRegistrationSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Function to send verification email
async function sendVerificationEmail(email, verificationCode) {
    const data = {
        sendto: email,
        name: 'Creative-skills-hub',
        replyTo: 'haggairameni@gmail.com',
        ishtml: 'true',
        title: 'Your Verification Code',
        body: `Your verification code is: ${verificationCode}`
    };

    try {
        const response = await axios({
            method: 'POST',
            url: 'https://mail-sender-api1.p.rapidapi.com/',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'mail-sender-api1.p.rapidapi.com'
            },
            data: JSON.stringify(data)
        });
        console.log("Email sent:", response.data);
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    }
}

// Generate a 6-digit verification code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/register_editor', async (req, res) => {
    const verificationCode = generateVerificationCode();
   
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const tempRegistrationData = {
            ...req.body,
            verificationCode,
            password: hashedPassword // Use the hashed password
        };
        const tempRegistration = new TempEditorRegistration(tempRegistrationData);
        await tempRegistration.save();
        console.log('Temporary registration saved:', tempRegistration);
  
        await sendVerificationEmail(req.body.email, verificationCode);
        res.status(201).send({ message: 'Verification email sent. Please check your email.' });
    } catch (error) {
        console.error('Error during temporary registration:', error);
        res.status(500).send({ message: 'Error processing registration.' });
    }
});

app.post('/verify_email', async (req, res) => {
    console.log(req.body);
    const { email, verificationCode } = req.body;
  
    console.log(`Looking for email: ${email} with code: ${verificationCode}`);
  
    try {
      const tempReg = await TempEditorRegistration.findOne({ email, verificationCode });
      console.log(`Expected code: ${tempReg.verificationCode}, Received code: ${verificationCode}`);
  
      if (!tempReg) {
        return res.status(400).send({ message: 'Invalid or expired verification code.' });
      }
  
      const editorData = tempReg.toObject();
      delete editorData._id; // Remove the _id as it's not needed for the new document
      const editor = new Editor(editorData);
      await editor.save();
      await TempEditorRegistration.deleteOne({ _id: tempReg._id });
  
      // Here, we assume that the user type is dynamically determined. This is a placeholder.
      // You would replace 'student' with the actual logic to determine the user type.
      res.status(200).send({
        message: 'Email verified and user registered successfully.',
        userType: 'editor' // Or 'editor', 'client', etc., based on where the registration happened
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Verification failed. Please try again later.' });
    }
  });
  

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
module.exports = router;