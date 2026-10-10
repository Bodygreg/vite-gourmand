const mongoose = require('mongoose')
const crypto = require('crypto') // ← ajoute cette ligne

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connexion MongoDB réussie !')
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB :', error.message)
  }
}

module.exports = connectMongoDB