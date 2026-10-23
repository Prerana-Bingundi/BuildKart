const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Vendor = require('../models/Vendor');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/products                 -> all active products
// GET /api/products?category=Cement -> filtered by category name
// GET /api/products?vendorId=...    -> filtered by vendor
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      const cat = await Category.findOne({ categoryName: req.query.category });
      filter.categoryId = cat ? cat._id : null; // null -> no match, returns []
    }
    if (req.query.vendorId) filter.vendorId = req.query.vendorId;

    const products = await Product.find(filter)
      .populate('categoryId', 'categoryName')
      .populate('vendorId', 'vendorName city')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId', 'categoryName')
      .populate('vendorId', 'vendorName city');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Invalid product id', error: err.message });
  }
});

// POST /api/products  (vendor only — creates a product under their own vendor profile)
router.post('/', requireAuth, requireRole('vendor', 'admin'), async (req, res) => {
  try {
    let vendorId = req.body.vendorId;
    if (req.user.userType === 'vendor') {
      const vendor = await Vendor.findOne({ userId: req.user.id });
      if (!vendor) return res.status(400).json({ message: 'No vendor profile found for this account' });
      vendorId = vendor._id;
    }
    const product = await Product.create({ ...req.body, vendorId });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create product', error: err.message });
  }
});

// PUT /api/products/:id  (vendor who owns it, or admin)
router.put('/:id', requireAuth, requireRole('vendor', 'admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update product', error: err.message });
  }
});

// DELETE /api/products/:id  (vendor who owns it, or admin)
router.delete('/:id', requireAuth, requireRole('vendor', 'admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete product', error: err.message });
  }
});

module.exports = router;
