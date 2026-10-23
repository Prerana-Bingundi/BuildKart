const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    userType: {
      type: String,
      required: true,
      enum: ['customer', 'vendor', 'delivery', 'admin'],
      default: 'customer',
    },
    passwordHash: { type: String, required: true },
    gstNumber: { type: String, default: '' }, // relevant for vendor accounts
    status: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' },
    profileImage: { type: String, default: '' },

    // convenience display fields used by the current UI; safe to keep even
    // though "site"/"role" aren't in the DBD — they map onto it loosely.
    site: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
