const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { generateVerificationCode, sendVerificationEmail } = require('./utils'); // Assume utils.js contains these functions
const saltRounds = 10;


// Editor Schema
const editorSchema = new mongoose.Schema({
    fullname: String,
    gender: String,
    phone: String,
    yearsOfExperience: Number,
    skillLevel: String,
    email: { type: String, unique: true },
    password: String,
    
});

const Editor = mongoose.model('Editor', editorSchema);

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


// Register Editor
router.post('/register_editor', async (req, res) => {
    const verificationCode = generateVerificationCode();
   
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const tempRegistrationData = {
            ...req.body,
            verificationCode,
            password: hashedPassword 
        };
        const tempRegistration = new TempEditorRegistration(tempRegistrationData);
        await tempRegistration.save();
        console.log('Temporary registration saved:', tempRegistration);
  
        await sendVerificationEmail(req.body.email, verificationCode);
        res.status(201).send({ message: 'Verification email sent. Please check your email.' });
    } catch (error) {
        if (error.code === 11000) {
            res.status(409).json({ message: "Email already registered" });
        } else {
            res.status(500).json({ message: "Error registering student", error: error.message });
        }
    }
});

router.post('/verify_email', async (req, res) => {
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
  
      
      res.status(200).send({
        message: 'Email verified and user registered successfully.',
        userType: 'editor' 
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Verification failed. Please try again later.' });
    }
  });
module.exports = router;
