// signup.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./Models/User');

const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: 'Username is already taken' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.json({ message: 'Signup successful!' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
