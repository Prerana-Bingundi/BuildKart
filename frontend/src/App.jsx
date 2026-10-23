import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Splash from './screens/Splash.jsx'
import RoleSelect from './screens/RoleSelect.jsx'
import Login from './screens/Login.jsx'
import Home from './screens/Home.jsx'
import Categories from './screens/Categories.jsx'
import CategoryProducts from './screens/CategoryProducts.jsx'
import Orders from './screens/Orders.jsx'
import Profile from './screens/Profile.jsx'
import Cart from './screens/Cart.jsx'
import VendorDashboard from './screens/VendorDashboard.jsx'
import DeliveryDashboard from './screens/DeliveryDashboard.jsx'
import AdminDashboard from './screens/AdminDashboard.jsx'
import BottomNav from './components/BottomNav.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const CUSTOMER_TAB_PATHS = ['/home', '/categories', '/orders', '/profile']

export default function App() {
  const location = useLocation()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1800)
    return () => clearTimeout(t)
  }, [])

  if (showSplash) {
    return (
      <div className="device-frame">
        <Splash />
      </div>
    )
  }

  // Only the customer-facing screens use the bottom tab bar; vendor,
  // delivery and admin have their own single-screen dashboards for now.
  const showBottomNav = CUSTOMER_TAB_PATHS.some(
    (p) => location.pathname === p || location.pathname.startsWith('/categories/')
  )

  return (
    <div className="device-frame">
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/role-select" element={<RoleSelect />} />
        <Route path="/login/:role" element={<Login />} />

        <Route path="/home" element={<ProtectedRoute roles={['customer']}><Home /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute roles={['customer']}><Categories /></ProtectedRoute>} />
        <Route path="/categories/:categoryId" element={<ProtectedRoute roles={['customer']}><CategoryProducts /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute roles={['customer']}><Orders /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute roles={['customer']}><Profile /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute roles={['customer']}><Cart /></ProtectedRoute>} />

        <Route path="/vendor" element={<ProtectedRoute roles={['vendor']}><VendorDashboard /></ProtectedRoute>} />
        <Route path="/delivery" element={<ProtectedRoute roles={['delivery']}><DeliveryDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </div>
  )
}
