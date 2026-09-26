import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    // If your Supabase project requires email confirmation, there is no
    // active session yet — send them to check their inbox instead of
    // straight to the dashboard.
    if (!data.session) {
      setNotice('Check your email to confirm your account, then log in.')
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="section-heading">Create your account</h1>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>
        {error && <p className="auth-error">{error}</p>}
        {notice && <p className="auth-notice">{notice}</p>}
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  )
}
