import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function VendorDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [vendor, setVendor] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([api.get('/vendors/me'), api.get('/vendors/me/products')])
      .then(([vendorRes, productsRes]) => {
        setVendor(vendorRes.data)
        setProducts(productsRes.data)
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false))
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="screen" style={{ paddingBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h1 className="screen-title" style={{ margin: 0 }}>Vendor Dashboard</h1>
        <button className="btn-outline" onClick={handleLogout}>Log out</button>
      </div>
      <p style={{ color: 'var(--color-navy-soft)', fontSize: 13, marginBottom: 20 }}>Welcome, {user?.fullName}</p>

      {loading && <p style={{ color: 'var(--color-navy-soft)' }}>Loading...</p>}
      {error && <p style={{ color: '#C0392B', fontSize: 13 }}>{error}</p>}

      {vendor && (
        <div className="card" style={{ padding: 16, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{vendor.vendorName}</div>
          <div style={{ fontSize: 12.5, color: 'var(--color-navy-soft)', margin: '4px 0 10px' }}>
            {vendor.city} · GST {vendor.gstNumber || '—'}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ background: 'var(--color-amber-tint)', color: 'var(--color-amber-dark)', fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>
              KYC: {vendor.kycStatus}
            </span>
            <span style={{ background: '#E5F3EA', color: 'var(--color-success)', fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>
              Rating {vendor.rating.toFixed(1)}
            </span>
          </div>
        </div>
      )}

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, margin: '0 0 12px' }}>
        Your Products ({products.length})
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {products.map((p) => (
          <div key={p._id} className="card" style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{p.productName}</div>
              <div style={{ fontSize: 12, color: 'var(--color-navy-soft)' }}>{p.categoryId?.categoryName} · {p.unit}</div>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--color-amber-dark)' }}>₹{p.price}</div>
          </div>
        ))}
        {!loading && products.length === 0 && (
          <p style={{ color: 'var(--color-navy-soft)', fontSize: 13 }}>No products listed yet.</p>
        )}
      </div>
    </div>
  )
}
