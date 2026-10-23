const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const Address = require('../models/Address');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const DeliveryPartner = require('../models/DeliveryPartner');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const PAYMENT_METHODS = ['COD', 'UPI', 'Card', 'NetBanking', 'Wallet'];

// GET /api/orders  (auth) — scoped to whoever is logged in:
//   customer -> their own orders
//   vendor   -> orders placed with their vendor account
//   delivery -> orders assigned to them
//   admin    -> every order
router.get('/', requireAuth, async (req, res) => {
  try {
    let filter = {};
    if (req.user.userType === 'customer') {
      filter.userId = req.user.id;
    } else if (req.user.userType === 'vendor') {
      const vendor = await Vendor.findOne({ userId: req.user.id });
      filter.vendorId = vendor ? vendor._id : null;
    } else if (req.user.userType === 'delivery') {
      const partner = await DeliveryPartner.findOne({ userId: req.user.id });
      filter.deliveryPartnerId = partner ? partner._id : null;
    }
    // admin: no filter, sees everything

    const orders = await Order.find(filter)
      .populate('vendorId', 'vendorName city')
      .populate('deliveryPartnerId', 'partnerName mobileNumber')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('vendorId', 'vendorName city')
      .populate('deliveryPartnerId', 'partnerName mobileNumber');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: 'Invalid order id', error: err.message });
  }
});

// POST /api/orders  (customer) — places a new order from the cart.
//
// body: { items: [{ productId, quantity }], deliveryAddress?, paymentMethod? }
//
// The server does NOT trust prices / vendor ids sent by the browser. It
// looks every product up in MongoDB, takes the real price and vendor from
// there, and works out the total itself. If the cart contains products from
// more than one vendor, one order is created per vendor.
router.post('/', requireAuth, requireRole('customer'), async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // 1. Validate items and merge duplicates -> Map(productId -> quantity)
    const qtyById = new Map();
    for (const it of items) {
      const pid = String(it.productId || '');
      const qty = Number(it.quantity);
      if (!mongoose.isValidObjectId(pid)) {
        return res.status(400).json({
          message: 'One of the cart items is invalid. Please remove it and add it again.',
        });
      }
      if (!Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({ message: 'Quantity must be a whole number of at least 1' });
      }
      qtyById.set(pid, (qtyById.get(pid) || 0) + qty);
    }

    // 2. Load the real products from the database
    const products = await Product.find({ _id: { $in: [...qtyById.keys()] } });
    if (products.length !== qtyById.size) {
      return res.status(400).json({
        message: 'Some products in your cart are no longer available. Please remove them and try again.',
      });
    }
    const unavailable = products.filter((p) => p.status !== 'Active');
    if (unavailable.length > 0) {
      return res.status(400).json({
        message: `Currently unavailable: ${unavailable.map((p) => p.productName).join(', ')}`,
      });
    }

    // 3. Work out the delivery address
    //    request body -> latest saved Address -> user's "site" -> fallback text
    let address = (deliveryAddress || '').trim();
    if (!address || address === 'Not specified') {
      const saved = await Address.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
      if (saved) {
        address = [saved.addressLine, saved.area, saved.city, saved.pincode].filter(Boolean).join(', ');
      }
    }
    if (!address) {
      const u = await User.findById(req.user.id);
      address = (u && u.site) || '';
    }
    if (!address) address = 'Not specified';

    // 4. Group products by vendor (one order per vendor)
    const byVendor = new Map();
    for (const p of products) {
      const key = String(p.vendorId);
      if (!byVendor.has(key)) byVendor.set(key, []);
      byVendor.get(key).push(p);
    }

    const method = PAYMENT_METHODS.includes(paymentMethod) ? paymentMethod : 'COD';
    const createdOrders = [];

    for (const [vendorId, vendorProducts] of byVendor) {
      const orderItems = vendorProducts.map((p) => {
        const quantity = qtyById.get(String(p._id));
        return {
          productId: p._id,
          name: p.productName,
          quantity,
          unitPrice: p.price,
          totalPrice: p.price * quantity,
        };
      });
      const totalAmount = orderItems.reduce((sum, i) => sum + i.totalPrice, 0);

      const order = await Order.create({
        userId: req.user.id,
        vendorId,
        totalAmount,
        deliveryAddress: address,
        items: orderItems,
      });

      // Record the payment entry (Cash on Delivery by default). A failure
      // here should not cancel an order that was already saved.
      try {
        await Payment.create({
          orderId: order._id,
          userId: req.user.id,
          paymentMethod: method,
          amount: totalAmount,
          paymentStatus: 'Pending',
        });
      } catch (payErr) {
        console.error('Payment record failed for order', order._id, payErr.message);
      }

      createdOrders.push(order);
    }

    res.status(201).json({ orders: createdOrders });
  } catch (err) {
    console.error('Place order failed:', err);
    const status = err.name === 'ValidationError' || err.name === 'CastError' ? 400 : 500;
    res.status(status).json({ message: 'Failed to place order', error: err.message });
  }
});

// PATCH /api/orders/:id/status  (vendor, delivery partner, or admin)
// body: { orderStatus: "Confirmed" | "Out for Delivery" | "Delivered" | "Cancelled" }
router.patch('/:id/status', requireAuth, requireRole('vendor', 'delivery', 'admin'), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.orderStatus },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update order', error: err.message });
  }
});

// PATCH /api/orders/:id/assign  (admin) — assigns a delivery partner
// body: { deliveryPartnerId }
router.patch('/:id/assign', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryPartnerId: req.body.deliveryPartnerId },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: 'Failed to assign delivery partner', error: err.message });
  }
});

module.exports = router;
