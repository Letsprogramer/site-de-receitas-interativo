import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Carousel from '../components/Carousel.jsx'
import RecipeCard from '../components/RecipeCard.jsx'
import './Home.css'

const CATEGORIES = ['Todos','Doces','Comida caseira','bebidas','salgados','Fitness','Internacionais']

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [recent,   setRecent]   = useState([])
  const [filtered, setFiltered] = useState([])
  const [category, setCategory] = useState('Todos')
  const [search,   setSearch]   = useState('')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [featRes, recentRes] = await Promise.all([
          fetch('/api/recipes/featured'),
          fetch('/api/recipes/recent'),
        ])
        setFeatured(await featRes.json())
        setRecent(await recentRes.json())
      } finally { setLoading(false) }
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function filter() {
      const params = new URLSearchParams()
      if (category !== 'Todos') params.set('category', category)
      if (search.trim()) params.set('search', search.trim())
      if (!params.toString()) { setFiltered([]); return }
      const res = await fetch(`/api/recipes?${params}`)
      setFiltered(await res.json())
    }
    filter()
  }, [category, search])

  const showFiltered = category !== 'Todos' || search.trim()

  return (
    <div className="home-page">
      <Navbar onSearch={setSearch} />

      <main className="home-main">

        {/* Filtros de categoria */}
        <div className="category-filters fade-in">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-chip ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="home-loading">
            <div className="loading-spinner" />
            <p>Carregando receitas...</p>
          </div>
        ) : showFiltered ? (
          <section className="filtered-section fade-in">
            <h2 className="section-title">
              {search ? `Resultados para "${search}"` : category}
              <span className="result-count">{filtered.length} receitas</span>
            </h2>
            {filtered.length === 0
              ? <div className="empty-state">
                  <span>🔍</span>
                  <p>Nenhuma receita encontrada</p>
                </div>
              : <div className="grid-recipes">
                  {filtered.map(r => <RecipeCard key={r.id} recipe={r} />)}
                </div>
            }
          </section>
        ) : (
          <>
            <Carousel recipes={featured} title="Favoritos das pituquinhas ❤️" />
            <Carousel recipes={recent}   title="Novidades da semana ✨" />
          </>
        )}
      </main>
    </div>
  )
}
