const express = require('express');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/me  -> the logged-in user's own profile
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
});

// PUT /api/users/me  -> update own profile fields
router.put('/me', requireAuth, async (req, res) => {
  try {
    const { passwordHash, userType, mobileNumber, ...safeFields } = req.body; // block sensitive fields
    const user = await User.findByIdAndUpdate(req.user.id, safeFields, {
      new: true,
      runValidators: true,
    }).select('-passwordHash');
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update profile', error: err.message });
  }
});

module.exports = router;
