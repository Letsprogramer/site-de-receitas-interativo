import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App.jsx'
import Navbar from '../components/Navbar.jsx'
import RecipeCard from '../components/RecipeCard.jsx'
import './SimpleList.css'

export default function Favorites() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/users/${user.id}/favorites`)
      .then(r => r.json())
      .then(d => { setRecipes(d); setLoading(false) })
  }, [user.id])

  return (
    <div className="simple-page">
      <Navbar />
      <main className="simple-main">
        <div className="simple-header fade-in">
          <h1>❤️ Meus favoritos</h1>
        </div>

        {loading ? (
          <div className="simple-loading"><div className="loading-spinner"/></div>
        ) : recipes.length === 0 ? (
          <div className="empty-state fade-in">
            <span>💛</span>
            <p>Você ainda não favoritou nenhuma receita.</p>
            <button className="btn-cta" onClick={() => navigate('/home')}>Explorar receitas</button>
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
