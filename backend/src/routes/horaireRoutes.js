const express = require('express')
const router = express.Router()
const { getHoraires, updateHoraire } = require('../controllers/horaireController')
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware')

// Route publique
router.get('/', getHoraires)

// Route employé/admin
router.put('/:id', authMiddleware, checkRole('employe', 'administrateur'), updateHoraire)

module.exports = router