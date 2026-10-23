const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const DeliveryPartner = require('../models/DeliveryPartner');

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user._id, userType: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function publicUser(user) {
  const { passwordHash, ...rest } = user.toObject();
  return rest;
}

// POST /api/auth/register
// body: { fullName, mobileNumber, email?, password, userType, gstNumber?, site? }
// For userType "vendor" / "delivery", this also creates a minimal matching
// Vendor / DeliveryPartner record so those collections stay in sync.
router.post('/register', async (req, res) => {
  try {
    const { fullName, mobileNumber, email, password, userType, gstNumber, site } = req.body;

    if (!fullName || !mobileNumber || !password || !userType) {
      return res.status(400).json({ message: 'fullName, mobileNumber, password and userType are required' });
    }

    const existing = await User.findOne({ mobileNumber });
    if (existing) return res.status(409).json({ message: 'An account with this mobile number already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      mobileNumber,
      email,
      userType,
      passwordHash,
      gstNumber,
      site,
    });

    if (userType === 'vendor') {
      await Vendor.create({
        userId: user._id,
        vendorName: fullName,
        ownerName: fullName,
        mobileNumber,
        gstNumber: gstNumber || '',
      });
    }
    if (userType === 'delivery') {
      await DeliveryPartner.create({
        userId: user._id,
        partnerName: fullName,
        mobileNumber,
      });
    }

    const token = signToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(400).json({ message: 'Registration failed', error: err.message });
  }
});

// POST /api/auth/login
// body: { mobileNumber, password, userType }
// userType is checked so someone can't log into the wrong role's screens
// with the same credentials.
router.post('/login', async (req, res) => {
  try {
    const { mobileNumber, password, userType } = req.body;
    if (!mobileNumber || !password || !userType) {
      return res.status(400).json({ message: 'mobileNumber, password and userType are required' });
    }

    const user = await User.findOne({ mobileNumber });
    if (!user) return res.status(401).json({ message: 'Invalid mobile number or password' });

    if (user.userType !== userType) {
      return res.status(403).json({ message: `This account is registered as ${user.userType}, not ${userType}` });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid mobile number or password' });

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;
