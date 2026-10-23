const express = require('express');
const Category = require('../models/Category');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/categories  (public)
router.get('/', async (req, res) => {
  try {
    res.json(await Category.find({ status: 'Active' }));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories', error: err.message });
  }
});

// POST /api/categories  (admin only)
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create category', error: err.message });
  }
});

module.exports = router;
