const express = require('express')
const router = express.Router()
const { 
  getStatsCommandes,
  getChiffreAffaires,
  createEmploye,
  toggleEmploye
} = require('../controllers/adminController')
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware')

// Toutes les routes admin nécessitent d'être admin
router.get('/stats', authMiddleware, checkRole('administrateur'), getStatsCommandes)
router.get('/chiffre-affaires', authMiddleware, checkRole('administrateur'), getChiffreAffaires)
router.post('/employes', authMiddleware, checkRole('administrateur'), createEmploye)
router.put('/employes/:id/toggle', authMiddleware, checkRole('administrateur'), toggleEmploye)

module.exports = router