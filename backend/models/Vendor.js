const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // login identity
    vendorName: { type: String, required: true },
    ownerName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    gstNumber: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    kycStatus: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    status: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
