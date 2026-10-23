const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    availableQuantity: { type: Number, required: true, default: 0, min: 0 },
    reservedQuantity: { type: Number, default: 0, min: 0 },
    unit: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
    minimumStock: { type: Number, default: 0 },
    warehouseLocation: { type: String, default: '' },
    status: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);
