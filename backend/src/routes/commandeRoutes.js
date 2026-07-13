const express = require('express')
const router = express.Router()
const {
  createCommande,
  getMesCommandes,
  getCommandeById,
  annulerCommande,
  modifierCommande,
  getAllCommandes,
  updateStatut
} = require('../controllers/commandeController')
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware')

// Routes utilisateur (connecté)
router.post('/', authMiddleware, createCommande)
router.get('/mes-commandes', authMiddleware, getMesCommandes)
router.get('/:id', authMiddleware, getCommandeById)
router.put('/:id/annuler', authMiddleware, annulerCommande)
router.put('/:id/modifier', authMiddleware, modifierCommande)

// Routes employé/admin
router.get('/', authMiddleware, checkRole('employe', 'administrateur'), getAllCommandes)
router.put('/:id/statut', authMiddleware, checkRole('employe', 'administrateur'), updateStatut)

module.exports = router