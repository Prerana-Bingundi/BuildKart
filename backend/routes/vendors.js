const express = require('express');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/vendors/me  -> the logged-in vendor's own profile
router.get('/me', requireAuth, requireRole('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch vendor profile', error: err.message });
  }
});

// GET /api/vendors/me/products  -> products listed by the logged-in vendor
router.get('/me/products', requireAuth, requireRole('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });
    const products = await Product.find({ vendorId: vendor._id }).populate('categoryId', 'categoryName');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

// PUT /api/vendors/me  -> update own vendor profile
router.put('/me', requireAuth, requireRole('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndUpdate({ userId: req.user.id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(vendor);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update vendor profile', error: err.message });
  }
});

// GET /api/vendors  (admin) -> list all vendors, e.g. for KYC review
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    res.json(await Vendor.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch vendors', error: err.message });
  }
});

// PATCH /api/vendors/:id/kyc  (admin) -> approve/reject vendor KYC
// body: { kycStatus: "Verified" | "Rejected" }
router.patch('/:id/kyc', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { kycStatus: req.body.kycStatus },
      { new: true, runValidators: true }
    );
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update KYC status', error: err.message });
  }
});

module.exports = router;
