import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'
import { ProfileIcon, ChevronRight } from '../components/Icons.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const menu = [
  'Saved addresses',
  'Payment methods',
  'GST & invoices',
  'Notification settings',
  'Help & support',
]

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="screen">
      <TopBar />
      <h1 className="screen-title">Profile</h1>

      <div className="card" style={{ display: 'flex', gap: 14, alignItems: 'center', padding: 16, marginBottom: 20 }}>
        <span
          style={{
            width: 56, height: 56, borderRadius: '50%', background: 'var(--color-icon-tint)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-amber-dark)',
          }}
        >
          <ProfileIcon />
        </span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{user?.fullName || 'Guest'}</div>
          <div style={{ fontSize: 12.5, color: 'var(--color-navy-soft)' }}>
            {user?.mobileNumber} {user?.site ? `· ${user.site}` : ''}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 4, marginBottom: 20 }}>
        {menu.map((label, i) => (
          <button
            key={label}
            style={{
              width: '100%', background: 'none', border: 'none', textAlign: 'left', padding: '14px 12px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, fontWeight: 600,
              borderBottom: i < menu.length - 1 ? '1px solid var(--color-border)' : 'none',
            }}
          >
            {label}
            <span style={{ color: 'var(--color-navy-soft)' }}><ChevronRight /></span>
          </button>
        ))}
      </div>

      <button className="btn-outline" style={{ width: '100%', color: '#C0392B', borderColor: '#F1D3CE' }} onClick={handleLogout}>
        Log out
      </button>
    </div>
  )
}
