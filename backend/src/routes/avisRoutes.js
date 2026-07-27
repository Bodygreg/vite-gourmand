const express = require('express')
const router = express.Router()
const { 
  createAvis, 
  getAvisValides, 
  getAllAvis, 
  updateStatutAvis 
} = require('../controllers/avisController')
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware')

// Route publique
router.get('/', getAvisValides)

// Route utilisateur connecté
router.post('/', authMiddleware, createAvis)

// Routes employé/admin
router.get('/tous', authMiddleware, checkRole('employe', 'administrateur'), getAllAvis)
router.put('/:id/statut', authMiddleware, checkRole('employe', 'administrateur'), updateStatutAvis)

// Route mes avis pour l'utilisateur connecté
router.get('/mes-avis', authMiddleware, async (req, res) => {
  try {
    const pool = require('../config/database')
    const [avis] = await pool.query(
      'SELECT commande_id FROM avis WHERE utilisateur_id = ?',
      [req.user.id]
    )
    res.json(avis)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})


module.exports = router