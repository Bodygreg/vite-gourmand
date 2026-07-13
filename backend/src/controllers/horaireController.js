const pool = require('../config/database')

// ── GET HORAIRES (public) ─────────────────────────────
const getHoraires = async (req, res) => {
  try {
    const [horaires] = await pool.query(
      'SELECT * FROM horaire ORDER BY horaire_id'
    )
    res.json(horaires)
  } catch (error) {
    console.error('Erreur getHoraires :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── MODIFIER HORAIRES (employé/admin) ─────────────────
const updateHoraire = async (req, res) => {
  try {
    const { id } = req.params
    const { heure_ouverture, heure_fermeture } = req.body

    await pool.query(
      `UPDATE horaire SET 
       heure_ouverture = ?, heure_fermeture = ?
       WHERE horaire_id = ?`,
      [heure_ouverture, heure_fermeture, id]
    )

    res.json({ message: 'Horaire modifié avec succès' })

  } catch (error) {
    console.error('Erreur updateHoraire :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

module.exports = { getHoraires, updateHoraire }