import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App.jsx'
import Navbar from '../components/Navbar.jsx'
import RecipeCard from '../components/RecipeCard.jsx'
import './SimpleList.css'

export default function MyRecipes() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/users/${user.id}/recipes`)
      .then(r => r.json())
      .then(d => { setRecipes(d); setLoading(false) })
  }, [user.id])

  return (
    <div className="simple-page">
      <Navbar />
      <main className="simple-main">
        <div className="simple-header fade-in">
          <h1>📖 Minhas receitas</h1>
          <button className="btn-add-small" onClick={() => navigate('/add')}>+ Adicionar</button>
        </div>

        {loading ? (
          <div className="simple-loading"><div className="loading-spinner"/></div>
        ) : recipes.length === 0 ? (
          <div className="empty-state fade-in">
            <span>👩‍🍳</span>
            <p>Você ainda não publicou nenhuma receita.</p>
            <button className="btn-cta" onClick={() => navigate('/add')}>Criar minha primeira receita</button>
          </div>
        ) : (
          <div className="grid-recipes fade-in">
            {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        )}
      </main>
    </div>
  )
}
