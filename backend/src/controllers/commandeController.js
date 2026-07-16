const pool = require('../config/database')
const Statistique = require('../models/Statistique')
const nodemailer = require('nodemailer')

// Configuration email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

// ── CALCUL PRIX LIVRAISON ─────────────────────────────
const calculPrixLivraison = (ville) => {
  const villeNormalisee = ville.toLowerCase().trim()
  if (villeNormalisee === 'bordeaux') {
    return 5.00
  }
  // Pour les autres villes on applique 5€ + 0.59€/km
  // En production on utiliserait une API de géolocalisation
  // Pour le développement on fixe une distance exemple de 20km
  return 5 + (20 * 0.59)
}

// ── CRÉER UNE COMMANDE ────────────────────────────────
const createCommande = async (req, res) => {
  try {
    const {
      menu_id,
      date_prestation,
      heure_livraison,
      adresse_livraison,
      ville_livraison,
      nb_personnes
    } = req.body

    const utilisateur_id = req.user.id

    // Récupérer le menu
    const [menus] = await pool.query(
      'SELECT * FROM menu WHERE menu_id = ? AND actif = true',
      [menu_id]
    )

    if (menus.length === 0) {
      return res.status(404).json({ message: 'Menu non trouvé' })
    }

    const menu = menus[0]

    // Vérifier le stock
    if (menu.stock <= 0) {
      return res.status(400).json({ message: 'Ce menu n\'est plus disponible' })
    }

    // Vérifier le nombre minimum de personnes
    if (nb_personnes < menu.nb_personnes_min) {
      return res.status(400).json({ 
        message: `Ce menu nécessite un minimum de ${menu.nb_personnes_min} personnes` 
      })
    }

    // Calcul du prix
    let prix_menu = menu.prix * nb_personnes

    // Réduction 10% si 5 personnes de plus que le minimum
    if (nb_personnes >= menu.nb_personnes_min + 5) {
      prix_menu = prix_menu * 0.9
    }

    // Calcul prix livraison
    const prix_livraison = calculPrixLivraison(ville_livraison)

    // Créer la commande
    const [result] = await pool.query(
      `INSERT INTO commande 
      (utilisateur_id, menu_id, date_prestation, heure_livraison, 
       adresse_livraison, ville_livraison, nb_personnes, prix_menu, prix_livraison)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [utilisateur_id, menu_id, date_prestation, heure_livraison,
       adresse_livraison, ville_livraison, nb_personnes, prix_menu, prix_livraison]
    )

    const commande_id = result.insertId

    // Décrémenter le stock
    await pool.query(
      'UPDATE menu SET stock = stock - 1 WHERE menu_id = ?',
      [menu_id]
    )

    // Enregistrer dans MongoDB pour les statistiques
    try {
      await Statistique.create({
        menu_id: menu.menu_id,
        menu_titre: menu.titre,
        commande_id,
        nb_personnes,
        prix_total: prix_menu + prix_livraison
      })
    } catch (mongoError) {
      console.error('Erreur MongoDB stats :', mongoError.message)
    }

    // Email de confirmation
    const [users] = await pool.query(
      'SELECT * FROM utilisateur WHERE utilisateur_id = ?',
      [utilisateur_id]
    )

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: users[0].email,
        subject: 'Confirmation de votre commande - Vite & Gourmand',
        html: `
          <h1>Votre commande est confirmée !</h1>
          <p>Bonjour ${users[0].prenom},</p>
          <p>Votre commande a bien été enregistrée :</p>
          <ul>
            <li><strong>Menu :</strong> ${menu.titre}</li>
            <li><strong>Nombre de personnes :</strong> ${nb_personnes}</li>
            <li><strong>Date :</strong> ${date_prestation}</li>
            <li><strong>Heure :</strong> ${heure_livraison}</li>
            <li><strong>Adresse :</strong> ${adresse_livraison}, ${ville_livraison}</li>
            <li><strong>Prix menu :</strong> ${prix_menu.toFixed(2)}€</li>
            <li><strong>Prix livraison :</strong> ${prix_livraison.toFixed(2)}€</li>
            <li><strong>Total :</strong> ${(prix_menu + prix_livraison).toFixed(2)}€</li>
          </ul>
          <p>À bientôt !</p>
          <p><strong>L'équipe Vite & Gourmand</strong></p>
        `
      })
    } catch (emailError) {
      console.error('Email confirmation non envoyé :', emailError.message)
    }

    res.status(201).json({
      message: 'Commande créée avec succès !',
      commande_id,
      prix_menu: prix_menu.toFixed(2),
      prix_livraison: prix_livraison.toFixed(2),
      total: (prix_menu + prix_livraison).toFixed(2)
    })

  } catch (error) {
    console.error('Erreur createCommande :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── GET COMMANDES UTILISATEUR ─────────────────────────
const getMesCommandes = async (req, res) => {
  try {
    const utilisateur_id = req.user.id

    const [commandes] = await pool.query(
      `SELECT c.*, m.titre as menu_titre, m.description as menu_description
       FROM commande c
       JOIN menu m ON c.menu_id = m.menu_id
       WHERE c.utilisateur_id = ?
       ORDER BY c.created_at DESC`,
      [utilisateur_id]
    )

    res.json(commandes)

  } catch (error) {
    console.error('Erreur getMesCommandes :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── GET UNE COMMANDE ──────────────────────────────────
const getCommandeById = async (req, res) => {
  try {
    const { id } = req.params
    const utilisateur_id = req.user.id
    const role = req.user.role

    const [commandes] = await pool.query(
      `SELECT c.*, m.titre as menu_titre, u.nom, u.prenom, u.email, u.telephone
       FROM commande c
       JOIN menu m ON c.menu_id = m.menu_id
       JOIN utilisateur u ON c.utilisateur_id = u.utilisateur_id
       WHERE c.commande_id = ?`,
      [id]
    )

    if (commandes.length === 0) {
      return res.status(404).json({ message: 'Commande non trouvée' })
    }

    // Un utilisateur ne peut voir que ses propres commandes
    if (role === 'utilisateur' && commandes[0].utilisateur_id !== utilisateur_id) {
      return res.status(403).json({ message: 'Accès refusé' })
    }

    // Récupérer l'historique des statuts
    const [historique] = await pool.query(
      `SELECT h.*, u.nom as employe_nom, u.prenom as employe_prenom
       FROM historique_statut h
       JOIN utilisateur u ON h.employe_id = u.utilisateur_id
       WHERE h.commande_id = ?
       ORDER BY h.date_changement ASC`,
      [id]
    )

    res.json({ ...commandes[0], historique })

  } catch (error) {
    console.error('Erreur getCommandeById :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── ANNULER UNE COMMANDE (utilisateur) ───────────────
const annulerCommande = async (req, res) => {
  try {
    const { id } = req.params
    const utilisateur_id = req.user.id

    const [commandes] = await pool.query(
      'SELECT * FROM commande WHERE commande_id = ?',
      [id]
    )

    if (commandes.length === 0) {
      return res.status(404).json({ message: 'Commande non trouvée' })
    }

    const commande = commandes[0]

    // Vérifier que c'est bien sa commande
    if (commande.utilisateur_id !== utilisateur_id) {
      return res.status(403).json({ message: 'Accès refusé' })
    }

    // On ne peut annuler que si statut "en attente"
    if (commande.statut !== 'en attente') {
      return res.status(400).json({ 
        message: 'Cette commande ne peut plus être annulée' 
      })
    }

    // Annuler et remettre le stock
    await pool.query(
      'UPDATE commande SET statut = ? WHERE commande_id = ?',
      ['annulée', id]
    )

    await pool.query(
      'UPDATE menu SET stock = stock + 1 WHERE menu_id = ?',
      [commande.menu_id]
    )

    res.json({ message: 'Commande annulée avec succès' })

  } catch (error) {
    console.error('Erreur annulerCommande :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── MODIFIER UNE COMMANDE (utilisateur) ──────────────
const modifierCommande = async (req, res) => {
  try {
    const { id } = req.params
    const utilisateur_id = req.user.id
    const { date_prestation, heure_livraison, adresse_livraison, ville_livraison, nb_personnes } = req.body

    const [commandes] = await pool.query(
      'SELECT * FROM commande WHERE commande_id = ?',
      [id]
    )

    if (commandes.length === 0) {
      return res.status(404).json({ message: 'Commande non trouvée' })
    }

    const commande = commandes[0]

    // Vérifier que c'est bien sa commande
    if (commande.utilisateur_id !== utilisateur_id) {
      return res.status(403).json({ message: 'Accès refusé' })
    }

    // On ne peut modifier que si statut "en attente"
    if (commande.statut !== 'en attente') {
      return res.status(400).json({ 
        message: 'Cette commande ne peut plus être modifiée' 
      })
    }

    await pool.query(
      `UPDATE commande SET 
       date_prestation = ?, heure_livraison = ?, 
       adresse_livraison = ?, ville_livraison = ?, nb_personnes = ?
       WHERE commande_id = ?`,
      [date_prestation, heure_livraison, adresse_livraison, ville_livraison, nb_personnes, id]
    )

    res.json({ message: 'Commande modifiée avec succès' })

  } catch (error) {
    console.error('Erreur modifierCommande :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── GET TOUTES LES COMMANDES (employé/admin) ─────────
const getAllCommandes = async (req, res) => {
  try {
    const { statut, utilisateur_id } = req.query

    let query = `
      SELECT c.*, m.titre as menu_titre, 
             u.nom, u.prenom, u.email, u.telephone
      FROM commande c
      JOIN menu m ON c.menu_id = m.menu_id
      JOIN utilisateur u ON c.utilisateur_id = u.utilisateur_id
      WHERE 1=1
    `
    const params = []

    if (statut) {
      query += ' AND c.statut = ?'
      params.push(statut)
    }

    if (utilisateur_id) {
      query += ' AND c.utilisateur_id = ?'
      params.push(utilisateur_id)
    }

    query += ' ORDER BY c.created_at DESC'

    const [commandes] = await pool.query(query, params)

    res.json(commandes)

  } catch (error) {
    console.error('Erreur getAllCommandes :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── METTRE À JOUR STATUT (employé/admin) ─────────────
const updateStatut = async (req, res) => {
  try {
    const { id } = req.params
    const { statut, motif } = req.body
    const employe_id = req.user.id

    const statutsValides = [
      'en attente', 'accepté', 'en préparation', 
      'en cours de livraison', 'livré', 
      'en attente du retour de matériel', 'terminée', 'annulée'
    ]

    if (!statutsValides.includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' })
    }

    // Mettre à jour le statut
    await pool.query(
      'UPDATE commande SET statut = ? WHERE commande_id = ?',
      [statut, id]
    )

    // Enregistrer dans l'historique
    await pool.query(
      `INSERT INTO historique_statut (commande_id, employe_id, statut, motif)
       VALUES (?, ?, ?, ?)`,
      [id, employe_id, statut, motif || null]
    )

    // Email si statut "terminée"
    if (statut === 'terminée') {
      const [commandes] = await pool.query(
        `SELECT c.*, u.email, u.prenom 
         FROM commande c
         JOIN utilisateur u ON c.utilisateur_id = u.utilisateur_id
         WHERE c.commande_id = ?`,
        [id]
      )

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: commandes[0].email,
          subject: 'Votre commande est terminée - Donnez votre avis !',
          html: `
            <h1>Votre commande est terminée !</h1>
            <p>Bonjour ${commandes[0].prenom},</p>
            <p>Votre commande a été livrée avec succès.</p>
            <p>Connectez-vous à votre espace pour laisser un avis !</p>
            <p><strong>L'équipe Vite & Gourmand</strong></p>
          `
        })
      } catch (emailError) {
        console.error('Email terminée non envoyé :', emailError.message)
      }
    }

    // Email si statut "en attente du retour de matériel"
    if (statut === 'en attente du retour de matériel') {
      const [commandes] = await pool.query(
        `SELECT c.*, u.email, u.prenom 
         FROM commande c
         JOIN utilisateur u ON c.utilisateur_id = u.utilisateur_id
         WHERE c.commande_id = ?`,
        [id]
      )

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: commandes[0].email,
          subject: 'Retour de matériel requis - Vite & Gourmand',
          html: `
            <h1>Retour de matériel</h1>
            <p>Bonjour ${commandes[0].prenom},</p>
            <p>Du matériel vous a été prêté lors de votre prestation.</p>
            <p>Vous disposez de <strong>10 jours ouvrés</strong> pour le restituer.</p>
            <p>Sans restitution dans ce délai, des frais de <strong>600€</strong> 
               vous seront facturés (conformément aux CGV).</p>
            <p>Pour restituer le matériel, contactez-nous.</p>
            <p><strong>L'équipe Vite & Gourmand</strong></p>
          `
        })
      } catch (emailError) {
        console.error('Email matériel non envoyé :', emailError.message)
      }
    }

    res.json({ message: 'Statut mis à jour avec succès' })

  } catch (error) {
    console.error('Erreur updateStatut :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

module.exports = { 
  createCommande, getMesCommandes, getCommandeById,
  annulerCommande, modifierCommande, getAllCommandes, updateStatut
}