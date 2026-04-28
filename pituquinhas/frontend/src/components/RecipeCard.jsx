import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App.jsx'
import './RecipeCard.css'

const CATEGORY_EMOJI = {
  'Doces':         '🍰',
  'Comida caseira':'🍲',
  'bebidas':       '🥤',
  'salgados':      '🥐',
  'Fitness':       '🥗',
  'Internacionais':'🌍',
}

export default function RecipeCard({ recipe, compact = false }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [fav, setFav]       = useState(false)
  const [favLoading, setFL] = useState(false)

  async function toggleFav(e) {
    e.stopPropagation()
    if (!user || favLoading) return
    setFL(true)
    try {
      if (fav) {
        await fetch('/api/favorites', { method: 'DELETE', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ user_id: user.id, recipe_id: recipe.id }) })
        setFav(false)
      } else {
        await fetch('/api/favorites', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ user_id: user.id, recipe_id: recipe.id }) })
        setFav(true)
      }
    } finally { setFL(false) }
  }

  const imgUrl = recipe.image_url
    ? `http://localhost:3001${recipe.image_url}`
    : null

  return (
    <div
      className={`recipe-card ${compact ? 'compact' : ''}`}
      onClick={() => navigate(`/recipe/${recipe.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/recipe/${recipe.id}`)}
    >
      {/* Imagem / placeholder */}
      <div className="card-img">
        {imgUrl
          ? <img src={imgUrl} alt={recipe.title} loading="lazy" />
          : <div className="card-img-placeholder">
              <span>{CATEGORY_EMOJI[recipe.category] || '🍽️'}</span>
            </div>
        }

        {/* Badge categoria */}
        <span className="card-badge">{recipe.category}</span>

        {/* Botão favorito */}
        <button
          className={`card-fav ${fav ? 'active' : ''}`}
          onClick={toggleFav}
          title={fav ? 'Remover favorito' : 'Favoritar'}
        >
          <svg viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Infos */}
      <div className="card-body">
        <h3 className="card-title">{recipe.title}</h3>
        {!compact && (
          <p className="card-author">por {recipe.author_name || 'Pituquinha'}</p>
        )}
        {recipe.cook_time && (
          <span className="card-time">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {recipe.cook_time}
          </span>
        )}
      </div>
    </div>
  )
}
