const pool = require('../config/database')

// ── CRÉER UN AVIS ─────────────────────────────────────
const createAvis = async (req, res) => {
  try {
    const { commande_id, note, description } = req.body
    const utilisateur_id = req.user.id

    // Vérifier que la commande appartient à l'utilisateur
    const [commandes] = await pool.query(
      'SELECT * FROM commande WHERE commande_id = ? AND utilisateur_id = ?',
      [commande_id, utilisateur_id]
    )

    if (commandes.length === 0) {
      return res.status(404).json({ message: 'Commande non trouvée' })
    }

    // Vérifier que la commande est terminée
    if (commandes[0].statut !== 'terminée') {
      return res.status(400).json({ 
        message: 'Vous ne pouvez laisser un avis que sur une commande terminée' 
      })
    }

    // Vérifier qu'un avis n'existe pas déjà
    const [existingAvis] = await pool.query(
      'SELECT * FROM avis WHERE commande_id = ?',
      [commande_id]
    )

    if (existingAvis.length > 0) {
      return res.status(400).json({ 
        message: 'Vous avez déjà laissé un avis pour cette commande' 
      })
    }

    // Vérifier que la note est entre 1 et 5
    if (note < 1 || note > 5) {
      return res.status(400).json({ 
        message: 'La note doit être entre 1 et 5' 
      })
    }

    await pool.query(
      `INSERT INTO avis (utilisateur_id, commande_id, note, description)
       VALUES (?, ?, ?, ?)`,
      [utilisateur_id, commande_id, note, description]
    )

    res.status(201).json({ message: 'Avis créé avec succès !' })

  } catch (error) {
    console.error('Erreur createAvis :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── GET AVIS VALIDÉS (public) ─────────────────────────
const getAvisValides = async (req, res) => {
  try {
    const [avis] = await pool.query(
      `SELECT a.*, u.nom, u.prenom
       FROM avis a
       JOIN utilisateur u ON a.utilisateur_id = u.utilisateur_id
       WHERE a.statut = 'validé'
       ORDER BY a.created_at DESC`
    )

    res.json(avis)

  } catch (error) {
    console.error('Erreur getAvisValides :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── GET TOUS LES AVIS (employé/admin) ─────────────────
const getAllAvis = async (req, res) => {
  try {
    const [avis] = await pool.query(
      `SELECT a.*, u.nom, u.prenom
       FROM avis a
       JOIN utilisateur u ON a.utilisateur_id = u.utilisateur_id
       ORDER BY a.created_at DESC`
    )

    res.json(avis)

  } catch (error) {
    console.error('Erreur getAllAvis :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── VALIDER / REFUSER UN AVIS (employé/admin) ─────────
const updateStatutAvis = async (req, res) => {
  try {
    const { id } = req.params
    const { statut } = req.body

    if (!['validé', 'refusé'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' })
    }

    await pool.query(
      'UPDATE avis SET statut = ? WHERE avis_id = ?',
      [statut, id]
    )

    res.json({ message: `Avis ${statut} avec succès` })

  } catch (error) {
    console.error('Erreur updateStatutAvis :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

module.exports = { createAvis, getAvisValides, getAllAvis, updateStatutAvis }