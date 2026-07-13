const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/database')
const nodemailer = require('nodemailer')

// Configuration email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
})

// ── INSCRIPTION ──────────────────────────────────────
const register = async (req, res) => {
  try {
    const { nom, prenom, email, password, telephone, adresse, ville, code_postal } = req.body

    // Vérifier que l'email n'existe pas déjà
    const [existingUser] = await pool.query(
      'SELECT * FROM utilisateur WHERE email = ?',
      [email]
    )

    if (existingUser.length > 0) {
      return res.status(400).json({ 
        message: 'Cet email est déjà utilisé' 
      })
    }

    // Vérifier la complexité du mot de passe
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Le mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial' 
      })
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insérer l'utilisateur (rôle 3 = utilisateur)
    await pool.query(
      `INSERT INTO utilisateur 
      (role_id, email, password, nom, prenom, telephone, adresse, ville, code_postal) 
      VALUES (3, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, nom, prenom, telephone, adresse, ville, code_postal]
    )

    // Envoi email — non bloquant
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Bienvenue chez Vite & Gourmand !',
        html: `
          <h1>Bienvenue ${prenom} !</h1>
          <p>Votre compte a bien été créé sur Vite & Gourmand.</p>
          <p>Vous pouvez dès maintenant vous connecter et découvrir nos menus.</p>
          <p>À bientôt !</p>
          <p><strong>L'équipe Vite & Gourmand</strong></p>
        `
      })
    } catch (emailError) {
      console.error('Email non envoyé :', emailError.message)
      // On continue même si l'email échoue
    }

    // Toujours répondre succès
    res.status(201).json({ 
      message: 'Compte créé avec succès !' 
    })

  } catch (error) {
    console.error('Erreur inscription :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── CONNEXION ─────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Chercher l'utilisateur
    const [users] = await pool.query(
      `SELECT u.*, r.libelle as role 
       FROM utilisateur u 
       JOIN role r ON u.role_id = r.role_id 
       WHERE u.email = ? AND u.actif = true`,
      [email]
    )

    if (users.length === 0) {
      return res.status(401).json({ 
        message: 'Email ou mot de passe incorrect' 
      })
    }

    const user = users[0]

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ 
        message: 'Email ou mot de passe incorrect' 
      })
    }

    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: user.utilisateur_id, 
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      token,
      user: {
        id: user.utilisateur_id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        telephone: user.telephone,
        adresse: user.adresse,
        ville: user.ville,
        code_postal: user.code_postal
      }
    })

  } catch (error) {
    console.error('Erreur connexion :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── INFOS UTILISATEUR CONNECTÉ ────────────────────────
const getMe = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT u.utilisateur_id, u.nom, u.prenom, u.email, 
              u.telephone, u.adresse, u.ville, u.code_postal,
              r.libelle as role
       FROM utilisateur u
       JOIN role r ON u.role_id = r.role_id
       WHERE u.utilisateur_id = ?`,
      [req.user.id]
    )

    if (users.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' })
    }

    res.json(users[0])

  } catch (error) {
    console.error('Erreur getMe :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── MOT DE PASSE OUBLIÉ ───────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const [users] = await pool.query(
      'SELECT * FROM utilisateur WHERE email = ?',
      [email]
    )

    if (users.length === 0) {
      return res.json({ 
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' 
      })
    }

    // Générer un token temporaire (valable 1h)
    const resetToken = jwt.sign(
      { id: users[0].utilisateur_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    // Envoi email — non bloquant
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
          <h1>Réinitialisation de mot de passe</h1>
          <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
          <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">
            Réinitialiser mon mot de passe
          </a>
          <p>Ce lien est valable 1 heure.</p>
        `
      })
    } catch (emailError) {
      console.error('Email reset non envoyé :', emailError.message)
    }

    res.json({ 
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' 
    })

  } catch (error) {
    console.error('Erreur forgotPassword :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

module.exports = { register, login, getMe, forgotPassword }