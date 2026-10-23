// Populates the database with sample data matching the BuildKart DBD:
// categories, one user per role (customer/vendor/delivery/admin), a vendor
// profile, a delivery partner profile, a handful of products per category,
// inventory rows, a saved address, and one sample order + payment.
//
// Run with: npm run seed
//
// Seeded login credentials (mobile number / password), userType in brackets:
//   9000000001 / customer123  [customer]
//   9000000002 / vendor123    [vendor]
//   9000000003 / delivery123  [delivery]
//   9000000004 / admin123     [admin]

require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./db');

const User = require('./models/User');
const Vendor = require('./models/Vendor');
const DeliveryPartner = require('./models/DeliveryPartner');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Inventory = require('./models/Inventory');
const Address = require('./models/Address');
const Order = require('./models/Order');
const Payment = require('./models/Payment');

const categoryNames = [
  'Cement', 'TMT Steel', 'Sand', 'Aggregate', 'Bricks',
  'Blocks', 'Plumbing', 'Electrical', 'Paints', 'Hardware',
];

// A handful of real products per category, taken from the DBD's catalogue.
const productsByCategory = {
  Cement: [
    { productName: 'UltraTech OPC 53', brand: 'UltraTech', price: 420, unit: 'per bag (50kg)' },
    { productName: 'Ambuja Cement', brand: 'Ambuja', price: 415, unit: 'per bag (50kg)' },
    { productName: 'ACC Gold', brand: 'ACC', price: 405, unit: 'per bag (50kg)' },
  ],
  'TMT Steel': [
    { productName: 'Tata Tiscon 12mm', brand: 'Tata', price: 68, unit: 'per kg' },
    { productName: 'JSW Neosteel', brand: 'JSW', price: 66, unit: 'per kg' },
    { productName: 'SAIL TMT', brand: 'SAIL', price: 64, unit: 'per kg' },
  ],
  Sand: [
    { productName: 'River Sand', brand: 'Local', price: 55, unit: 'per cubic ft' },
    { productName: 'M Sand', brand: 'Local', price: 48, unit: 'per cubic ft' },
  ],
  Aggregate: [
    { productName: '20mm Aggregate', brand: 'Local', price: 42, unit: 'per cubic ft' },
    { productName: '10mm Aggregate', brand: 'Local', price: 44, unit: 'per cubic ft' },
  ],
  Bricks: [
    { productName: 'Red Clay Bricks', brand: 'Local', price: 9, unit: 'per piece' },
    { productName: 'Fly Ash Bricks', brand: 'Local', price: 7, unit: 'per piece' },
  ],
  Blocks: [
    { productName: 'AAC 6 inch', brand: 'Local', price: 65, unit: 'per piece' },
    { productName: 'Hollow Concrete Block', brand: 'Local', price: 40, unit: 'per piece' },
  ],
  Plumbing: [
    { productName: 'PVC Pipe 1 inch', brand: 'Supreme', price: 180, unit: 'per 6m length' },
    { productName: 'Ball Valve', brand: 'Ashirvad', price: 220, unit: 'per unit' },
  ],
  Electrical: [
    { productName: 'Copper Wire 1.5sq mm', brand: 'Polycab', price: 1450, unit: 'per 90m coil' },
    { productName: 'MCB 16A', brand: 'Havells', price: 145, unit: 'per unit' },
  ],
  Paints: [
    { productName: 'Asian Apex', brand: 'Asian Paints', price: 320, unit: 'per litre' },
    { productName: 'Berger Easy Clean', brand: 'Berger', price: 295, unit: 'per litre' },
  ],
  Hardware: [
    { productName: 'GI Nails', brand: 'Local', price: 90, unit: 'per kg' },
    { productName: 'Hammer', brand: 'Stanley', price: 350, unit: 'per unit' },
  ],
};

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}), Vendor.deleteMany({}), DeliveryPartner.deleteMany({}),
    Category.deleteMany({}), Product.deleteMany({}), Inventory.deleteMany({}),
    Address.deleteMany({}), Order.deleteMany({}), Payment.deleteMany({}),
  ]);

  // --- Categories ---
  const categories = await Category.insertMany(categoryNames.map((name) => ({ categoryName: name })));
  const categoryIdByName = Object.fromEntries(categories.map((c) => [c.categoryName, c._id]));

  // --- Users (one per role) ---
  const [customerHash, vendorHash, deliveryHash, adminHash] = await Promise.all(
    ['customer123', 'vendor123', 'delivery123', 'admin123'].map((p) => bcrypt.hash(p, 10))
  );

  const customerUser = await User.create({
    fullName: 'Rakesh Sharma',
    mobileNumber: '9000000001',
    email: 'rakesh.sharma@buildkart.example',
    userType: 'customer',
    passwordHash: customerHash,
    site: 'Construction Site A, Solapur',
  });

  const vendorUser = await User.create({
    fullName: 'Suresh Patil',
    mobileNumber: '9000000002',
    email: 'suresh.patil@buildkart.example',
    userType: 'vendor',
    passwordHash: vendorHash,
    gstNumber: '27ABCDE1234F1Z5',
  });

  const deliveryUser = await User.create({
    fullName: 'Amit Kale',
    mobileNumber: '9000000003',
    email: 'amit.kale@buildkart.example',
    userType: 'delivery',
    passwordHash: deliveryHash,
  });

  const adminUser = await User.create({
    fullName: 'BuildKart Admin',
    mobileNumber: '9000000004',
    email: 'admin@buildkart.example',
    userType: 'admin',
    passwordHash: adminHash,
  });

  // --- Vendor + Delivery Partner profiles ---
  const vendor = await Vendor.create({
    userId: vendorUser._id,
    vendorName: 'Patil Building Materials',
    ownerName: 'Suresh Patil',
    mobileNumber: '9000000002',
    gstNumber: '27ABCDE1234F1Z5',
    address: 'Plot 14, MIDC Industrial Area',
    city: 'Solapur',
    kycStatus: 'Verified',
    rating: 4.3,
  });

  const deliveryPartner = await DeliveryPartner.create({
    userId: deliveryUser._id,
    partnerName: 'Amit Kale',
    mobileNumber: '9000000003',
    vehicleType: 'Van',
    vehicleNumber: 'MH13AB1234',
    currentLocation: 'Solapur',
    availability: 'Available',
    rating: 4.6,
  });

  // --- Products + Inventory, all under this one seeded vendor ---
  const allProducts = [];
  for (const [catName, items] of Object.entries(productsByCategory)) {
    for (const item of items) {
      allProducts.push({
        ...item,
        categoryId: categoryIdByName[catName],
        vendorId: vendor._id,
      });
    }
  }
  const insertedProducts = await Product.insertMany(allProducts);

  await Inventory.insertMany(
    insertedProducts.map((p) => ({
      vendorId: vendor._id,
      productId: p._id,
      availableQuantity: 100,
      reservedQuantity: 0,
      unit: p.unit,
      minimumStock: 10,
      warehouseLocation: 'Solapur Warehouse 1',
      status: 'In Stock',
    }))
  );

  // --- Address for the customer ---
  const address = await Address.create({
    userId: customerUser._id,
    addressLine: 'Construction Site A, Near MIDC Chowk',
    area: 'MIDC',
    city: 'Solapur',
    pincode: '413001',
    addressType: 'Site',
  });

  // --- One sample order + payment ---
  const cement = insertedProducts.find((p) => p.productName === 'UltraTech OPC 53');
  const steel = insertedProducts.find((p) => p.productName === 'Tata Tiscon 12mm');

  const order = await Order.create({
    userId: customerUser._id,
    vendorId: vendor._id,
    totalAmount: cement.price * 5 + steel.price * 20,
    deliveryAddress: `${address.addressLine}, ${address.city} - ${address.pincode}`,
    orderStatus: 'Delivered',
    paymentStatus: 'Paid',
    deliveryPartnerId: deliveryPartner._id,
    items: [
      {
        productId: cement._id, name: cement.productName, quantity: 5,
        unitPrice: cement.price, totalPrice: cement.price * 5, itemStatus: 'Delivered',
      },
      {
        productId: steel._id, name: steel.productName, quantity: 20,
        unitPrice: steel.price, totalPrice: steel.price * 20, itemStatus: 'Delivered',
      },
    ],
  });

  await Payment.create({
    orderId: order._id,
    userId: customerUser._id,
    paymentMethod: 'UPI',
    amount: order.totalAmount,
    transactionId: 'TXN' + Date.now(),
    paymentStatus: 'Success',
    gateway: 'Razorpay',
  });

  console.log('Seed complete:');
  console.log(`  ${categories.length} categories, ${insertedProducts.length} products, 1 order`);
  console.log('  Login credentials (mobile / password / role):');
  console.log('    9000000001 / customer123 / customer');
  console.log('    9000000002 / vendor123   / vendor');
  console.log('    9000000003 / delivery123 / delivery');
  console.log('    9000000004 / admin123    / admin');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
