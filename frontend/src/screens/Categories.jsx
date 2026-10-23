import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'
import { ChevronRight } from '../components/Icons.jsx'
import { iconForCategory } from '../utils/categoryIcons.js'
import api from '../api.js'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([api.get('/categories'), api.get('/products')])
      .then(([catRes, productRes]) => {
        setCategories(catRes.data)
        const tally = {}
        for (const p of productRes.data) {
          const name = p.categoryId?.categoryName
          if (name) tally[name] = (tally[name] || 0) + 1
        }
        setCounts(tally)
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="screen">
      <TopBar />
      <h1 className="screen-title">Categories</h1>

      {error && <p style={{ color: '#C0392B', fontSize: 13, marginBottom: 12 }}>Couldn't load categories: {error}</p>}
      {loading && <p style={{ color: 'var(--color-navy-soft)', fontSize: 14 }}>Loading...</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {categories.map((cat) => {
          const Icon = iconForCategory(cat.categoryName)
          const itemCount = counts[cat.categoryName] || 0
          return (
            <Link
              key={cat._id}
              to={`/categories/${cat._id}`}
              className="card"
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14 }}
            >
              <span
                style={{
                  width: 52, height: 52, borderRadius: 14, background: 'var(--color-icon-tint)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-amber-dark)',
                }}
              >
                <Icon />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{cat.categoryName}</div>
                <div style={{ fontSize: 12.5, color: 'var(--color-navy-soft)' }}>
                  {itemCount} product{itemCount === 1 ? '' : 's'} available
                </div>
              </div>
              <span style={{ color: 'var(--color-navy-soft)' }}><ChevronRight /></span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
