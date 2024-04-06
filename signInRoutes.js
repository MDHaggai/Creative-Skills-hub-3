
const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');


const Student = mongoose.model('Student'); 
const Editor = mongoose.model('Editor');
const Client = mongoose.model('Client');

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    async function checkUserInCollection(collection, userType) {
        const user = await collection.findOne({ email }).lean();
        if (user && await bcrypt.compare(password, user.password)) {
            return { found: true, userType };
        }
        return { found: false };
    }

    const checks = [
        checkUserInCollection(Student, 'student'),
        checkUserInCollection(Editor, 'editor'),
        checkUserInCollection(Client, 'client')
    ];

    const results = await Promise.all(checks);
    const match = results.find(result => result.found);

    if (match) {
        res.json({ message: "Login successful", userType: match.userType });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
});

module.exports = router;
