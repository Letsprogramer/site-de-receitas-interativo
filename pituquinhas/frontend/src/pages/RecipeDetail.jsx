import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import './RecipeDetail.css'

export default function RecipeDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/recipes/${id}`)
      .then(r => r.json())
      .then(d => { setRecipe(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="detail-loading"><div className="loading-spinner"/></div>
  if (!recipe)  return <div className="detail-loading"><p>Receita não encontrada 😕</p><button onClick={() => navigate('/home')}>Voltar</button></div>

  const imgUrl = recipe.image_url ? `http://localhost:3001${recipe.image_url}` : null

  return (
    <div className="detail-page">
      <Navbar />
      <main className="detail-main fade-in">
        {/* Hero */}
        <div className="detail-hero">
          {imgUrl
            ? <img src={imgUrl} alt={recipe.title} className="detail-img" />
            : <div className="detail-img-placeholder">🍽️</div>
          }
          <div className="detail-hero-overlay">
            <button className="detail-back" onClick={() => navigate(-1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              Voltar
            </button>
            <div className="detail-badges">
              <span className="badge-cat">{recipe.category}</span>
              {recipe.cook_time && <span className="badge-time">⏱ {recipe.cook_time}</span>}
              {recipe.servings  && <span className="badge-serv">👥 {recipe.servings}</span>}
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="detail-content">
          <h1 className="detail-title">{recipe.title}</h1>
          <p className="detail-author">Receita por <strong>{recipe.author_name}</strong></p>

          <section className="detail-section">
            <h2>📝 Ingredientes</h2>
            <div className="ingredient-list">
              {recipe.ingredients.split('\n').filter(Boolean).map((line, i) => (
                <div key={i} className="ingredient-item">
                  <span className="ing-dot"/>
                  {line}
                </div>
              ))}
            </div>
          </section>

          <section className="detail-section">
            <h2>👩‍🍳 Modo de preparo</h2>
            <div className="instructions-text">
              {recipe.instructions.split('\n').filter(Boolean).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
