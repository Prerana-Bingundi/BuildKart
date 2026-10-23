// Minimal hand-drawn SVG icon set — no external dependency required.
const stroke = { fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function PinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} stroke="currentColor" {...stroke} {...props}>
      <path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </svg>
  )
}

export function BellIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} stroke="currentColor" {...stroke} {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  )
}

export function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} stroke="currentColor" {...stroke} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.3-4.3" />
    </svg>
  )
}

export function MicIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} stroke="currentColor" {...stroke} {...props}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </svg>
  )
}

export function CartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} stroke="currentColor" {...stroke} {...props}>
      <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" />
      <circle cx="9.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} stroke="currentColor" {...stroke} {...props}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9h12v-9" />
    </svg>
  )
}

export function GridIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} stroke="currentColor" {...stroke} {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  )
}

export function OrdersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} stroke="currentColor" {...stroke} {...props}>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M15 3v3h3" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  )
}

export function ProfileIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} stroke="currentColor" {...stroke} {...props}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c1.4-3.6 4.2-5.5 7-5.5s5.6 1.9 7 5.5" />
    </svg>
  )
}

export function CompassIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} stroke="currentColor" {...stroke} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m14.5 9.5-2 5-4 1.5 2-5z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function RulerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} stroke="currentColor" {...stroke} {...props}>
      <path d="m4 20 16-16" />
      <path d="M7 17 5.5 15.5M10 14l-1.5-1.5M13 11l-1.5-1.5M16 8l-1.5-1.5" />
    </svg>
  )
}

export function BricksIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} stroke="currentColor" {...stroke} {...props}>
      <rect x="3" y="5" width="18" height="4.5" rx="1" />
      <rect x="3" y="14.5" width="18" height="4.5" rx="1" />
      <path d="M11.5 5v4.5M14 14.5V19" />
    </svg>
  )
}

export function ToolsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} stroke="currentColor" {...stroke} {...props}>
      <path d="m6 6 5 5-6 6 2.5 2.5 6-6 5 5 2-2-13-13z" />
    </svg>
  )
}

export function RmcIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} stroke="currentColor" {...stroke} {...props}>
      <circle cx="12" cy="13" r="7" />
      <path d="M12 6V3M9 3h6" />
      <path d="M8 13a4 4 0 0 0 8 0" />
    </svg>
  )
}

export function BuildingIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={26} height={26} stroke="currentColor" {...stroke} {...props}>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M9 7h1.5M13.5 7H15M9 11h1.5M13.5 11H15M9 15h1.5M13.5 15H15" />
      <path d="M10.5 21v-3h3v3" />
    </svg>
  )
}

export function ChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} stroke="currentColor" {...stroke} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

export const categoryIconMap = {
  compass: CompassIcon,
  ruler: RulerIcon,
  grid: BricksIcon,
  tools: ToolsIcon,
  rmc: RmcIcon,
}
