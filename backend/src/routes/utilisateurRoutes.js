const express = require('express')
const router = express.Router()
const { 
  getProfil, 
  updateProfil, 
  updatePassword 
} = require('../controllers/utilisateurController')
const { authMiddleware } = require('../middlewares/authMiddleware')

// Toutes les routes nécessitent d'être connecté
router.get('/profil', authMiddleware, getProfil)
router.put('/profil', authMiddleware, updateProfil)
router.put('/password', authMiddleware, updatePassword)

module.exports = router