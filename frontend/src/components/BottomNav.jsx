import { NavLink } from 'react-router-dom'
import { HomeIcon, GridIcon, OrdersIcon, ProfileIcon } from './Icons.jsx'

const tabs = [
  { to: '/home', label: 'Home', Icon: HomeIcon, end: true },
  { to: '/categories', label: 'Categories', Icon: GridIcon },
  { to: '/orders', label: 'Orders', Icon: OrdersIcon },
  { to: '/profile', label: 'Profile', Icon: ProfileIcon },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {tabs.map(({ to, label, Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon-wrap"><Icon /></span>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
