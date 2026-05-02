import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Home() {
  const [query, setQuery] = useState('pikachu')
  const [suggestions, setSuggestions] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=12')
      .then((response) => response.json())
      .then((json) => setSuggestions(json.results ?? []))
      .catch(() => setSuggestions([]))
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()
    const trimmed = query.toLowerCase().trim()

    if (!trimmed) {
      setError('Please enter a Pokemon name or ID.')
      return
    }

    setError('')
    navigate(`/pokemon/${trimmed}`)
  }

  return (
    <main className="home-page">
      <header className="hero-section">
        <p className="eyebrow">PokeAPI Directory</p>
        <h1>Find Pokemon details fast.</h1>
        <p>
          Search by name or ID, compare key stats, and save favorites to your
          Supabase collection.
        </p>
      </header>

      <section className="panel search-panel" aria-labelledby="search-title">
        <div className="section-heading">
          <div>
            <h2 id="search-title">Search Pokemon</h2>
            <p>Use a Pokemon name, national dex number, or try a popular result.</p>
          </div>
          <Link to="/favorites" className="secondary-link">View favorites</Link>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <input
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. pikachu or 25"
            aria-label="Search Pokemon"
          />
          <button className="search-button" type="submit">Search</button>
        </form>

        {error && <p className="error-message">{error}</p>}
      </section>

      <section className="panel suggestions-list" aria-labelledby="popular-title">
        <div className="section-heading">
          <div>
            <h2 id="popular-title">Popular Pokemon</h2>
            <p>Quick links from the PokeAPI starter list.</p>
          </div>
        </div>
        <div className="suggestion-list">
          {suggestions.slice(0, 8).map((pokemon) => (
            <Link key={pokemon.name} to={`/pokemon/${pokemon.name}`} className="suggestion-pill">
              {pokemon.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
