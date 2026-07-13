const express = require('express')
const router = express.Router()
const { register, login, getMe, forgotPassword } = require('../controllers/authController')
const { authMiddleware } = require('../middlewares/authMiddleware')

// Routes publiques (pas besoin d'être connecté)
router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)

// Routes protégées (token JWT obligatoire)
router.get('/me', authMiddleware, getMe)

module.exports = router