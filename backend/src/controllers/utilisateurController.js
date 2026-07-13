const pool = require('../config/database')
const bcrypt = require('bcryptjs')

// ── GET PROFIL ────────────────────────────────────────
const getProfil = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT utilisateur_id, nom, prenom, email, 
              telephone, adresse, ville, code_postal
       FROM utilisateur 
       WHERE utilisateur_id = ?`,
      [req.user.id]
    )

    if (users.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' })
    }

    res.json(users[0])

  } catch (error) {
    console.error('Erreur getProfil :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── MODIFIER PROFIL ───────────────────────────────────
const updateProfil = async (req, res) => {
  try {
    const { nom, prenom, telephone, adresse, ville, code_postal } = req.body

    await pool.query(
      `UPDATE utilisateur SET 
       nom = ?, prenom = ?, telephone = ?, 
       adresse = ?, ville = ?, code_postal = ?
       WHERE utilisateur_id = ?`,
      [nom, prenom, telephone, adresse, ville, code_postal, req.user.id]
    )

    res.json({ message: 'Profil mis à jour avec succès' })

  } catch (error) {
    console.error('Erreur updateProfil :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── MODIFIER MOT DE PASSE ─────────────────────────────
const updatePassword = async (req, res) => {
  try {
    const { ancien_password, nouveau_password } = req.body

    // Récupérer l'utilisateur
    const [users] = await pool.query(
      'SELECT * FROM utilisateur WHERE utilisateur_id = ?',
      [req.user.id]
    )

    // Vérifier l'ancien mot de passe
    const validPassword = await bcrypt.compare(ancien_password, users[0].password)
    if (!validPassword) {
      return res.status(400).json({ message: 'Ancien mot de passe incorrect' })
    }

    // Vérifier la complexité du nouveau mot de passe
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/
    if (!passwordRegex.test(nouveau_password)) {
      return res.status(400).json({ 
        message: 'Le mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial' 
      })
    }

    // Hasher et sauvegarder
    const hashedPassword = await bcrypt.hash(nouveau_password, 10)
    await pool.query(
      'UPDATE utilisateur SET password = ? WHERE utilisateur_id = ?',
      [hashedPassword, req.user.id]
    )

    res.json({ message: 'Mot de passe modifié avec succès' })

  } catch (error) {
    console.error('Erreur updatePassword :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

module.exports = { getProfil, updateProfil, updatePassword }