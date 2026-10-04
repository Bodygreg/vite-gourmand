const express = require('express')
const router = express.Router()
const { register, login, getMe, forgotPassword, resetPassword } = require('../controllers/authController')
const { authMiddleware } = require('../middlewares/authMiddleware')

// Routes publiques
router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

// Route déconnexion — efface le cookie
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  })
  res.json({ message: 'Déconnecté avec succès' })
})

// Routes protégées
router.get('/me', authMiddleware, getMe)

module.exports = router