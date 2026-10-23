const express = require('express');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');
const DeliveryPartner = require('../models/DeliveryPartner');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/stats  -> quick dashboard counters
router.get('/stats', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [customers, vendors, deliveryPartners, products, orders, pendingKyc] = await Promise.all([
      User.countDocuments({ userType: 'customer' }),
      Vendor.countDocuments(),
      DeliveryPartner.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Vendor.countDocuments({ kycStatus: 'Pending' }),
    ]);
    res.json({ customers, vendors, deliveryPartners, products, orders, pendingKyc });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
});

module.exports = router;
