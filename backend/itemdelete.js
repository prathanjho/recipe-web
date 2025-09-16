// itemdelete.js
const express = require('express');
const User = require('./Models/User');
const router = express.Router();

// DELETE /itemdelete/:username/:index
router.delete('/:username/:index', async (req, res) => {
    const { username, index } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.storeData[index]) return res.status(404).json({ message: 'Item not found' });

        // Remove the item
        user.storeData.splice(index, 1);
        await user.save();

        res.json({ message: 'Item deleted', storeData: user.storeData });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;