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
router.get('/employes', authMiddleware, checkRole('administrateur'), async (req, res) => {
  try {
    const pool = require('../config/database')
    const [employes] = await pool.query(
      `SELECT utilisateur_id, nom, prenom, email, actif 
       FROM utilisateur WHERE role_id = 2`
    )
    res.json(employes)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

module.exports = router