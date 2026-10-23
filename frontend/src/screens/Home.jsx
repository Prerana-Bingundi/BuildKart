import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'
import { SearchIcon, MicIcon, CartIcon } from '../components/Icons.jsx'
import { iconForCategory } from '../utils/categoryIcons.js'
import { deal } from '../data/mockData.js'
import { useCart } from '../context/CartContext.jsx'
import api from '../api.js'
import { timeAgo } from '../utils/format.js'

export default function Home() {
  const navigate = useNavigate()
  const { addItem, count } = useCart()

  const [categories, setCategories] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [recentlyOrdered, setRecentlyOrdered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.slice(0, 4))).catch(() => {})
    api.get('/products').then((res) => setAllProducts(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    api
      .get('/orders')
      .then((res) => {
        const orders = res.data
        const seen = new Set()
        const items = []
        for (const order of orders) {
          for (const item of order.items) {
            if (seen.has(item.name)) continue
            seen.add(item.name)
            items.push({
              id: item.productId,
              name: item.name,
              price: item.unitPrice,
              orderedAgo: timeAgo(order.createdAt),
              vendorId: order.vendorId?._id || order.vendorId,
            })
          }
          if (items.length >= 4) break
        }
        setRecentlyOrdered(items.slice(0, 4))
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false))
  }, [])

  const searchResults = searchTerm.trim()
    ? allProducts.filter((p) => p.productName.toLowerCase().includes(searchTerm.trim().toLowerCase()))
    : []

  return (
    <div className="screen">
      <TopBar />

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', marginBottom: 20 }}>
        <span style={{ color: 'var(--color-navy-soft)' }}><SearchIcon /></span>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search materials, tools, brands..."
          style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, background: 'transparent' }}
        />
        <span style={{ color: 'var(--color-navy-soft)' }}><MicIcon /></span>
      </div>

      {searchTerm.trim() && (
        <div style={{ marginBottom: 26 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, margin: '0 0 10px' }}>
            Search results
          </h2>
          {searchResults.length === 0 && (
            <p style={{ color: 'var(--color-navy-soft)', fontSize: 13 }}>No products match "{searchTerm}".</p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {searchResults.map((p) => (
              <div key={p._id} className="card" style={{ display: 'flex', gap: 12, padding: 12, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--color-icon-tint)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{p.productName}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-navy-soft)' }}>₹{p.price} · {p.unit}</div>
                </div>
                <button
                  className="btn-primary"
                  style={{ padding: '7px 12px' }}
                  onClick={() =>
                    addItem({
                      id: p._id, name: p.productName, price: p.price, unit: p.unit,
                      vendorId: p.vendorId?._id || p.vendorId,
                    })
                  }
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/categories')}
        style={{
          width: '100%', border: 'none', textAlign: 'left', padding: 0,
          borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative',
          height: 190, marginBottom: 26, background: 'linear-gradient(135deg,#2b3550,#141b2c)',
        }}
      >
        <span
          style={{
            position: 'absolute', top: 14, left: 14, background: 'var(--color-amber)',
            color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8,
          }}
        >
          {deal.tag}
        </span>
        <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, color: '#fff' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 21, lineHeight: 1.25, marginBottom: 14 }}>
            {deal.title}
          </div>
          <span className="btn-primary" style={{ display: 'inline-block' }}>{deal.cta}</span>
        </div>
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, margin: 0 }}>Categories</h2>
        <Link to="/categories" style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-amber)' }}>View All</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 28 }}>
        {categories.map((cat) => {
          const Icon = iconForCategory(cat.categoryName)
          return (
            <Link
              key={cat._id}
              to={`/categories/${cat._id}`}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            >
              <span
                style={{
                  width: 56, height: 56, borderRadius: 16, background: 'var(--color-icon-tint)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-amber-dark)',
                }}
              >
                <Icon />
              </span>
              <span style={{ fontSize: 12.5, fontWeight: 600, textAlign: 'center' }}>{cat.categoryName}</span>
            </Link>
          )
        })}
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, margin: '0 0 14px' }}>
        Recently Ordered
      </h2>

      {loading && <p style={{ color: 'var(--color-navy-soft)', fontSize: 14 }}>Loading...</p>}
      {error && <p style={{ color: '#C0392B', fontSize: 13 }}>Couldn't load orders: {error}</p>}
      {!loading && !error && recentlyOrdered.length === 0 && (
        <p style={{ color: 'var(--color-navy-soft)', fontSize: 14 }}>No orders yet — place your first order from Categories.</p>
      )}

      <div className="hscroll">
        {recentlyOrdered.map((p) => (
          <div key={p.id} className="card" style={{ minWidth: 250, padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--color-icon-tint)', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.name}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--color-navy-soft)', margin: '3px 0 6px' }}>
                Ordered {p.orderedAgo}
              </div>
              <button
                onClick={() => addItem(p)}
                style={{ background: 'none', border: 'none', color: 'var(--color-amber)', fontWeight: 700, fontSize: 12.5, padding: 0 }}
              >
                Reorder
              </button>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/cart"
        style={{
          position: 'absolute', bottom: 96, right: 20, width: 56, height: 56, borderRadius: '50%',
          background: 'var(--color-navy)', color: '#fff', display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: '0 10px 24px rgba(16,27,51,0.35)', zIndex: 15,
        }}
      >
        <CartIcon />
        {count > 0 && (
          <span
            style={{
              position: 'absolute', top: -4, right: -4, background: 'var(--color-amber)', color: '#fff',
              fontSize: 11, fontWeight: 700, borderRadius: '50%', width: 20, height: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-bg)',
            }}
          >
            {count}
          </span>
        )}
      </Link>
    </div>
  )
}
