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

module.exports = router