const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  // Récupérer le token dans le header
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Accès refusé - Token manquant' 
    })
  }

  // Extraire le token
  const token = authHeader.split(' ')[1]

  try {
    // Vérifier et décoder le token
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