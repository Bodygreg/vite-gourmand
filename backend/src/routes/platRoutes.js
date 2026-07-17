const express = require('express')
const router = express.Router()
const { getAllPlats, createPlat, updatePlat, deletePlat, getPlatsMenu, addPlatToMenu, removePlatFromMenu } = require('../controllers/platController')
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware')

router.get('/', getAllPlats)
router.get('/menu/:id', getPlatsMenu)
router.post('/', authMiddleware, checkRole('employe', 'administrateur'), createPlat)
router.put('/:id', authMiddleware, checkRole('employe', 'administrateur'), updatePlat)
router.delete('/:id', authMiddleware, checkRole('employe', 'administrateur'), deletePlat)
router.post('/menu', authMiddleware, checkRole('employe', 'administrateur'), addPlatToMenu)
router.delete('/menu/:menu_id/:plat_id', authMiddleware, checkRole('employe', 'administrateur'), removePlatFromMenu)

module.exports = router