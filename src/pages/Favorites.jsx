import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const getFavorites = useCallback(async () => {
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      setFavorites([])
      setMessage('Unable to load favorites right now.')
      setLoading(false)
      return
    }

    setFavorites(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    Promise.resolve().then(() => getFavorites())
  }, [getFavorites])

  const removeFavorite = async (id) => {
    const { error } = await supabase.from('favorites').delete().eq('id', id)

    if (error) {
      setMessage('Unable to remove that favorite.')
      return
    }

    getFavorites()
  }

  return (
    <main className="favorites-page">
      <header className="page-heading">
        <p className="eyebrow">Saved collection</p>
        <h1>My Favorites</h1>
        <p>Pokemon saved from the detail page appear here.</p>
      </header>

      <section className="panel favorites-panel">
        {loading && <p className="loader">Loading favorites...</p>}

        {!loading && message && <p className="error-message">{message}</p>}

        {!loading && favorites.length === 0 && (
          <div className="empty-state">
            <h2>No favorites yet</h2>
            <p>Search for a Pokemon and add it to your saved collection.</p>
            <Link className="action-link" to="/">Start searching</Link>
          </div>
        )}

        {!loading && favorites.length > 0 && (
          <div className="favorites-grid">
            {favorites.map((pokemon) => (
              <article key={pokemon.id} className="favorite-card">
                <img src={pokemon.image_url} alt={pokemon.name} />
                <div>
                  <h2>{pokemon.name}</h2>
                  <p>{pokemon.types}</p>
                </div>
                <button type="button" onClick={() => removeFavorite(pokemon.id)}>
                  Remove
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
