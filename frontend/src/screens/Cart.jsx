import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import api from '../api.js'

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, total } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState(null)

  async function handleCheckout() {
    setPlacing(true)
    setError(null)
    try {
      // Only send what the server really needs: which product and how many.
      // The server looks up the real price and vendor from the database, and
      // splits the cart into one order per vendor if needed.
      await api.post('/orders', {
        deliveryAddress: user?.site || '',
        items: items.map((i) => ({ productId: i.id, quantity: i.qty })),
      })
      clearCart()
      showToast('Order placed successfully')
      navigate('/orders')
    } catch (err) {
      // Show the real reason from the server (not just "Failed to place order")
      const data = err.response?.data
      const msg = data?.error ? `${data.message} (${data.error})` : data?.message || err.message
      setError(msg)
      showToast('Could not place order', { type: 'error' })
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="screen">
      <TopBar />
      <h1 className="screen-title">Your Cart</h1>

      {items.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: 60, color: 'var(--color-navy-soft)' }}>
          <p>Your cart is empty.</p>
          <button className="btn-primary" onClick={() => navigate('/home')}>Browse materials</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {items.map((i) => (
          <div key={i.id} className="card" style={{ display: 'flex', gap: 12, padding: 14, alignItems: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--color-icon-tint)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{i.name}</div>
              <div style={{ fontSize: 12, color: 'var(--color-navy-soft)', margin: '3px 0 6px' }}>₹{i.price} {i.unit ? `· ${i.unit}` : ''}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button className="btn-outline" style={{ padding: '2px 10px' }} onClick={() => updateQty(i.id, i.qty - 1)}>−</button>
                <span style={{ fontWeight: 700 }}>{i.qty}</span>
                <button className="btn-outline" style={{ padding: '2px 10px' }} onClick={() => updateQty(i.id, i.qty + 1)}>+</button>
                <button
                  onClick={() => removeItem(i.id)}
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#C0392B', fontSize: 12.5, fontWeight: 700 }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="card" style={{ padding: 16 }}>
          {error && <p style={{ color: '#C0392B', fontSize: 12.5, marginTop: 0 }}>Couldn't place order: {error}</p>}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ color: 'var(--color-navy-soft)', fontSize: 14 }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: 18 }}>₹{total.toLocaleString('en-IN')}</span>
          </div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={handleCheckout} disabled={placing}>
            {placing ? 'Placing order...' : 'Proceed to checkout'}
          </button>
        </div>
      )}
    </div>
  )
}
