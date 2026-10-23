import { BuildingIcon } from '../components/Icons.jsx'

// No internal timer/navigation here — App.jsx shows this for a fixed
// duration on every fresh load (including a hard refresh), then reveals
// the role-select screen underneath.
export default function Splash() {
  return (
    <div className="splash">
      <div className="splash-logo-badge">
        <BuildingIcon />
      </div>
      <h1 className="splash-title">
        Build<span>Kart</span>
      </h1>
      <p className="splash-tagline">Build Your Future, Faster.</p>
      <p className="splash-sub">
        The premium procurement platform for modern construction professionals.
      </p>
      <div className="splash-dots">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}
