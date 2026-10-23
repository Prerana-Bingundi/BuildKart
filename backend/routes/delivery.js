const express = require('express');
const DeliveryPartner = require('../models/DeliveryPartner');
const Order = require('../models/Order');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/delivery/me  -> the logged-in delivery partner's own profile
router.get('/me', requireAuth, requireRole('delivery'), async (req, res) => {
  try {
    const partner = await DeliveryPartner.findOne({ userId: req.user.id });
    if (!partner) return res.status(404).json({ message: 'Delivery partner profile not found' });
    res.json(partner);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
});

// PUT /api/delivery/me  -> update availability / current location
router.put('/me', requireAuth, requireRole('delivery'), async (req, res) => {
  try {
    const partner = await DeliveryPartner.findOneAndUpdate({ userId: req.user.id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(partner);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update profile', error: err.message });
  }
});

// GET /api/delivery  (admin) -> list all delivery partners, e.g. to assign orders
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    res.json(await DeliveryPartner.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch delivery partners', error: err.message });
  }
});

module.exports = router;
