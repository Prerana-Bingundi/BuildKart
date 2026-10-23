import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

const statCards = [
  { key: 'customers', label: 'Customers' },
  { key: 'vendors', label: 'Vendors' },
  { key: 'deliveryPartners', label: 'Delivery Partners' },
  { key: 'products', label: 'Products' },
  { key: 'orders', label: 'Orders' },
  { key: 'pendingKyc', label: 'Pending KYC' },
]

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  function load() {
    setLoading(true)
    Promise.all([api.get('/admin/stats'), api.get('/vendors')])
      .then(([statsRes, vendorsRes]) => {
        setStats(statsRes.data)
        setVendors(vendorsRes.data)
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function setKyc(vendorId, kycStatus) {
    try {
      await api.patch(`/vendors/${vendorId}/kyc`, { kycStatus })
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
        <h1 className="screen-title" style={{ margin: 0 }}>Admin Dashboard</h1>
        <button className="btn-outline" onClick={handleLogout}>Log out</button>
      </div>
      <p style={{ color: 'var(--color-navy-soft)', fontSize: 13, marginBottom: 20 }}>Welcome, {user?.fullName}</p>

      {loading && <p style={{ color: 'var(--color-navy-soft)' }}>Loading...</p>}
      {error && <p style={{ color: '#C0392B', fontSize: 13 }}>{error}</p>}

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
          {statCards.map(({ key, label }) => (
            <div key={key} className="card" style={{ padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-navy)' }}>{stats[key]}</div>
              <div style={{ fontSize: 11, color: 'var(--color-navy-soft)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, margin: '0 0 12px' }}>
        Vendors
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {vendors.map((v) => (
          <div key={v._id} className="card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{v.vendorName}</div>
                <div style={{ fontSize: 12, color: 'var(--color-navy-soft)' }}>{v.city}</div>
              </div>
              <span
                style={{
                  fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 8, height: 'fit-content',
                  background: v.kycStatus === 'Verified' ? '#E5F3EA' : v.kycStatus === 'Rejected' ? '#FBE7E4' : 'var(--color-amber-tint)',
                  color: v.kycStatus === 'Verified' ? 'var(--color-success)' : v.kycStatus === 'Rejected' ? '#C0392B' : 'var(--color-amber-dark)',
                }}
              >
                {v.kycStatus}
              </span>
            </div>
            {v.kycStatus === 'Pending' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => setKyc(v._id, 'Verified')}>Approve</button>
                <button className="btn-outline" style={{ flex: 1, color: '#C0392B', borderColor: '#F1D3CE' }} onClick={() => setKyc(v._id, 'Rejected')}>Reject</button>
              </div>
            )}
          </div>
        ))}
        {!loading && vendors.length === 0 && (
          <p style={{ color: 'var(--color-navy-soft)', fontSize: 13 }}>No vendors yet.</p>
        )}
      </div>
    </div>
  )
}
