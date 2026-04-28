import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App.jsx'
import logo from '../assets/logo.png'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const [name, setName]         = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [mode, setMode]         = useState('login') // 'login' | 'register'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !password.trim()) { setError('Preencha todos os campos!'); return }
    setLoading(true); setError('')

    const endpoint = mode === 'login' ? '/api/login' : '/api/register'
    try {
      const res  = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erro inesperado'); return }

      // Se cadastro, faz login automático
      if (mode === 'register') {
        const loginRes = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), password }),
        })
        const loginData = await loginRes.json()
        login(loginData)
      } else {
        login(data)
      }
      navigate('/home')
    } catch {
      setError('Erro de conexão. Verifique se o servidor está rodando.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Decorative blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="login-container fade-in">
        {/* Logo */}
        <div className="login-logo">
          <img src={logo} alt="Pituquinhas" />
        </div>

        {/* Card */}
        <div className="login-card">
          <h2 className="login-title">
            {mode === 'login' ? 'Bem-vinda! 👩‍🍳' : 'Cadastre-se'}
          </h2>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="field-group">
              <label>Seu nome</label>
              <input
                type="text"
                placeholder="Como você se chama?"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="field-group">
              <label>Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="btn-acessar" disabled={loading}>
              {loading ? '...' : mode === 'login' ? 'Acessar' : 'Criar conta'}
            </button>
          </form>

          <p className="login-toggle">
            {mode === 'login' ? 'Ainda não tem conta?' : 'Já tem conta?'}{' '}
            <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
              {mode === 'login' ? 'Cadastre-se' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
