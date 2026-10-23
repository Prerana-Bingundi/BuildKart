import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { formatDate } from '../utils/format.js'

export default function DeliveryDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [partner, setPartner] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)

  function load() {
    setLoading(true)
    Promise.all([api.get('/delivery/me'), api.get('/orders')])
      .then(([partnerRes, ordersRes]) => {
        setPartner(partnerRes.data)
        setOrders(ordersRes.data)
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function toggleAvailability() {
    setUpdating(true)
    try {
      const next = partner.availability === 'Available' ? 'Offline' : 'Available'
      const res = await api.put('/delivery/me', { availability: next })
      setPartner(res.data)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setUpdating(false)
    }
  }

  async function markDelivered(orderId) {
    try {
      await api.patch(`/orders/${orderId}/status`, { orderStatus: 'Delivered' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="screen" style={{ paddingBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h1 className="screen-title" style={{ margin: 0 }}>Delivery Dashboard</h1>
        <button className="btn-outline" onClick={handleLogout}>Log out</button>
      </div>
      <p style={{ color: 'var(--color-navy-soft)', fontSize: 13, marginBottom: 20 }}>Welcome, {user?.fullName}</p>

      {loading && <p style={{ color: 'var(--color-navy-soft)' }}>Loading...</p>}
      {error && <p style={{ color: '#C0392B', fontSize: 13 }}>{error}</p>}

      {partner && (
        <div className="card" style={{ padding: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{partner.partnerName}</div>
            <div style={{ fontSize: 12, color: 'var(--color-navy-soft)' }}>{partner.vehicleType} · {partner.vehicleNumber}</div>
          </div>
          <button
            className="btn-primary"
            onClick={toggleAvailability}
            disabled={updating}
            style={{ background: partner.availability === 'Available' ? 'var(--color-success)' : 'var(--color-amber)' }}
          >
            {partner.availability}
          </button>
        </div>
      )}

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, margin: '0 0 12px' }}>
        Assigned Orders ({orders.length})
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {orders.map((o) => (
          <div key={o._id} className="card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 13.5 }}>#{o._id.slice(-6).toUpperCase()}</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--color-amber-dark)' }}>{o.orderStatus}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-navy-soft)', marginBottom: 10 }}>
              {o.deliveryAddress} · {formatDate(o.createdAt)}
            </div>
            {o.orderStatus !== 'Delivered' && (
              <button className="btn-outline" style={{ width: '100%' }} onClick={() => markDelivered(o._id)}>
                Mark as delivered
              </button>
            )}
          </div>
        ))}
        {!loading && orders.length === 0 && (
          <p style={{ color: 'var(--color-navy-soft)', fontSize: 13 }}>No orders assigned to you yet.</p>
        )}
      </div>
    </div>
  )
}
