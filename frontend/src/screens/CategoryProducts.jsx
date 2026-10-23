import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'
import { useCart } from '../context/CartContext.jsx'
import api from '../api.js'

export default function CategoryProducts() {
  const { categoryId } = useParams()
  const { addItem } = useCart()

  const [category, setCategory] = useState(null)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    api
      .get('/categories')
      .then((res) => {
        const cat = res.data.find((c) => c._id === categoryId)
        setCategory(cat || null)
        if (!cat) return []
        return api.get('/products', { params: { category: cat.categoryName } }).then((r) => r.data)
      })
      .then((products) => setList(products || []))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false))
  }, [categoryId])

  return (
    <div className="screen">
      <TopBar />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <Link to="/categories" style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy-soft)' }}>Categories</Link>
        <span style={{ color: 'var(--color-navy-soft)' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{category?.categoryName || '...'}</span>
      </div>
      <h1 className="screen-title">{category?.categoryName}</h1>

      {loading && <p style={{ color: 'var(--color-navy-soft)', fontSize: 14 }}>Loading products...</p>}
      {error && <p style={{ color: '#C0392B', fontSize: 13 }}>Couldn't load products: {error}</p>}
      {!loading && !error && list.length === 0 && (
        <p style={{ color: 'var(--color-navy-soft)', fontSize: 14 }}>No products in this category yet.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {list.map((p) => (
          <div key={p._id} className="card" style={{ display: 'flex', gap: 12, padding: 14, alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--color-icon-tint)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{p.productName}</div>
              <div style={{ fontSize: 12, color: 'var(--color-navy-soft)', margin: '3px 0 6px' }}>
                {p.brand ? `${p.brand} · ` : ''}{p.unit}
              </div>
              <div style={{ fontWeight: 700, color: 'var(--color-amber-dark)', fontSize: 14 }}>₹{p.price}</div>
            </div>
            <button
              className="btn-primary"
              style={{ padding: '9px 14px' }}
              onClick={() =>
                addItem({
                  id: p._id,
                  name: p.productName,
                  price: p.price,
                  unit: p.unit,
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
  )
}
