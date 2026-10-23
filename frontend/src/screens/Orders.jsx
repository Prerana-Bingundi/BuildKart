import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar.jsx'
import api from '../api.js'
import { formatDate } from '../utils/format.js'

const statusColor = {
  Delivered: { bg: '#E5F3EA', fg: 'var(--color-success)' },
  'Out for Delivery': { bg: 'var(--color-amber-tint)', fg: 'var(--color-amber-dark)' },
  Confirmed: { bg: '#E9ECF5', fg: 'var(--color-navy-soft)' },
  Placed: { bg: '#E9ECF5', fg: 'var(--color-navy-soft)' },
  Cancelled: { bg: '#FBE7E4', fg: '#C0392B' },
}

const rupees = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

// One label/value row inside the details sheet
function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '8px 0', fontSize: 13.5 }}>
      <span style={{ color: 'var(--color-navy-soft)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 600, textAlign: 'right' }}>{children}</span>
    </div>
  )
}

// Bottom sheet that shows everything about one order
function OrderDetails({ order, onClose }) {
  const c = statusColor[order.orderStatus] || { bg: '#eee', fg: '#555' }

  // Close with the Escape key too
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: 0 }}>
            Order #{order._id.slice(-6).toUpperCase()}
          </h2>
          <span style={{ background: c.bg, color: c.fg, fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>
            {order.orderStatus}
          </span>
        </div>

        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 8, marginBottom: 12 }}>
          <Row label="Placed on">{formatDateTime(order.createdAt || order.orderDate)}</Row>
          <Row label="Vendor">{order.vendorId?.vendorName || '—'}</Row>
          <Row label="Delivery address">{order.deliveryAddress}</Row>
          <Row label="Payment">{order.paymentStatus}</Row>
          {order.deliveryPartnerId && (
            <Row label="Delivery partner">
              {order.deliveryPartnerId.partnerName}
              {order.deliveryPartnerId.mobileNumber ? ` · ${order.deliveryPartnerId.mobileNumber}` : ''}
            </Row>
          )}
        </div>

        <h3 style={{ fontSize: 14, margin: '0 0 8px' }}>Items</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
          {order.items.map((it, idx) => (
            <div key={`${it.productId}-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{it.name}</div>
                <div style={{ fontSize: 12, color: 'var(--color-navy-soft)', marginTop: 2 }}>
                  {it.quantity} × {rupees(it.unitPrice)}
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{rupees(it.totalPrice)}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderTop: '1px solid var(--color-border)', paddingTop: 12, marginBottom: 16,
          }}
        >
          <span style={{ fontWeight: 700 }}>Total amount</span>
          <span style={{ fontWeight: 800, fontSize: 18 }}>{rupees(order.totalAmount)}</span>
        </div>

        <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null) // the order whose details are open

  useEffect(() => {
    api
      .get('/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="screen">
      <TopBar />
      <h1 className="screen-title">Your Orders</h1>

      {loading && <p style={{ color: 'var(--color-navy-soft)', fontSize: 14 }}>Loading orders...</p>}
      {error && <p style={{ color: '#C0392B', fontSize: 13 }}>Couldn't load orders: {error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p style={{ color: 'var(--color-navy-soft)', fontSize: 14 }}>You haven't placed any orders yet.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map((o) => {
          const c = statusColor[o.orderStatus] || { bg: '#eee', fg: '#555' }
          const itemCount = o.items.reduce((sum, i) => sum + i.quantity, 0)
          return (
            <div key={o._id} className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>#{o._id.slice(-6).toUpperCase()}</span>
                <span style={{ background: c.bg, color: c.fg, fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>
                  {o.orderStatus}
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--color-navy-soft)', marginBottom: 10 }}>
                {formatDate(o.createdAt)} · {itemCount} item{itemCount > 1 ? 's' : ''}
                {o.vendorId?.vendorName ? ` · ${o.vendorId.vendorName}` : ''}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>₹{o.totalAmount.toLocaleString('en-IN')}</span>
                <button className="btn-outline" onClick={() => setSelected(o)}>View details</button>
              </div>
            </div>
          )
        })}
      </div>

      {selected && <OrderDetails order={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
