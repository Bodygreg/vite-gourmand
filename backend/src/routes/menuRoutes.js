const express = require('express')
const router = express.Router()
const { 
  getAllMenus, 
  getMenuById, 
  createMenu, 
  updateMenu, 
  deleteMenu 
} = require('../controllers/menuController')
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware')

// Routes publiques
router.get('/', getAllMenus)
router.get('/:id', getMenuById)

// Routes protégées (employé et admin seulement)
router.post('/', authMiddleware, checkRole('employe', 'administrateur'), createMenu)
router.put('/:id', authMiddleware, checkRole('employe', 'administrateur'), updateMenu)
router.delete('/:id', authMiddleware, checkRole('employe', 'administrateur'), deleteMenu)

module.exports = router