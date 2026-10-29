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

const categoryNames = ['RMC', 'TMT Steel', 'Cement', 'Sand'];

const productsByCategory = {
  Cement: [
    {
      productName: 'UltraTech OPC 43 Grade',
      brand: 'UltraTech',
      price: 420,
      unit: 'per bag',
      packSize: '50 kg (bag)',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=60',
      specifications: [
        'Ordinary Portland Cement',
        '43 grade compressive strength',
        'Low heat of hydration',
        'Conforms to IS 269:2015',
      ],
      typicalUses: [
        'General concrete works',
        'Masonry mortar',
        'RCC works (where specified by engineer)',
        'Plastering',
      ],
    },
    {
      productName: 'UltraTech OPC 53 Grade',
      brand: 'UltraTech',
      price: 435,
      unit: 'per bag',
      packSize: '50 kg (bag)',
      image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=400&auto=format&fit=crop&q=60',
      specifications: [
        'Ordinary Portland Cement',
        '53 grade high compressive strength',
        'High early strength & rapid setting',
        'Ideal for heavy structural elements',
      ],
      typicalUses: [
        'Structural concrete (Slabs, Columns, Beams)',
        'High-strength concrete applications',
        'Precast concrete components',
        'Commercial multi-story RCC',
      ],
    },
    {
      productName: 'UltraTech PPC (Portland Pozzolana)',
      brand: 'UltraTech',
      price: 412,
      unit: 'per bag',
      packSize: '50 kg (bag)',
      image: 'https://images.unsplash.com/photo-1584463699042-45a805c82db6?w=400&auto=format&fit=crop&q=60',
      specifications: [
        'Portland Pozzolana Cement',
        'Better long-term compressive strength',
        'Low heat of hydration, resists shrinkage cracks',
        'Highly durable against chemical & moisture attacks',
      ],
      typicalUses: [
        'General construction',
        'Masonry & brickwork',
        'External and internal plastering',
        'RCC (where permitted by structural design)',
      ],
    },
    {
      productName: 'UltraTech Weather Plus',
      brand: 'UltraTech',
      price: 460,
      unit: 'per bag',
      packSize: '50 kg (bag)',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=60',
      specifications: [
        'Water-repellent active silicon particles',
        'Enhanced workability and cohesive mix',
        'Resists dampness and efflorescence',
      ],
      typicalUses: [
        'Water-resistant concrete casting',
        'Basement, roof slab, and exterior wall construction',
        'Harsh weather exposure areas',
      ],
    },
    {
      productName: 'UltraTech Building Solutions Putty & Allied',
      brand: 'UltraTech',
      price: 850,
      unit: 'per bag (40kg)',
      packSize: '40 kg (bag)',
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&auto=format&fit=crop&q=60',
      specifications: [
        'Polymer-modified wall care putty & tile adhesives',
        'High adhesion bond strength',
        'Smooth aesthetic white finish',
      ],
      typicalUses: [
        'Finishing and wall care preparation',
        'Crack filling and concrete repair',
        'Tile fixing and waterproofing coats',
      ],
    },
  ],
  'TMT Steel': [
    {
      productName: 'Tata Tiscon 550D 12mm',
      brand: 'Tata Tiscon',
      price: 68,
      unit: 'per kg',
      packSize: '12mm rod (12m)',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=400&auto=format&fit=crop&q=60',
      specifications: ['Fe 550D Grade', 'Super ductile earthquake resistant', 'Superior rib design'],
      typicalUses: ['RCC Columns and Beams', 'Heavy slab reinforcement'],
    },
    {
      productName: 'JSW Neosteel 550D 10mm',
      brand: 'JSW',
      price: 66,
      unit: 'per kg',
      packSize: '10mm rod (12m)',
      image: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=400&auto=format&fit=crop&q=60',
      specifications: ['Fe 550D Grade', 'High tensile yield strength', 'Uniform thickness'],
      typicalUses: ['Slab mesh reinforcement', 'Lintels and chajjas'],
    },
    {
      productName: 'SAIL TMT 16mm',
      brand: 'SAIL',
      price: 64,
      unit: 'per kg',
      packSize: '16mm rod (12m)',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=400&auto=format&fit=crop&q=60',
      specifications: ['High yield strength', 'Excellent bendability', 'IS 1786 certified'],
      typicalUses: ['Heavy foundations', 'Bridges and underground footings'],
    },
  ],
  RMC: [
    {
      productName: 'M25 Ready-Mix Concrete',
      brand: 'UltraTech RMC',
      price: 4200,
      unit: 'per Cu.M',
      packSize: '1 Cubic Metre Transit Mixer',
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&auto=format&fit=crop&q=60',
      specifications: ['M25 Design Mix (1:1:2 equivalent)', 'Target slump 120 ± 25 mm', 'Flyash blended or OPC'],
      typicalUses: ['Slab casting', 'Retaining walls', 'Foundation footings'],
    },
    {
      productName: 'M30 High-Grade RMC',
      brand: 'UltraTech RMC',
      price: 4500,
      unit: 'per Cu.M',
      packSize: '1 Cubic Metre Transit Mixer',
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&auto=format&fit=crop&q=60',
      specifications: ['M30 Grade high durability', 'Controlled water-cement ratio', 'Superplasticizer dosed'],
      typicalUses: ['Heavy load columns', 'Commercial structures', 'Basement raft slabs'],
    },
  ],
  Sand: [
    {
      productName: 'River Sand (Triple Washed)',
      brand: 'Local Solapur Pit',
      price: 55,
      unit: 'per cu.ft',
      packSize: '1 Brass (100 cu.ft)',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=60',
      specifications: ['Silt content < 3%', 'Uniform grading Zone II', 'Moisture controlled'],
      typicalUses: ['Concrete casting', 'Heavy masonry'],
    },
    {
      productName: 'M-Sand (Manufactured Sand)',
      brand: 'Ultratech Aggregates',
      price: 44,
      unit: 'per cu.ft',
      packSize: '1 Brass (100 cu.ft)',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=60',
      specifications: ['VSI crushed cubical shape', 'Zero silt', 'Eco-friendly alternative to river sand'],
      typicalUses: ['RCC structural concrete', 'Brickwork mortar'],
    },
  ],
};

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Vendor.deleteMany({}),
    DeliveryPartner.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Inventory.deleteMany({}),
    Address.deleteMany({}),
    Order.deleteMany({}),
    Payment.deleteMany({}),
  ]);

  // --- 1. Categories ---
  const categories = await Category.insertMany(categoryNames.map((name) => ({ categoryName: name })));
  const categoryIdByName = Object.fromEntries(categories.map((c) => [c.categoryName, c._id]));

  // --- 2. Users ---
  const [customerHash, vendorHash, deliveryHash, adminHash] = await Promise.all(
    ['customer123', 'vendor123', 'delivery123', 'admin123'].map((p) => bcrypt.hash(p, 10))
  );

  const customerAddress = {
    street: 'Flat 402, Building A, MIDC Road',
    city: 'Solapur',
    pincode: '413001',
  };

  const customerUser = await User.create({
    fullName: 'Rakesh Sharma',
    mobileNumber: '9000000001',
    email: 'rakesh.sharma@buildkart.example',
    userType: 'customer',
    passwordHash: customerHash,
    status: 'Active',
    address: customerAddress,
    site: 'Construction Site A, Solapur',
  });

  const vendorUser = await User.create({
    fullName: 'Krishna Steel & UltraTech Building Solutions',
    mobileNumber: '9922687888',
    email: 'krishnasteel@solapurcement.example',
    userType: 'vendor',
    passwordHash: vendorHash,
    status: 'Active',
    vendorDetails: {
      storeName: 'UltraTech Building Solutions at Krishna Steel',
      gstNumber: '27ABCDE1234F1Z5',
      storeAddress: '49, 15-A, Rupa Bhavani Road, Hanuman Nagar, Bhavani Peth, Solapur 413002',
    },
  });

  const deliveryUser = await User.create({
    fullName: 'Amit Kale',
    mobileNumber: '9000000003',
    email: 'amit.kale@buildkart.example',
    userType: 'delivery',
    passwordHash: deliveryHash,
    status: 'Active',
    deliveryDetails: {
      vehicleType: 'truck',
      vehicleNumber: 'MH13AB1234',
    },
  });

  const adminUser = await User.create({
    fullName: 'BuildKart Admin',
    mobileNumber: '9000000004',
    email: 'admin@buildkart.example',
    userType: 'admin',
    passwordHash: adminHash,
    status: 'Active',
    adminDetails: {
      department: 'Operations',
      employeeId: 'ADM-001',
    },
  });

  // --- 3. Vendor + DeliveryPartner collections ---
  const vendor = await Vendor.create({
    userId: vendorUser._id,
    vendorName: 'UltraTech Building Solutions at Krishna Steel',
    ownerName: 'Krishna Steel Traders',
    mobileNumber: '9922687888',
    gstNumber: '27ABCDE1234F1Z5',
    address: '49, 15-A, Rupa Bhavani Road, Hanuman Nagar, Bhavani Peth',
    city: 'Solapur',
    kycStatus: 'Verified',
    rating: 4.8,
  });

  const deliveryPartner = await DeliveryPartner.create({
    userId: deliveryUser._id,
    partnerName: 'Amit Kale Logistics',
    mobileNumber: '9000000003',
    vehicleType: 'Truck',
    vehicleNumber: 'MH13AB1234',
    currentLocation: 'Solapur Hub',
    availability: 'Available',
    rating: 4.7,
  });

  // --- 4. Products ---
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

  // --- 5. Inventories ---
  await Inventory.insertMany(
    insertedProducts.map((p) => ({
      vendorId: vendor._id,
      productId: p._id,
      availableQuantity: p.productName.includes('RMC') ? 50 : 500,
      reservedQuantity: 0,
      unit: p.unit,
      minimumStock: 20,
      warehouseLocation: 'Solapur Central Yard, Bhavani Peth',
      status: 'In Stock',
    }))
  );

  // --- 6. Address ---
  await Address.create({
    userId: customerUser._id,
    addressLine: customerAddress.street,
    area: 'Bhavani Peth',
    city: customerAddress.city,
    pincode: customerAddress.pincode,
    addressType: 'Site',
    isDefault: true,
  });

  console.log('--- Database Seed Complete ---');
  console.log(`  Categories (${categories.length}): ${categories.map((c) => c.categoryName).join(', ')}`);
  console.log(`  Products Seeded: ${insertedProducts.length} items`);
  console.log('  Credentials:');
  console.log('    Customer: 9000000001 / customer123');
  console.log('    Vendor:   9922687888 / vendor123 (Krishna Steel Solapur)');
  console.log('    Delivery: 9000000003 / delivery123');
  console.log('    Admin:    9000000004 / admin123');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed execution error:', err);
  process.exit(1);
});