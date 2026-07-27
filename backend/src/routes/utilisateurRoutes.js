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
router.delete('/compte', authMiddleware, async (req, res) => {
  try {
    const pool = require('../config/database')
    const utilisateur_id = req.user.id

    // Supprimer dans l'ordre des dépendances
    await pool.query('DELETE FROM avis WHERE utilisateur_id = ?', [utilisateur_id])
    await pool.query(
      'DELETE FROM historique_statut WHERE commande_id IN (SELECT commande_id FROM commande WHERE utilisateur_id = ?)',
      [utilisateur_id]
    )
    await pool.query('DELETE FROM commande WHERE utilisateur_id = ?', [utilisateur_id])
    await pool.query('DELETE FROM utilisateur WHERE utilisateur_id = ?', [utilisateur_id])

    res.json({ message: 'Compte supprimé avec succès' })
  } catch (error) {
    console.error('Erreur suppression compte:', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

module.exports = router