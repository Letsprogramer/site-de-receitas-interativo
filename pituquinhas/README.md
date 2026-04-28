# 🍳 Pituquinhas – Caderninho de Receitas

Site de receitas com cadastro de usuários, adição de receitas e banco de dados SQLite.

---

## Estrutura

```
pituquinhas/
├── backend/          ← API Node.js + Express + SQLite
│   ├── server.js
│   └── package.json
└── frontend/         ← React + Vite
    ├── src/
    │   ├── pages/    ← Login, Home, AddRecipe, RecipeDetail, MyRecipes, Favorites
    │   ├── components/ ← Navbar, Carousel, RecipeCard
    │   └── assets/   ← logo.png, caderninho.png
    ├── vite.config.js
    └── package.json
```

---

## Como rodar

### 1. Backend

```bash
cd backend
npm install
npm start
# Roda em http://localhost:3001
```

O banco SQLite (`pituquinhas.db`) é criado automaticamente com receitas de exemplo.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# Abre em http://localhost:5173
```

---

## Funcionalidades

- ✅ Cadastro e login de usuários (salvos no SQLite)
- ✅ Adicionar receita em 2 etapas (categoria, nome, foto → ingredientes, preparo, tempo)
- ✅ Upload de imagem do prato
- ✅ Carrosseis animados na Home com pause no hover
- ✅ Filtro por categoria e busca por nome
- ✅ Favoritar receitas
- ✅ Ver "Minhas receitas" e "Meus favoritos"
- ✅ Página de detalhe da receita
- ✅ Paleta verde musgo + bege off-white
- ✅ Hover com lift + sombra nos cards
- ✅ Receitas vinculadas ao usuário que publicou

---

## Paleta de cores

| Token          | Hex       | Uso                  |
|----------------|-----------|----------------------|
| `--bg`         | `#D4A870` | Fundo principal      |
| `--green`      | `#6E7D4A` | Verde musgo          |
| `--green-dark` | `#4A5630` | Verde escuro/botões  |
| `--white`      | `#F8F4EC` | Off-white/campos     |
| `--brown`      | `#5C3D1E` | Textos de título     |

---

## Tecnologias

- **Frontend**: React 18, Vite 5, React Router 6
- **Backend**: Node.js, Express 4, better-sqlite3
- **Banco**: SQLite (arquivo local `backend/pituquinhas.db`)
- **Upload**: Multer
- **Fontes**: Pacifico (brand) + Nunito (body)
