# BuildKart — Frontend

React (Vite) frontend for BuildKart — a 4-role construction materials
marketplace: Customer, Vendor, Delivery Partner, Admin.

## Flow

1. **Splash** — shown for ~1.8s on every fresh load (including a hard refresh).
2. **Role select** — four squares: Customer, Vendor, Delivery Partner, Admin.
3. **Login / Sign up** — per role, with a toggle between the two. Login checks
   the account's stored role, so you can't log into the wrong dashboard with
   the right phone number.
4. Landing screen depends on role:
   - Customer → Home (with the existing Categories/Cart/Orders/Profile tabs)
   - Vendor → simple dashboard: profile + own product list
   - Delivery Partner → simple dashboard: availability toggle + assigned orders
   - Admin → simple dashboard: platform stats + vendor KYC approval

## 1. Run it locally

Requirements: Node 18+, npm, and the backend running on **http://localhost:5000**
(see `buildkart-backend`'s README — run `npm run seed` there first so you
have demo logins to test with).

```bash
cd buildkart-frontend
npm install
npm run dev
```

Open **http://localhost:5173**.

### Seeded demo logins (after running the backend's `npm run seed`)

| Mobile number | Password | Role |
|---|---|---|
| 9000000001 | customer123 | customer |
| 9000000002 | vendor123 | vendor |
| 9000000003 | delivery123 | delivery |
| 9000000004 | admin123 | admin |

You can also tap "Sign up" on the login screen to register a brand-new
account for any role.

## 2. Project structure

```
src/
  screens/
    Splash.jsx              intro screen (no own navigation — App.jsx times it)
    RoleSelect.jsx           the 4-square role picker
    Login.jsx                shared login/signup form, role passed via the URL
    Home.jsx, Categories.jsx, CategoryProducts.jsx, Cart.jsx, Orders.jsx, Profile.jsx
                              customer-facing screens (unchanged flow, updated fields)
    VendorDashboard.jsx      vendor's own profile + product list
    DeliveryDashboard.jsx    delivery partner's availability + assigned orders
    AdminDashboard.jsx       platform stats + vendor KYC approval
  components/
    ProtectedRoute.jsx       redirects to role-select if not logged in / wrong role
    BottomNav.jsx, TopBar.jsx, Icons.jsx
  context/
    AuthContext.jsx          login/register/logout, persists token+user to localStorage
    CartContext.jsx          in-memory cart state
  utils/
    categoryIcons.js         maps a Category.categoryName to an icon component
    format.js                timeAgo / formatDate helpers
  api.js                     axios instance; attaches the saved token to every request
```

## 3. How auth works here

- `AuthContext` stores `{ token, user }` in `localStorage` on login/register,
  and clears it on logout.
- `api.js` reads the token from `localStorage` on every request and sends it
  as `Authorization: Bearer <token>` — you don't need to pass it manually in
  each screen.
- `ProtectedRoute` wraps every screen that requires login, and optionally
  restricts it to specific roles, e.g. `<ProtectedRoute roles={['vendor']}>`.

## 4. MVP scope notes

- Vendor/Delivery/Admin dashboards are intentionally simple — enough to
  prove the role-based login and data flows work end-to-end. Expanding them
  (e.g. a vendor's "add product" form, an admin's full order list) is a
  natural next step once the core flow feels right.
- The cart currently assumes everything comes from one vendor (see the
  comment in `Cart.jsx`) — matches the backend's one-vendor-per-order model.
