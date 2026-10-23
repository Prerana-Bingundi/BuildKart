const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    addressLine: { type: String, required: true },
    area: { type: String, default: '' },
    city: { type: String, default: '' },
    pincode: { type: String, default: '' },
    landmark: { type: String, default: '' },
    latitude: { type: Number },
    longitude: { type: Number },
    addressType: { type: String, enum: ['Home', 'Site', 'Office', 'Other'], default: 'Site' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Address', addressSchema);
