const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      default: 'UltraTech',
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      default: 'per bag',
    },
    packSize: {
      type: String, // e.g. "50 kg (bag)", "1 Cu.M", "1 Ton"
      required: true,
      default: '50 kg',
    },
    image: {
      type: String,
      default: '',
    },
    specifications: {
      type: [String], // Array of bullet points: "Ordinary Portland Cement", "53 grade strength", etc.
      default: [],
    },
    typicalUses: {
      type: [String], // Array of bullet points: "Structural concrete", "Precast", etc.
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);