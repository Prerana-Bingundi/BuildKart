import { useNavigate } from 'react-router-dom'
import { BuildingIcon, ProfileIcon, RulerIcon, OrdersIcon } from '../components/Icons.jsx'

const roles = [
  { id: 'customer', label: 'Customer', sub: 'Order materials', Icon: ProfileIcon },
  { id: 'vendor', label: 'Vendor', sub: 'Sell & manage stock', Icon: RulerIcon },
  { id: 'delivery', label: 'Delivery Partner', sub: 'Deliver orders', Icon: OrdersIcon },
  { id: 'admin', label: 'Admin', sub: 'Manage platform', Icon: BuildingIcon },
]

export default function RoleSelect() {
  const navigate = useNavigate()

  return (
    <div className="screen" style={{ paddingTop: 60 }}>
      <div style={{ textAlign: 'center', marginBottom: 34 }}>
        <div className="splash-logo-badge" style={{ margin: '0 auto 16px' }}>
          <BuildingIcon />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, margin: 0 }}>
          Who's logging in?
        </h1>
        <p style={{ color: 'var(--color-navy-soft)', fontSize: 13.5, marginTop: 6 }}>
          Choose your account type to continue
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {roles.map(({ id, label, sub, Icon }) => (
          <button
            key={id}
            onClick={() => navigate(`/login/${id}`)}
            className="card"
            style={{
              aspectRatio: '1 / 1', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16,
              border: 'none', background: 'var(--color-surface)',
            }}
          >
            <span
              style={{
                width: 52, height: 52, borderRadius: 16, background: 'var(--color-icon-tint)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-amber-dark)',
              }}
            >
              <Icon width={26} height={26} />
            </span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div>
              <div style={{ fontSize: 11, color: 'var(--color-navy-soft)', marginTop: 2 }}>{sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
