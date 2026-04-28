import { Routes, Route, Navigate } from 'react-router-dom'
import { createContext, useContext, useState, useEffect } from 'react'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import AddRecipe from './pages/AddRecipe.jsx'
import RecipeDetail from './pages/RecipeDetail.jsx'
import MyRecipes from './pages/MyRecipes.jsx'
import Favorites from './pages/Favorites.jsx'

// ─── Auth Context ─────────────────────────────────────────────────────────────
export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" replace />
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pitu_user')) } catch { return null }
  })

  const login  = (u) => { setUser(u); localStorage.setItem('pitu_user', JSON.stringify(u)) }
  const logout = ()  => { setUser(null); localStorage.removeItem('pitu_user') }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Routes>
        <Route path="/"           element={user ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/home"       element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/add"        element={<PrivateRoute><AddRecipe /></PrivateRoute>} />
        <Route path="/recipe/:id" element={<PrivateRoute><RecipeDetail /></PrivateRoute>} />
        <Route path="/my-recipes" element={<PrivateRoute><MyRecipes /></PrivateRoute>} />
        <Route path="/favorites"  element={<PrivateRoute><Favorites /></PrivateRoute>} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </AuthContext.Provider>
  )
}
