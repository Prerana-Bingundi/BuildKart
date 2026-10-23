import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Wrap a route's element in <ProtectedRoute roles={['customer']}>...</ProtectedRoute>
// to require login, and optionally restrict it to specific userType values.
export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/role-select" replace />
  if (roles && !roles.includes(user.userType)) return <Navigate to="/role-select" replace />

  return children
}
