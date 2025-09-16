const express = require('express');
const User = require('./Models/User');

const router = express.Router();

// GET /history/:username
router.get('/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ storeData: user.storeData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;