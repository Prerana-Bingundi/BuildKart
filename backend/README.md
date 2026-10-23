# BuildKart — Backend

Express + MongoDB (Mongoose) API for BuildKart, a 4-role construction
materials marketplace: **Customer, Vendor, Delivery Partner, Admin** — built
to match the `BuildKart Database Design Document (MVP)`.

## 1. Install MongoDB

Pick one:

- **MongoDB Atlas (free tier):** create a cluster at
  https://www.mongodb.com/atlas, add your IP to network access, create a DB
  user, copy the connection string.
- **Local MongoDB:** install MongoDB Community Server and make sure it's
  running (`mongodb://127.0.0.1:27017` by default).

## 2. Configure environment variables

```bash
cd buildkart-backend
cp .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb://127.0.0.1:27017/buildkart
PORT=5000
JWT_SECRET=<a long random string>
CLIENT_ORIGIN=http://localhost:5173
```

Generate a `JWT_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Install, seed, run

```bash
npm install
npm run seed     # wipes and refills every collection with sample data
npm run dev       # http://localhost:5000
```

### Seeded demo logins

| Mobile number | Password | Role |
|---|---|---|
| 9000000001 | customer123 | customer |
| 9000000002 | vendor123 | vendor |
| 9000000003 | delivery123 | delivery |
| 9000000004 | admin123 | admin |

## 4. Database schema (matches the DBD)

| Collection | Key fields |
|---|---|
| `users` | fullName, mobileNumber, email, userType (customer/vendor/delivery/admin), passwordHash, gstNumber, status |
| `vendors` | userId, vendorName, ownerName, gstNumber, address, city, kycStatus, rating, status |
| `categories` | categoryName, description, image, status |
| `products` | productName, categoryId, vendorId, brand, unit, price, weight, imageUrl, status |
| `inventories` | vendorId, productId, availableQuantity, reservedQuantity, minimumStock, warehouseLocation, status |
| `orders` | userId, vendorId, orderDate, totalAmount, deliveryAddress, orderStatus, paymentStatus, deliveryPartnerId, items[] |
| `payments` | orderId, userId, paymentMethod, amount, transactionId, paymentStatus, gateway, refundStatus |
| `deliverypartners` | userId, partnerName, vehicleType, vehicleNumber, availability, rating, assignedOrder |
| `addresses` | userId, addressLine, area, city, pincode, addressType |

(Order line items are embedded documents rather than a separate
`order_items` collection — a normal MongoDB adaptation of the DBD's
relational `Order_Items` table; each item still carries the same fields:
quantity, unitPrice, totalPrice, discount, gst, deliveryFee, itemStatus.)

## 5. Authentication

- `POST /api/auth/register` — body: `{ fullName, mobileNumber, email?, password, userType, gstNumber?, site? }`. Creates the `User`, and for `userType: "vendor"` / `"delivery"` also creates a matching `Vendor` / `DeliveryPartner` profile.
- `POST /api/auth/login` — body: `{ mobileNumber, password, userType }`. Returns `{ token, user }`. `userType` must match the account's registered role, so the same phone number can't be used to log into the wrong role's screens.
- Every other route that needs a logged-in user reads `Authorization: Bearer <token>`.

## 6. Full API reference

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | — | create an account |
| POST | `/api/auth/login` | — | log in, get a token |
| GET | `/api/categories` | — | list categories |
| POST | `/api/categories` | admin | create a category |
| GET | `/api/products` | — | list products (`?category=`, `?vendorId=`) |
| GET | `/api/products/:id` | — | one product |
| POST | `/api/products` | vendor/admin | create a product (under caller's vendor) |
| PUT | `/api/products/:id` | vendor/admin | update a product |
| DELETE | `/api/products/:id` | vendor/admin | delete a product |
| GET | `/api/orders` | any | orders scoped to the caller's role |
| POST | `/api/orders` | customer | place an order |
| PATCH | `/api/orders/:id/status` | vendor/delivery/admin | update order status |
| PATCH | `/api/orders/:id/assign` | admin | assign a delivery partner |
| GET | `/api/users/me` | any | own profile |
| PUT | `/api/users/me` | any | update own profile |
| GET | `/api/vendors/me` | vendor | own vendor profile |
| GET | `/api/vendors/me/products` | vendor | own product list |
| PUT | `/api/vendors/me` | vendor | update own vendor profile |
| GET | `/api/vendors` | admin | list all vendors |
| PATCH | `/api/vendors/:id/kyc` | admin | approve/reject vendor KYC |
| GET | `/api/delivery/me` | delivery | own delivery-partner profile |
| PUT | `/api/delivery/me` | delivery | update availability/location |
| GET | `/api/delivery` | admin | list all delivery partners |
| GET | `/api/admin/stats` | admin | dashboard counters |

## 7. Project structure

```
server.js        Express app + route mounting
db.js            Mongoose connection
middleware/auth.js  requireAuth (JWT check), requireRole (role gate)
models/          User, Vendor, Category, Product, Inventory, Order, Payment, DeliveryPartner, Address
routes/          auth, categories, products, orders, users, vendors, delivery, admin
seed.js          wipes + inserts sample data + prints demo logins
```

## 8. MVP scope notes / natural next steps

- **Payments** are modeled (`payments` collection) but there's no real
  gateway integration — `paymentStatus` is set directly for now (e.g. "Paid"
  on the seeded order). Wiring Razorpay/Stripe would post to
  `POST /api/orders` and then create a matching `Payment`.
- **Addresses**: the model exists and the seed creates one, but there's no
  CRUD route yet for a customer to manage multiple saved addresses — add
  `routes/addresses.js` following the same pattern as the others here.
- **Multi-vendor carts**: the current `Order` assumes one vendor per order,
  matching the DBD's `Orders.Vendor_ID` field. A cart spanning vendors would
  need to split into one order per vendor at checkout.
- **Inventory decrementing**: placing an order doesn't yet reduce
  `Inventory.availableQuantity` — add that in the `POST /api/orders` handler
  once you're ready to enforce stock limits.
