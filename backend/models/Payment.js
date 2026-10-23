const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paymentMethod: { type: String, enum: ['COD', 'UPI', 'Card', 'NetBanking', 'Wallet'], default: 'COD' },
    amount: { type: Number, required: true, min: 0 },
    transactionId: { type: String, default: '' },
    paymentDate: { type: Date, default: Date.now },
    paymentStatus: { type: String, enum: ['Pending', 'Success', 'Failed', 'Refunded'], default: 'Pending' },
    gateway: { type: String, default: '' },
    refundStatus: { type: String, enum: ['None', 'Requested', 'Processed'], default: 'None' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
