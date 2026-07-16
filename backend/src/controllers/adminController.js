const Statistique = require('../models/Statistique')
const pool = require('../config/database')
const sendEmail = require('../utils/email')

// ── STATS COMMANDES PAR MENU (MongoDB) ───────────────
const getStatsCommandes = async (req, res) => {
  try {
    const stats = await Statistique.aggregate([
      {
        $group: {
          _id: '$menu_titre',
          nb_commandes: { $sum: 1 },
          total_personnes: { $sum: '$nb_personnes' },
          chiffre_affaires: { $sum: '$prix_total' }
        }
      },
      { $sort: { nb_commandes: -1 } }
    ])

    res.json(stats)

  } catch (error) {
    console.error('Erreur getStatsCommandes :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── CHIFFRE D'AFFAIRES PAR MENU ET PÉRIODE ───────────
const getChiffreAffaires = async (req, res) => {
  try {
    const { menu_id, date_debut, date_fin } = req.query

    const filtre = {}

    if (menu_id) filtre.menu_id = parseInt(menu_id)

    if (date_debut || date_fin) {
      filtre.date_commande = {}
      if (date_debut) filtre.date_commande.$gte = new Date(date_debut)
      if (date_fin) filtre.date_commande.$lte = new Date(date_fin)
    }

    const stats = await Statistique.aggregate([
      { $match: filtre },
      {
        $group: {
          _id: { menu_id: '$menu_id', menu_titre: '$menu_titre' },
          nb_commandes: { $sum: 1 },
          chiffre_affaires: { $sum: '$prix_total' },
          total_personnes: { $sum: '$nb_personnes' }
        }
      },
      { $sort: { chiffre_affaires: -1 } }
    ])

    res.json(stats)

  } catch (error) {
    console.error('Erreur getChiffreAffaires :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── CRÉER COMPTE EMPLOYÉ ──────────────────────────────
const createEmploye = async (req, res) => {
  try {
    const { email, password } = req.body
    const bcrypt = require('bcryptjs')

    const [existing] = await pool.query(
      'SELECT * FROM utilisateur WHERE email = ?',
      [email]
    )

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await pool.query(
      `INSERT INTO utilisateur (role_id, email, password, nom, prenom)
       VALUES (2, ?, ?, 'Employé', 'Nouveau')`,
      [email, hashedPassword]
    )

    try {
      await sendEmail({
        to: email,
        subject: 'Votre compte employé - Vite & Gourmand',
        html: `
          <h1>Bienvenue dans l'équipe !</h1>
          <p>Un compte employé a été créé pour vous sur Vite & Gourmand.</p>
          <p>Votre identifiant : <strong>${email}</strong></p>
          <p>Le mot de passe ne vous sera pas communiqué par email.</p>
          <p>Rapprochez-vous de l'administrateur pour l'obtenir.</p>
          <p><strong>L'équipe Vite & Gourmand</strong></p>
        `
      })
    } catch (emailError) {
      console.error('Email employé non envoyé :', emailError.message)
    }

    res.status(201).json({ message: 'Compte employé créé avec succès' })

  } catch (error) {
    console.error('Erreur createEmploye :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── DÉSACTIVER COMPTE EMPLOYÉ ─────────────────────────
const toggleEmploye = async (req, res) => {
  try {
    const { id } = req.params

    const [users] = await pool.query(
      'SELECT * FROM utilisateur WHERE utilisateur_id = ? AND role_id = 2',
      [id]
    )

    if (users.length === 0) {
      return res.status(404).json({ message: 'Employé non trouvé' })
    }

    const nouvelEtat = !users[0].actif

    await pool.query(
      'UPDATE utilisateur SET actif = ? WHERE utilisateur_id = ?',
      [nouvelEtat, id]
    )

    res.json({ 
      message: `Compte employé ${nouvelEtat ? 'activé' : 'désactivé'} avec succès` 
    })

  } catch (error) {
    console.error('Erreur toggleEmploye :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

module.exports = { 
  getStatsCommandes, 
  getChiffreAffaires, 
  createEmploye, 
  toggleEmploye 
}