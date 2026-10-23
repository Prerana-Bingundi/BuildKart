const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    brand: { type: String, default: '' },
    unit: { type: String, required: true }, // e.g. "per bag (50kg)", "per kg"
    price: { type: Number, required: true, min: 0 },
    weight: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Inactive', 'Out of Stock'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
