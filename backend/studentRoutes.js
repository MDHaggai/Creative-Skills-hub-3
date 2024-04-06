const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { generateVerificationCode, sendVerificationEmail } = require('./utils');
const saltRounds = 10;

const router = express.Router();

// Student Schema
const studentSchema = new mongoose.Schema({
  fullname: String,
  gender: String,
  phone: String,
  email: { type: String, unique: true },
  password: String,
  verificationCode: String,
  createdAt: { type: Date, default: Date.now, index: { expires: '24h' } },
});

const Student = mongoose.model('Student', studentSchema);

const TempRegistration = mongoose.model('TempRegistration', studentSchema);

// Middleware to hash password before saving a document
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// Register Student
router.post('/register_student', async (req, res) => {
  const verificationCode = generateVerificationCode();
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const tempRegistrationData = {
      ...req.body,
      verificationCode,
      password: hashedPassword,
    };
    const tempRegistration = new TempRegistration(tempRegistrationData);
    await tempRegistration.save();
    console.log('Temporary registration saved:', tempRegistration);

    await sendVerificationEmail(req.body.email, verificationCode);
    res.status(201).send({ message: "Student registration initiated. Please check your email for verification." });
  } catch (error) {
    console.error('Error during student registration:', error);
    res.status(500).send({ message: "Error processing student registration." });
  }
});

// Verify Email
router.post('/verify_email', async (req, res) => {
  const { email, verificationCode } = req.body;
  try {
    const tempReg = await TempRegistration.findOne({ email, verificationCode });
    if (!tempReg) {
      return res.status(400).send({ message: 'Invalid or expired verification code.' });
    }

    // Assuming userType is determined elsewhere or defaulting to 'student' for this route
    const userType = 'student'; // Default userType for this endpoint
    const user = new Student(tempReg.toObject());
    await user.save();
    await TempRegistration.deleteOne({ email: tempReg.email });

    console.log({ message: 'Email verified and user registered successfully.', userType: userType });
    res.status(200).send({
      message: 'Email verified and user registered successfully.',
      userType: userType
    });
  } catch (error) {
    console.error('Verification failed:', error);
    res.status(500).send({ message: 'Verification failed. Please try again later.' });
  }
});

module.exports = router;
