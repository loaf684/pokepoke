import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('sign-in')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const credentials = {
      email: email.trim(),
      password,
    }

    const { error } =
      mode === 'sign-up'
        ? await supabase.auth.signUp(credentials)
        : await supabase.auth.signInWithPassword(credentials)

    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    if (mode === 'sign-up') {
      setMessage('Account created. Check your email if confirmation is enabled.')
      return
    }

    navigate('/favorites')
  }

  return (
    <main className="auth-page">
      <header className="page-heading">
        <p className="eyebrow">Trainer account</p>
        <h1>{mode === 'sign-up' ? 'Create an account' : 'Sign in to save favorites'}</h1>
        <p>Favorites are saved to your Supabase account so your collection stays private.</p>
      </header>

      <section className="panel auth-panel">
        <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={mode === 'sign-in' ? 'active' : ''}
            onClick={() => setMode('sign-in')}
          >
            Sign in
          </button>
          <button
            type="button"
            className={mode === 'sign-up' ? 'active' : ''}
            onClick={() => setMode('sign-up')}
          >
            Sign up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              className="search-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              placeholder="trainer@example.com"
            />
          </label>

          <label>
            <span>Password</span>
            <input
              className="search-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
              placeholder="At least 6 characters"
            />
          </label>

          <button className="search-button" type="submit" disabled={loading}>
            {loading ? 'Working...' : mode === 'sign-up' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        {message && <p className={message.includes('created') ? 'favorite-message' : 'error-message'}>{message}</p>}

        <Link className="action-link" to="/">
          Back to search
        </Link>
      </section>
    </main>
  )
}
