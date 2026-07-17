const pool = require('../config/database')

const getAllPlats = async (req, res) => {
  try {
    const [plats] = await pool.query(
      `SELECT p.*, GROUP_CONCAT(a.libelle) as allergenes
       FROM plat p
       LEFT JOIN plat_allergene pa ON p.plat_id = pa.plat_id
       LEFT JOIN allergene a ON pa.allergene_id = a.allergene_id
       GROUP BY p.plat_id`
    )
    res.json(plats)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

const createPlat = async (req, res) => {
  try {
    const { nom, type, description, allergenes } = req.body
    const [result] = await pool.query(
      'INSERT INTO plat (nom, type, description) VALUES (?, ?, ?)',
      [nom, type, description]
    )
    const plat_id = result.insertId
    if (allergenes && allergenes.length > 0) {
      for (const allergene_id of allergenes) {
        await pool.query(
          'INSERT INTO plat_allergene (plat_id, allergene_id) VALUES (?, ?)',
          [plat_id, allergene_id]
        )
      }
    }
    res.status(201).json({ message: 'Plat créé avec succès', plat_id })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

const updatePlat = async (req, res) => {
  try {
    const { id } = req.params
    const { nom, type, description, allergenes } = req.body
    await pool.query(
      'UPDATE plat SET nom = ?, type = ?, description = ? WHERE plat_id = ?',
      [nom, type, description, id]
    )
    await pool.query('DELETE FROM plat_allergene WHERE plat_id = ?', [id])
    if (allergenes && allergenes.length > 0) {
      for (const allergene_id of allergenes) {
        await pool.query(
          'INSERT INTO plat_allergene (plat_id, allergene_id) VALUES (?, ?)',
          [id, allergene_id]
        )
      }
    }
    res.json({ message: 'Plat modifié avec succès' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

const deletePlat = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM plat_allergene WHERE plat_id = ?', [id])
    await pool.query('DELETE FROM menu_plat WHERE plat_id = ?', [id])
    await pool.query('DELETE FROM plat WHERE plat_id = ?', [id])
    res.json({ message: 'Plat supprimé avec succès' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

const getPlatsMenu = async (req, res) => {
  try {
    const { id } = req.params
    const [plats] = await pool.query(
      `SELECT p.* FROM plat p
       JOIN menu_plat mp ON p.plat_id = mp.plat_id
       WHERE mp.menu_id = ?`,
      [id]
    )
    res.json(plats)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

const addPlatToMenu = async (req, res) => {
  try {
    const { menu_id, plat_id } = req.body
    await pool.query(
      'INSERT IGNORE INTO menu_plat (menu_id, plat_id) VALUES (?, ?)',
      [menu_id, plat_id]
    )
    res.json({ message: 'Plat ajouté au menu' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

const removePlatFromMenu = async (req, res) => {
  try {
    const { menu_id, plat_id } = req.params
    await pool.query(
      'DELETE FROM menu_plat WHERE menu_id = ? AND plat_id = ?',
      [menu_id, plat_id]
    )
    res.json({ message: 'Plat retiré du menu' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

module.exports = { getAllPlats, createPlat, updatePlat, deletePlat, getPlatsMenu, addPlatToMenu, removePlatFromMenu }