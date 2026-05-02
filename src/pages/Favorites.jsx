import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import { supabase } from '../supabase'

export default function Favorites() {
  const { loading: authLoading, user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const getFavorites = useCallback(async () => {
    if (authLoading) return

    if (!user) {
      setFavorites([])
      setLoading(false)
      return
    }

    setLoading(true)
    setMessage('')

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false })

    if (error) {
      setFavorites([])
      setMessage('Unable to load favorites right now.')
      setLoading(false)
      return
    }

    setFavorites(data ?? [])
    setLoading(false)
  }, [authLoading, user])

  useEffect(() => {
    Promise.resolve().then(() => getFavorites())
  }, [getFavorites])

  const removeFavorite = async (id) => {
    if (!user) return

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

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
        {(authLoading || loading) && <p className="loader">Loading favorites...</p>}

        {!authLoading && !loading && message && <p className="error-message">{message}</p>}

        {!authLoading && !user && (
          <div className="empty-state">
            <h2>Sign in required</h2>
            <p>Create an account or sign in to view your saved Pokemon.</p>
            <Link className="action-link" to="/auth">Sign in</Link>
          </div>
        )}

        {!authLoading && user && !loading && favorites.length === 0 && (
          <div className="empty-state">
            <h2>No favorites yet</h2>
            <p>Search for a Pokemon and add it to your saved collection.</p>
            <Link className="action-link" to="/">Start searching</Link>
          </div>
        )}

        {!authLoading && user && !loading && favorites.length > 0 && (
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
