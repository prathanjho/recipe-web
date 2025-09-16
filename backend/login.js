// login.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./Models/User');

const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        const find_user = await User.findOne({ username });
        if (!find_user) return res.status(404).json({ message: "User not found" });

        const match = await bcrypt.compare(password, find_user.password);
        if (!match) return res.status(401).json({ message: "Wrong password" });

        res.json({ message: "Login successful!" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
