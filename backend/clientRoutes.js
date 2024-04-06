const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const axios = require('axios');
const saltRounds = 10;
const { generateVerificationCode, sendVerificationEmail } = require('./utils'); // Assume utils.js contains these functions

// Client Schema
const clientSchema = new mongoose.Schema({
    clientType: String,
    fullname: String,
    phone: String,
    address: String,
    website: String,
    email: { type: String, unique: true },
    password: String,
    
});

const Client = mongoose.model('Client', clientSchema);
const tempClientRegistrationSchema = new mongoose.Schema({
    clientType: String,
    fullname: String,
    phone: String,
    address: String,
    website: String,
    email: String,
    password: String,
    verificationCode: String,
    createdAt: { type: Date, default: Date.now, index: { expires: '5h' } },
});

const TempClientRegistration = mongoose.model('TempClientRegistration', tempClientRegistrationSchema);

// Middleware to hash password before saving a temp client document
tempClientRegistrationSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

router.post('/register_client', async (req, res) => {
    const verificationCode = generateVerificationCode();
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const tempRegistrationData = {
            ...req.body,
            verificationCode,
            password: hashedPassword,
        };
        const tempRegistration = new TempClientRegistration(tempRegistrationData);
        await tempRegistration.save();
        console.log('Temporary registration saved:', tempRegistration);

        await sendVerificationEmail(req.body.email, verificationCode);
        res.status(201).send({ message: 'Verification email sent. Please check your email.' });
    } catch (error) {
        console.error('Error during temporary registration:', error);
        res.status(500).send({ message: 'Error processing registration.' });
    }
});

router.post('/verify_email', async (req, res) => {
    console.log(req.body);
    const { email, verificationCode } = req.body;
  
    console.log(`Looking for email: ${email} with code: ${verificationCode}`);
  
    try {
      const tempReg = await TempClientRegistration.findOne({ email, verificationCode });
      console.log(`Expected code: ${tempReg.verificationCode}, Received code: ${verificationCode}`);
  
      if (!tempReg) {
        return res.status(400).send({ message: 'Invalid or expired verification code.' });
      }
  
      const clientData = tempReg.toObject();
        delete clientData._id; // Remove the _id as it's not needed for the new document
        const client = new Client(clientData);
        await client.save();
        await TempClientRegistration.deleteOne({ _id: tempReg._id });
  
      // Here, we assume that the user type is dynamically determined. This is a placeholder.
      // You would replace 'student' with the actual logic to determine the user type.
      res.status(200).send({
        message: 'Email verified and user registered successfully.',
        userType: 'client' 
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Verification failed. Please try again later.' });
    }
  });
module.exports = router;
