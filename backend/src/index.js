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

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())

// Connexion MongoDB
connectMongoDB()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/menus', menuRoutes)
app.use('/api/commandes', commandeRoutes)

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API Vite & Gourmand fonctionne !' })
})

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
})