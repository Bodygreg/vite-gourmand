const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

// Chargement des variables d'environnement
const path = require('path')
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Connexion base de données
const pool = require('./config/database')

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API Vite & Gourmand fonctionne !' })
})

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
})

