// itemadd.js
const express = require('express');
const User = require('./Models/User');

const router = express.Router();


/**
 * POST /add-item
 * Body should include:
 *   username
 *   menuname
 *   food_allergy (optional)
 *   description (optional)
 *   ingredient
 *   instruction
 */
router.post('/', async (req, res) => {
  const { username, menuname, food_allergy, description, ingredient, instruction } = req.body;

  if (!username || !menuname || !ingredient || !instruction) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newItem = {
      menuname,
      food_allergy: food_allergy || '',
      description: description || '',
      ingredient,
      instruction
    };

    user.storeData.push(newItem);
    await user.save();

    res.json({ message: "Item added successfully!", storeData: user.storeData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;