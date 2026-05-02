import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Detail from './pages/Detail'
import Favorites from './pages/Favorites'
import './App.css'

function AppShell() {
  return (
    <>
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
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:name" element={<Detail />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
