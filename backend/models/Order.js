const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true }, // denormalized for fast display
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    itemStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Packed', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    orderDate: { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true, min: 0 },
    deliveryAddress: { type: String, required: true },
    deliveryTime: { type: Date },
    orderStatus: {
      type: String,
      enum: ['Placed', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Placed',
    },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
    deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner', default: null },
    items: { type: [orderItemSchema], required: true, validate: (v) => v.length > 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
