const express = require('express');
const cors    = require('cors');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const DB_PATH = path.join(__dirname, 'db.json');

function loadDB() {
  if (!fs.existsSync(DB_PATH)) return { users: [], recipes: [], favorites: [], nextId: { user: 1, recipe: 1, fav: 1 } };
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

if (!fs.existsSync(DB_PATH)) {
  const db = {
    users: [{ id: 1, name: 'Pituquinhas', password: 'admin123', created_at: new Date().toISOString() }],
    recipes: [
      { id:1, user_id:1, title:'Feijão Carioquinha',       category:'Comida caseira', ingredients:'Feijão carioquinha\nAlho\nCebola\nLouro\nSal a gosto', instructions:'Deixe o feijão de molho por 2 horas.\nCozinhe na pressão por 30 min.\nRefogue o alho e a cebola.\nMisture e tempere.', cook_time:'00:40:00', servings:'4 porções', image_url:null, created_at: new Date().toISOString() },
      { id:2, user_id:1, title:'Pudim de Leite',            category:'Doces',          ingredients:'1 lata de leite condensado\n3 ovos\n1 lata de leite', instructions:'Faça a calda com açúcar na forma.\nBata os ingredientes no liquidificador.\nDespeje na forma.\nAssar em banho-maria por 1h.', cook_time:'01:00:00', servings:'6 porções', image_url:null, created_at: new Date().toISOString() },
      { id:3, user_id:1, title:'Bolo de Fubá com Goiabada', category:'Doces',          ingredients:'2 xícaras de fubá\n3 ovos\n1 xícara de leite\n1 xícara de açúcar\nGoiabada', instructions:'Misture os ingredientes secos.\nAdicione ovos e leite.\nIntercale com goiabada.\nAsse por 45 min.', cook_time:'00:45:00', servings:'8 porções', image_url:null, created_at: new Date().toISOString() },
      { id:4, user_id:1, title:'Pão de Forma Caseiro',      category:'Comida caseira', ingredients:'4 xícaras de farinha\n1 sachê de fermento\n1 xícara de leite morno\nManteiga\nSal', instructions:'Dissolva o fermento no leite.\nMisture e sove por 10 min.\nDeixe descansar 1h.\nAsse por 35 min.', cook_time:'02:00:00', servings:'10 fatias', image_url:null, created_at: new Date().toISOString() },
      { id:5, user_id:1, title:'Vitamina de Banana',         category:'bebidas',        ingredients:'2 bananas maduras\n1 copo de leite\nMel a gosto', instructions:'Bata tudo no liquidificador.\nSirva gelado.', cook_time:'00:05:00', servings:'2 copos', image_url:null, created_at: new Date().toISOString() },
      { id:6, user_id:1, title:'Coxinha',                    category:'salgados',       ingredients:'2 peitos de frango\n3 xícaras de farinha\nCatupiry\nCaldo de frango\nOvo\nFarinha de rosca', instructions:'Cozinhe e desfie o frango.\nFaça a massa com o caldo.\nRecheie e modele.\nEmpane e frite.', cook_time:'01:30:00', servings:'20 unidades', image_url:null, created_at: new Date().toISOString() },
    ],
    favorites: [],
    nextId: { user: 2, recipe: 7, fav: 1 },
  };
  saveDB(db);
  console.log('Banco de dados criado!');
}

function withAuthor(recipe, db) {
  const author = db.users.find(u => u.id === recipe.user_id);
  return { ...recipe, author_name: author?.name || 'Pituquinha' };
}

app.post('/api/register', (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
  const db = loadDB();
  if (db.users.find(u => u.name.toLowerCase() === name.trim().toLowerCase()))
    return res.status(409).json({ error: 'Nome de usuário já existe.' });
  const user = { id: db.nextId.user++, name: name.trim(), password, created_at: new Date().toISOString() };
  db.users.push(user);
  saveDB(db);
  res.status(201).json({ id: user.id, name: user.name });
});

app.post('/api/login', (req, res) => {
  const { name, password } = req.body;
  const db   = loadDB();
  const user = db.users.find(u => u.name.toLowerCase() === name?.trim().toLowerCase() && u.password === password);
  if (!user) return res.status(401).json({ error: 'Nome ou senha incorretos.' });
  res.json({ id: user.id, name: user.name });
});

app.get('/api/recipes/featured', (req, res) => {
  const db = loadDB();
  res.json(db.recipes.slice(0, 8).map(r => withAuthor(r, db)));
});

app.get('/api/recipes/recent', (req, res) => {
  const db   = loadDB();
  const list = [...db.recipes].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8);
  res.json(list.map(r => withAuthor(r, db)));
});

app.get('/api/recipes', (req, res) => {
  const { category, search } = req.query;
  const db = loadDB();
  let list = db.recipes;
  if (category) list = list.filter(r => r.category === category);
  if (search)   list = list.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));
  list = [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(list.map(r => withAuthor(r, db)));
});

app.get('/api/recipes/:id', (req, res) => {
  const db     = loadDB();
  const recipe = db.recipes.find(r => r.id === Number(req.params.id));
  if (!recipe) return res.status(404).json({ error: 'Receita não encontrada.' });
  res.json(withAuthor(recipe, db));
});

app.post('/api/recipes', upload.single('image'), (req, res) => {
  const { user_id, title, category, ingredients, instructions, cook_time, servings } = req.body;
  if (!user_id || !title || !category || !ingredients || !instructions)
    return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
  const db        = loadDB();
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  const recipe    = { id: db.nextId.recipe++, user_id: Number(user_id), title, category, ingredients, instructions, cook_time: cook_time || null, servings: servings || null, image_url, created_at: new Date().toISOString() };
  db.recipes.push(recipe);
  saveDB(db);
  res.status(201).json(withAuthor(recipe, db));
});

app.get('/api/users/:id/recipes', (req, res) => {
  const db   = loadDB();
  const list = db.recipes.filter(r => r.user_id === Number(req.params.id)).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(list.map(r => withAuthor(r, db)));
});

app.post('/api/favorites', (req, res) => {
  const { user_id, recipe_id } = req.body;
  const db = loadDB();
  if (!db.favorites.find(f => f.user_id === Number(user_id) && f.recipe_id === Number(recipe_id))) {
    db.favorites.push({ id: db.nextId.fav++, user_id: Number(user_id), recipe_id: Number(recipe_id) });
    saveDB(db);
  }
  res.json({ ok: true });
});

app.delete('/api/favorites', (req, res) => {
  const { user_id, recipe_id } = req.body;
  const db = loadDB();
  db.favorites = db.favorites.filter(f => !(f.user_id === Number(user_id) && f.recipe_id === Number(recipe_id)));
  saveDB(db);
  res.json({ ok: true });
});

app.get('/api/users/:id/favorites', (req, res) => {
  const db   = loadDB();
  const uid  = Number(req.params.id);
  const list = db.favorites.filter(f => f.user_id === uid).map(f => db.recipes.find(r => r.id === f.recipe_id)).filter(Boolean);
  res.json(list.map(r => withAuthor(r, db)));
});
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(frontendDist, 'index.html'));
    }
  });
}
app.listen(PORT, () => console.log('Pituquinhas backend rodando em http://localhost:' + PORT));