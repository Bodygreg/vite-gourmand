const pool = require('../config/database')
const Statistique = require('../models/Statistique')
const sendEmail = require('../utils/email')

// ── CALCUL PRIX LIVRAISON ─────────────────────────────
const calculPrixLivraison = (ville) => {
  const villeNormalisee = ville.toLowerCase().trim()
  if (villeNormalisee === 'bordeaux') {
    return 5.00
  }
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

    const [menus] = await pool.query(
      'SELECT * FROM menu WHERE menu_id = ? AND actif = true',
      [menu_id]
    )

    if (menus.length === 0) {
      return res.status(404).json({ message: 'Menu non trouvé' })
    }

    const menu = menus[0]

    if (menu.stock <= 0) {
      return res.status(400).json({ message: 'Ce menu n\'est plus disponible' })
    }

    if (nb_personnes < menu.nb_personnes_min) {
      return res.status(400).json({ 
        message: `Ce menu nécessite un minimum de ${menu.nb_personnes_min} personnes` 
      })
    }

    let prix_menu = menu.prix * nb_personnes

    if (nb_personnes >= menu.nb_personnes_min + 5) {
      prix_menu = prix_menu * 0.9
    }

    const prix_livraison = calculPrixLivraison(ville_livraison)

    const [result] = await pool.query(
      `INSERT INTO commande 
      (utilisateur_id, menu_id, date_prestation, heure_livraison, 
       adresse_livraison, ville_livraison, nb_personnes, prix_menu, prix_livraison)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [utilisateur_id, menu_id, date_prestation, heure_livraison,
       adresse_livraison, ville_livraison, nb_personnes, prix_menu, prix_livraison]
    )

    const commande_id = result.insertId

    await pool.query(
      'UPDATE menu SET stock = stock - 1 WHERE menu_id = ?',
      [menu_id]
    )

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

    const [users] = await pool.query(
      'SELECT * FROM utilisateur WHERE utilisateur_id = ?',
      [utilisateur_id]
    )

    try {
      await sendEmail({
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
          </ul>
          <h4>Détail du prix :</h4>
          <ul>
            <li><strong>Prix unitaire :</strong> ${menu.prix}€ / personne</li>
            <li><strong>Nombre de personnes :</strong> ${nb_personnes}</li>
            ${nb_personnes >= menu.nb_personnes_min + 5 ? `<li><strong>Réduction (10%) :</strong> -${(menu.prix * nb_personnes * 0.1).toFixed(2)}€</li>` : ''}
            <li><strong>Prix des menus :</strong> ${prix_menu.toFixed(2)}€</li>
            <li><strong>Frais de livraison :</strong> ${prix_livraison.toFixed(2)}€</li>
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

    if (role === 'utilisateur' && commandes[0].utilisateur_id !== utilisateur_id) {
      return res.status(403).json({ message: 'Accès refusé' })
    }

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

// ── ANNULER UNE COMMANDE ──────────────────────────────
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

    if (commande.utilisateur_id !== utilisateur_id) {
      return res.status(403).json({ message: 'Accès refusé' })
    }

    if (commande.statut !== 'en attente') {
      return res.status(400).json({ message: 'Cette commande ne peut plus être annulée' })
    }

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

// ── MODIFIER UNE COMMANDE ─────────────────────────────
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

    if (commande.utilisateur_id !== utilisateur_id) {
      return res.status(403).json({ message: 'Accès refusé' })
    }

    if (commande.statut !== 'en attente') {
      return res.status(400).json({ message: 'Cette commande ne peut plus être modifiée' })
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

// ── GET TOUTES LES COMMANDES (employé/admin) ──────────
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

// ── METTRE À JOUR STATUT ──────────────────────────────
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

    await pool.query(
      'UPDATE commande SET statut = ? WHERE commande_id = ?',
      [statut, id]
    )

    await pool.query(
      `INSERT INTO historique_statut (commande_id, employe_id, statut, motif)
       VALUES (?, ?, ?, ?)`,
      [id, employe_id, statut, motif || null]
    )

    if (statut === 'terminée') {
      const [commandes] = await pool.query(
        `SELECT c.*, u.email, u.prenom 
         FROM commande c
         JOIN utilisateur u ON c.utilisateur_id = u.utilisateur_id
         WHERE c.commande_id = ?`,
        [id]
      )
      try {
        await sendEmail({
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

    if (statut === 'en attente du retour de matériel') {
      const [commandes] = await pool.query(
        `SELECT c.*, u.email, u.prenom 
         FROM commande c
         JOIN utilisateur u ON c.utilisateur_id = u.utilisateur_id
         WHERE c.commande_id = ?`,
        [id]
      )
      try {
        await sendEmail({
          to: commandes[0].email,
          subject: 'Retour de matériel requis - Vite & Gourmand',
          html: `
            <h1>Retour de matériel</h1>
            <p>Bonjour ${commandes[0].prenom},</p>
            <p>Du matériel vous a été prêté lors de votre prestation.</p>
            <p>Vous disposez de <strong>10 jours ouvrés</strong> pour le restituer.</p>
            <p>Sans restitution dans ce délai, des frais de <strong>600€</strong> vous seront facturés.</p>
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