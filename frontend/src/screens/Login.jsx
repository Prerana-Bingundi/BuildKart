import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const roleLabels = {
  customer: 'Customer',
  vendor: 'Vendor',
  delivery: 'Delivery Partner',
  admin: 'Admin',
}

const homeByRole = {
  customer: '/home',
  vendor: '/vendor',
  delivery: '/delivery',
  admin: '/admin',
}

export default function Login() {
  const { role } = useParams()
  const navigate = useNavigate()
  const { login, register, error, setError } = useAuth()

  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    gstNumber: '',
  })

  const roleLabel = roleLabels[role] || 'Account'

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (mode === 'login') {
        await login({ mobileNumber: form.mobileNumber, password: form.password, userType: role })
      } else {
        await register({ ...form, userType: role })
      }
      navigate(homeByRole[role] || '/home')
    } catch {
      // error is already set in AuthContext
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="screen" style={{ paddingTop: 50 }}>
      <Link to="/" style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy-soft)' }}>&larr; Change role</Link>

      <h1 className="screen-title" style={{ marginTop: 14 }}>{roleLabel} {mode === 'login' ? 'Login' : 'Sign up'}</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button
          onClick={() => { setMode('login'); setError(null) }}
          className={mode === 'login' ? 'btn-primary' : 'btn-outline'}
          style={{ flex: 1 }}
        >
          Log in
        </button>
        <button
          onClick={() => { setMode('register'); setError(null) }}
          className={mode === 'register' ? 'btn-primary' : 'btn-outline'}
          style={{ flex: 1 }}
        >
          Sign up
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mode === 'register' && (
          <input
            required
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            className="card"
            style={{ padding: '12px 14px', border: '1px solid var(--color-border)', fontSize: 14 }}
          />
        )}

        <input
          required
          type="tel"
          placeholder="Mobile number"
          value={form.mobileNumber}
          onChange={(e) => update('mobileNumber', e.target.value)}
          className="card"
          style={{ padding: '12px 14px', border: '1px solid var(--color-border)', fontSize: 14 }}
        />

        {mode === 'register' && (
          <input
            type="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className="card"
            style={{ padding: '12px 14px', border: '1px solid var(--color-border)', fontSize: 14 }}
          />
        )}

        {mode === 'register' && role === 'vendor' && (
          <input
            placeholder="GST number"
            value={form.gstNumber}
            onChange={(e) => update('gstNumber', e.target.value)}
            className="card"
            style={{ padding: '12px 14px', border: '1px solid var(--color-border)', fontSize: 14 }}
          />
        )}

        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          className="card"
          style={{ padding: '12px 14px', border: '1px solid var(--color-border)', fontSize: 14 }}
        />

        {error && <p style={{ color: '#C0392B', fontSize: 12.5, margin: 0 }}>{error}</p>}

        <button className="btn-primary" type="submit" disabled={submitting} style={{ marginTop: 4 }}>
          {submitting ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </form>

      {mode === 'login' && (
        <p style={{ fontSize: 12, color: 'var(--color-navy-soft)', marginTop: 18, lineHeight: 1.6 }}>
          Seeded demo login for this role — run <code>npm run seed</code> in the backend first.
        </p>
      )}
    </div>
  )
}
