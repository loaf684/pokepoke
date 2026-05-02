import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../auth'
import { supabase } from '../supabase'

export default function Detail() {
  const { name } = useParams()
  const { loading: authLoading, user } = useAuth()
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [favoriteMessage, setFavoriteMessage] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (!name) return

    let active = true

    Promise.resolve()
      .then(() => {
        if (!active) return null

        setLoading(true)
        setError('')
        setFavoriteMessage('')
        return fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      })
      .then((response) => {
        if (!response) return null

        if (!response.ok) {
          throw new Error('Pokemon not found.')
        }
        return response.json()
      })
      .then((data) => {
        if (active && data) {
          setPokemon(data)
          setIsFavorite(false)
        }
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [name])

  useEffect(() => {
    if (!pokemon || authLoading || !user) {
      return
    }

    let active = true

    supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('pokemon_id', pokemon.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setIsFavorite(Boolean(data))
      })

    return () => {
      active = false
    }
  }, [authLoading, pokemon, user])

  const saveFavorite = async () => {
    if (!pokemon) return

    if (!user) {
      setFavoriteMessage('Please sign in before adding favorites.')
      return
    }

    if (isFavorite) {
      setFavoriteMessage('This Pokemon is already in your favorites.')
      return
    }

    setSaving(true)
    setFavoriteMessage('')

    const { error } = await supabase.from('favorites').insert({
      user_id: user.id,
      pokemon_id: pokemon.id,
      name: pokemon.name,
      image_url: pokemon.sprites?.front_default,
      types: pokemon.types.map((typeInfo) => typeInfo.type.name).join(', '),
    })

    setSaving(false)

    if (error) {
      setFavoriteMessage('Unable to add favorite. Please try again.')
      console.error('Favorite save error:', error)
      return
    }

    setIsFavorite(true)
    setFavoriteMessage('Added to favorites.')
  }

  if (loading) {
    return (
      <div className="detail-page">
        <p className="loader">Loading Pokemon details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="detail-page">
        <section className="panel empty-state">
          <p className="error-message">{error}</p>
          <Link className="action-link" to="/">Back to search</Link>
        </section>
      </div>
    )
  }

  return (
    <main className="detail-page">
      <article className="panel pokemon-card">
        <div className="pokemon-card-header">
          <div>
            <p className="eyebrow">Pokemon profile</p>
            <h1>{pokemon.name}</h1>
          </div>
          <span className="pokemon-id">#{String(pokemon.id).padStart(4, '0')}</span>
        </div>

        <div className="pokemon-detail-grid">
          <div className="pokemon-art">
            <img
              className="pokemon-image"
              src={pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default}
              alt={pokemon.name}
            />
          </div>

          <div className="pokemon-info">
            <section className="pokemon-summary" aria-label="Pokemon summary">
              <div>
                <p>Height</p>
                <strong>{pokemon.height / 10} m</strong>
              </div>
              <div>
                <p>Weight</p>
                <strong>{pokemon.weight / 10} kg</strong>
              </div>
              <div>
                <p>Base experience</p>
                <strong>{pokemon.base_experience ?? 'Unknown'}</strong>
              </div>
            </section>

            <div className="pokemon-types" aria-label="Pokemon types">
              {pokemon.types.map((typeInfo) => (
                <span key={typeInfo.slot} className={`type-pill ${typeInfo.type.name}`}>
                  {typeInfo.type.name}
                </span>
              ))}
            </div>

            <section className="pokemon-stats-grid" aria-label="Pokemon stats">
              {pokemon.stats.slice(0, 6).map((stat) => (
                <div key={stat.stat.name} className="stat-block">
                  <span>{stat.stat.name.replace('-', ' ')}</span>
                  <strong>{stat.base_stat}</strong>
                </div>
              ))}
            </section>
          </div>
        </div>

        <div className="detail-actions">
          {user ? (
            <button
              type="button"
              className="favorite-button"
              onClick={saveFavorite}
              disabled={saving || isFavorite}
            >
              {saving ? 'Saving...' : isFavorite ? 'Already favorited' : 'Add to favorites'}
            </button>
          ) : (
            <Link className="favorite-button" to="/auth">
              Sign in to favorite
            </Link>
          )}
          <Link className="action-link" to="/">Back to search</Link>
        </div>

        {favoriteMessage && <p className="favorite-message">{favoriteMessage}</p>}
      </article>
    </main>
  )
}
