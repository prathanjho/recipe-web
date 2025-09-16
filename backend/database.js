const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../Models/User');

// SIGNUP
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.json({ message: 'Signup successful!' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'User not found' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'Wrong password' });
        res.json({ message: 'Login successful!' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;