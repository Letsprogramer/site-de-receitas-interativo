import RecipeCard from './RecipeCard.jsx'
import './Carousel.css'

export default function Carousel({ recipes = [], title }) {
  if (!recipes.length) return null

  // Duplicar para loop infinito
  const doubled = [...recipes, ...recipes]

  return (
    <section className="carousel-section">
      {title && <h2 className="carousel-title">{title}</h2>}
      <div className="carousel-track-wrapper">
        <div
          className="carousel-track"
          style={{ '--count': recipes.length }}
        >
          {doubled.map((r, i) => (
            <RecipeCard key={`${r.id}-${i}`} recipe={r} />
          ))}
        </div>
      </div>
    </section>
  )
}
