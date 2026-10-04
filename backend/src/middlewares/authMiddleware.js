const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  // Récupérer le token depuis le cookie HttpOnly
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).json({ 
      message: 'Accès refusé - Token manquant' 
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ 
      message: 'Token invalide ou expiré' 
    })
  }
}

// Middleware pour vérifier le rôle
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Accès refusé - Droits insuffisants' 
      })
    }
    next()
  }
}

module.exports = { authMiddleware, checkRole }