import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState(null)
  const [query, setQuery] = useState('pikachu')
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=12')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  const fetchPokemon = async (name) => {
    const trimmed = name.toLowerCase().trim()
    if (!trimmed) {
      setError('Please enter a Pokémon name or ID.')
      return
    }

    setLoading(true)
    setError('')
    setPokemon(null)

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${trimmed}`)
      if (!res.ok) {
        throw new Error('Pokémon not found. Try a different name or number.')
      }
      const data = await res.json()
      setPokemon(data)
    } catch (err) {
      setError(err.message || 'Unable to load Pokémon data.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (event) => {
    event.preventDefault()
    fetchPokemon(query)
  }

  const suggestions = data?.results ?? []

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>PokéAPI Search</h1>
          <p>
            Search any Pokémon by name or ID and view its sprite, types, and stats.
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section className="poke-search-section">
        <div className="poke-search-card">
          <div className="search-header">
            <div>
              <h2>PokéAPI Search</h2>
              <p>Find a Pokémon by name or ID and view its type, stats, and sprite.</p>
            </div>
            <span className="search-label">Live search</span>
          </div>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              className="search-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g. pikachu or 25"
              aria-label="Search Pokémon"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}

          {loading ? (
            <div className="loader">Loading Pokémon...</div>
          ) : pokemon ? (
            <article className="pokemon-card">
              <div className="pokemon-card-header">
                <div>
                  <span className="pokemon-id">#{pokemon.id}</span>
                  <h3>{pokemon.name}</h3>
                </div>
                <img
                  className="pokemon-image"
                  src={
                    pokemon.sprites?.other?.['official-artwork']?.front_default ||
                    pokemon.sprites?.front_default
                  }
                  alt={pokemon.name}
                />
              </div>

              <div className="pokemon-summary">
                <div>
                  <p>Height</p>
                  <strong>{pokemon.height / 10} m</strong>
                </div>
                <div>
                  <p>Weight</p>
                  <strong>{pokemon.weight / 10} kg</strong>
                </div>
                <div className="pokemon-types">
                  {pokemon.types.map((typeInfo) => (
                    <span
                      key={typeInfo.slot}
                      className={`type-pill ${typeInfo.type.name}`}
                    >
                      {typeInfo.type.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pokemon-stats-grid">
                {pokemon.stats.slice(0, 4).map((stat) => (
                  <div key={stat.stat.name} className="stat-block">
                    <span>{stat.stat.name}</span>
                    <strong>{stat.base_stat}</strong>
                  </div>
                ))}
              </div>
            </article>
          ) : (
            <p className="hint-text">Search for any Pokémon to see its details here.</p>
          )}

          {suggestions.length > 0 && (
            <div className="suggestions">
              <p>Try one of these:</p>
              <div className="suggestion-list">
                {suggestions.slice(0, 8).map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className="suggestion-pill"
                    onClick={() => {
                      setQuery(item.name)
                      fetchPokemon(item.name)
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
