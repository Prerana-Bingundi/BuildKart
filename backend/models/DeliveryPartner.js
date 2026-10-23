const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // login identity
    partnerName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    vehicleType: { type: String, enum: ['Bike', 'Scooter', 'Van', 'Truck'], default: 'Bike' },
    vehicleNumber: { type: String, default: '' },
    currentLocation: { type: String, default: '' },
    availability: { type: String, enum: ['Available', 'Busy', 'Offline'], default: 'Offline' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    status: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' },
    assignedOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
