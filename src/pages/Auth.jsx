import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const AUTH_IDENTIFIER_DOMAIN = 'users.pokepoke-login.com'

function normalizeName(value) {
  return value.trim()
}

function nameToAuthIdentifier(name) {
  const safeName = normalizeName(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (!safeName) {
    return ''
  }

  return `${safeName}@${AUTH_IDENTIFIER_DOMAIN}`
}

export default function Auth() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('sign-in')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const trimmedName = normalizeName(name)

    if (!trimmedName) {
      setLoading(false)
      setMessage('Enter your name.')
      return
    }

    const authIdentifier = nameToAuthIdentifier(trimmedName)

    if (!authIdentifier) {
      setLoading(false)
      setMessage('Use at least one letter or number in your name.')
      return
    }

    const credentials = {
      email: authIdentifier,
      password,
    }

    const { error } =
      mode === 'sign-up'
        ? await supabase.auth.signUp({
            ...credentials,
            options: {
              data: {
                name: trimmedName,
              },
            },
          })
        : await supabase.auth.signInWithPassword(credentials)

    setLoading(false)

    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        setMessage('Name sign in needs account confirmation disabled in Supabase Auth settings.')
        return
      }

      setMessage(error.message)
      return
    }

    if (mode === 'sign-up') {
      setMessage('Account created. You can log out and sign in again with this name and password.')
      return
    }

    navigate('/favorites')
  }

  return (
    <main className="auth-page">
      <header className="page-heading">
        <p className="eyebrow">Trainer account</p>
        <h1>{mode === 'sign-up' ? 'Create an account' : 'Sign in to save favorites'}</h1>
        <p>Favorites are saved to your trainer account so your collection stays private.</p>
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
            <span>Name</span>
            <input
              className="search-input"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={3}
              autoComplete="name"
              placeholder="trainer name"
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

        {message && (
          <p className={message.includes('created') || message.includes('sent') ? 'favorite-message' : 'error-message'}>
            {message}
          </p>
        )}

        <Link className="action-link" to="/">
          Back to search
        </Link>
      </section>
    </main>
  )
}
