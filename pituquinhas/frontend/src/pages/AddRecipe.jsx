import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App.jsx'
import caderninho from '../assets/caderninho.png'
import './AddRecipe.css'

const CATEGORIES = ['Doces','Comida caseira','bebidas','salgados','Fitness','Internacionais']

export default function AddRecipe() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const fileRef  = useRef(null)

  const [step,     setStep]     = useState(1)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [preview,  setPreview]  = useState(null)

  const [form, setForm] = useState({
    category:     '',
    title:        '',
    image:        null,
    ingredients:  '',
    instructions: '',
    hours:        '00',
    minutes:      '00',
    seconds:      '00',
    servings:     '',
  })

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    set('image', file)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  function goNext() {
    if (!form.category) { setError('Selecione uma categoria!'); return }
    if (!form.title.trim()) { setError('Digite o nome do prato!'); return }
    setError('')
    setStep(2)
  }

  async function handleSubmit() {
    if (!form.ingredients.trim()) { setError('Adicione os ingredientes!'); return }
    if (!form.instructions.trim()) { setError('Adicione o modo de preparo!'); return }
    setLoading(true); setError('')

    try {
      const fd = new FormData()
      fd.append('user_id',      user.id)
      fd.append('title',        form.title.trim())
      fd.append('category',     form.category)
      fd.append('ingredients',  form.ingredients.trim())
      fd.append('instructions', form.instructions.trim())
      fd.append('cook_time',    `${form.hours}:${form.minutes}:${form.seconds}`)
      fd.append('servings',     form.servings)
      if (form.image) fd.append('image', form.image)

      const res  = await fetch('/api/recipes', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erro ao salvar.'); return }
      navigate(`/recipe/${data.id}`)
    } catch { setError('Erro de conexão.') }
    finally  { setLoading(false) }
  }

  return (
    <div className="add-page">
      <div className="add-container fade-in">

        {/* Lado esquerdo – mascote */}
        <div className="add-left">
          <button className="back-btn" onClick={() => step === 2 ? setStep(1) : navigate('/home')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <div className="progress-label">{step} de 2</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: step === 1 ? '50%' : '100%' }} />
          </div>

          <img src={caderninho} alt="Caderninho de receitas" className="add-mascot" />
        </div>

        {/* Lado direito – formulário */}
        <div className="add-form-card">
          {step === 1 ? (
            <Step1
              form={form} set={set} error={error}
              preview={preview} fileRef={fileRef}
              handleFile={handleFile} onNext={goNext}
            />
          ) : (
            <Step2
              form={form} set={set} error={error}
              loading={loading} onSubmit={handleSubmit}
            />
          )}
        </div>

      </div>
    </div>
  )
}

// ─── Step 1: categoria, nome, foto ─────────────────────────────────────────
function Step1({ form, set, error, preview, fileRef, handleFile, onNext }) {
  return (
    <div className="step-content fade-in">
      <h2 className="step-title">Qual categoria é a sua receita?</h2>

      <div className="checkbox-list">
        {CATEGORIES.map(cat => (
          <label key={cat} className={`cat-option ${form.category === cat ? 'checked' : ''}`}>
            <input
              type="radio" name="category" value={cat}
              checked={form.category === cat}
              onChange={() => set('category', cat)}
            />
            <span className="cat-check" />
            {cat}
          </label>
        ))}
      </div>

      <div className="field-group-add">
        <label>Digite o nome do seu prato</label>
        <input
          type="text"
          placeholder="Ex: Bolo de chocolate da vovó"
          value={form.title}
          onChange={e => set('title', e.target.value)}
        />
      </div>

      <div className="field-group-add">
        <label>Adicione uma foto do prato</label>
        <div
          className="upload-area"
          onClick={() => fileRef.current?.click()}
          style={preview ? { backgroundImage: `url(${preview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          {!preview && (
            <>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>Clique para adicionar</span>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button className="btn-next" onClick={onNext}>
        Próximo
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  )
}

// ─── Step 2: ingredientes, preparo, tempo, rendimento ─────────────────────
function Step2({ form, set, error, loading, onSubmit }) {
  return (
    <div className="step-content fade-in">
      <div className="field-group-add">
        <label>Digite os ingredientes</label>
        <textarea
          placeholder="1 xícara de farinha&#10;2 ovos&#10;1/2 xícara de açúcar..."
          value={form.ingredients}
          onChange={e => set('ingredients', e.target.value)}
          rows={4}
        />
      </div>

      <div className="field-group-add">
        <label>Modo de preparo</label>
        <textarea
          placeholder="Passo a passo do preparo..."
          value={form.instructions}
          onChange={e => set('instructions', e.target.value)}
          rows={5}
        />
      </div>

      <div className="field-group-add">
        <label>
          Tempo ⏱️
        </label>
        <div className="time-inputs">
          <input type="text" maxLength={2} placeholder="00" value={form.hours}   onChange={e => set('hours',   e.target.value.replace(/\D/,''))} />
          <span>:</span>
          <input type="text" maxLength={2} placeholder="00" value={form.minutes} onChange={e => set('minutes', e.target.value.replace(/\D/,''))} />
          <span>:</span>
          <input type="text" maxLength={2} placeholder="00" value={form.seconds} onChange={e => set('seconds', e.target.value.replace(/\D/,''))} />
        </div>
      </div>

      <div className="field-group-add">
        <label>Rendimento</label>
        <input
          type="text"
          placeholder="Ex: 4 porções"
          value={form.servings}
          onChange={e => set('servings', e.target.value)}
          className="short-input"
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button className="btn-submit" onClick={onSubmit} disabled={loading}>
        {loading ? 'Salvando...' : (
          <>
            Publicar receita
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
          </>
        )}
      </button>
    </div>
  )
}
