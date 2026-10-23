import { PinIcon, BellIcon } from './Icons.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function TopBar() {
  const { user } = useAuth()

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <span style={{ color: 'var(--color-amber)', marginTop: 2 }}><PinIcon /></span>
        <div>
          <div style={{ fontSize: 12, color: 'var(--color-navy-soft)' }}>Delivering to</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>
            {user?.site || 'Set your delivery site'}
          </div>
        </div>
      </div>
      <button
        aria-label="Notifications"
        style={{ position: 'relative', background: 'none', border: 'none', color: 'var(--color-navy)', padding: 4 }}
      >
        <BellIcon />
        <span
          style={{
            position: 'absolute', top: 0, right: 0, width: 8, height: 8,
            borderRadius: '50%', background: '#D1442F', border: '1.5px solid var(--color-bg)',
          }}
        />
      </button>
    </div>
  )
}
