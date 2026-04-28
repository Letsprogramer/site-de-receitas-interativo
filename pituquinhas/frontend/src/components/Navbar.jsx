import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../App.jsx'
import logo from '../assets/logo.png'
import './Navbar.css'

export default function Navbar({ onSearch }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery]     = useState('')
  const [menuOpen, setMenu]   = useState(false)

  function handleSearch(e) {
    e.preventDefault()
    onSearch?.(query)
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <button className="nav-logo" onClick={() => navigate('/home')}>
          <img src={logo} alt="Pituquinhas" />
        </button>

        {/* Busca */}
        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar receitas..."
            value={query}
            onChange={e => { setQuery(e.target.value); onSearch?.(e.target.value) }}
          />
          <button type="submit" className="search-btn" aria-label="Buscar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </form>

        {/* Ações */}
        <nav className="nav-actions">
          <button
            className={`nav-btn ${location.pathname === '/favorites' ? 'active' : ''}`}
            onClick={() => navigate('/favorites')}
            title="Favoritos"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill={location.pathname === '/favorites' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          <button
            className="nav-btn add-btn"
            onClick={() => navigate('/add')}
            title="Adicionar receita"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>

          <button
            className={`nav-btn ${location.pathname === '/my-recipes' ? 'active' : ''}`}
            onClick={() => navigate('/my-recipes')}
            title="Meu perfil"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </button>

          {/* Menu hambúrguer */}
          <div className="nav-menu-wrapper">
            <button className="nav-btn" onClick={() => setMenu(v => !v)} title="Menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>

            {menuOpen && (
              <>
                <div className="menu-overlay" onClick={() => setMenu(false)} />
                <div className="dropdown-menu fade-in">
                  <div className="menu-user">
                    <span className="menu-avatar">{user?.name?.[0]?.toUpperCase()}</span>
                    <span className="menu-name">{user?.name}</span>
                  </div>
                  <hr />
                  <button onClick={() => { navigate('/home'); setMenu(false) }}>🏠 Início</button>
                  <button onClick={() => { navigate('/my-recipes'); setMenu(false) }}>📖 Minhas receitas</button>
                  <button onClick={() => { navigate('/favorites'); setMenu(false) }}>❤️ Favoritos</button>
                  <button onClick={() => { navigate('/add'); setMenu(false) }}>➕ Adicionar receita</button>
                  <hr />
                  <button className="menu-logout" onClick={handleLogout}>🚪 Sair</button>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
