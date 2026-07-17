const express = require('express')
const cors = require('cors')
const path = require('path')
const dotenv = require('dotenv')

// Chargement des variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Connexion bases de données
const pool = require('./config/database')
const connectMongoDB = require('./config/mongodb')

// Import des routes
const authRoutes = require('./routes/authRoutes')
const menuRoutes = require('./routes/menuRoutes')
const commandeRoutes = require('./routes/commandeRoutes')
const avisRoutes = require('./routes/avisRoutes')
const utilisateurRoutes = require('./routes/utilisateurRoutes')
const adminRoutes = require('./routes/adminRoutes')
const horaireRoutes = require('./routes/horaireRoutes')
const contactRoutes = require('./routes/contactRoutes')
const themeRoutes = require('./routes/themeRoutes')
const regimeRoutes = require('./routes/regimeRoutes')
const platRoutes = require('./routes/platRoutes')

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://vite-gourmand-lemon.vercel.app'
  ],
  credentials: true
}))
app.use(express.json())

// Connexion MongoDB
connectMongoDB()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/menus', menuRoutes)
app.use('/api/commandes', commandeRoutes)
app.use('/api/avis', avisRoutes)
app.use('/api/utilisateurs', utilisateurRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/horaires', horaireRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/themes', themeRoutes)
app.use('/api/regimes', regimeRoutes)
app.use('/api/plats', platRoutes)

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API Vite & Gourmand fonctionne !' })
})

app.get('/api/allergenes', async (req, res) => {
  try {
    const [allergenes] = await pool.query('SELECT * FROM allergene')
    res.json(allergenes)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
})