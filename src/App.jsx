import { useEffect, useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import AuthProvider from './AuthProvider'
import { useAuth } from './auth'
import Home from './pages/Home'
import Detail from './pages/Detail'
import Favorites from './pages/Favorites'
import Auth from './pages/Auth'
import { supabase } from './supabase'
import './App.css'

function AppShell() {
  const { loading, user } = useAuth()
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink to="/" className="brand" aria-label="Pokemon Explorer home">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-mark-core" />
          </span>
          <span>
            <strong>Pokemon Explorer</strong>
            <small>PokeAPI search and favorites</small>
          </span>
        </NavLink>

        <nav className="nav-links" aria-label="Primary navigation">
          <NavLink to="/">Search</NavLink>
          <NavLink to="/favorites">Favorites</NavLink>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          {!loading && !user && <NavLink to="/auth">Sign in</NavLink>}
          {!loading && user && (
            <button type="button" onClick={signOut}>
              Sign out
            </button>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:name" element={<Detail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>

      <footer className="app-footer">
        <a
          href="https://github.com/loaf684/pokepoke"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <span>Made with {'\u2764\uFE0F'} by loaf684</span>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}
