const pool = require('../config/database')

// ── GET TOUS LES MENUS (public) ───────────────────────
const getAllMenus = async (req, res) => {
  try {
    const { prix_max, prix_min, theme_id, regime_id, nb_personnes } = req.query

    let query = `
      SELECT m.*, t.libelle as theme, r.libelle as regime
      FROM menu m
      JOIN theme t ON m.theme_id = t.theme_id
      JOIN regime r ON m.regime_id = r.regime_id
      WHERE m.actif = true
    `
    const params = []

    // Filtres dynamiques
    if (prix_max) {
      query += ' AND m.prix <= ?'
      params.push(prix_max)
    }
    if (prix_min) {
      query += ' AND m.prix >= ?'
      params.push(prix_min)
    }
    if (theme_id) {
      query += ' AND m.theme_id = ?'
      params.push(theme_id)
    }
    if (regime_id) {
      query += ' AND m.regime_id = ?'
      params.push(regime_id)
    }
    if (nb_personnes) {
      query += ' AND m.nb_personnes_min <= ?'
      params.push(nb_personnes)
    }

    query += ' ORDER BY m.created_at DESC'

    const [menus] = await pool.query(query, params)

    res.json(menus)

  } catch (error) {
    console.error('Erreur getAllMenus :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── GET UN MENU PAR ID (public) ───────────────────────
const getMenuById = async (req, res) => {
  try {
    const { id } = req.params

    // Récupérer le menu
    const [menus] = await pool.query(
      `SELECT m.*, t.libelle as theme, r.libelle as regime
       FROM menu m
       JOIN theme t ON m.theme_id = t.theme_id
       JOIN regime r ON m.regime_id = r.regime_id
       WHERE m.menu_id = ? AND m.actif = true`,
      [id]
    )

    if (menus.length === 0) {
      return res.status(404).json({ message: 'Menu non trouvé' })
    }

    const menu = menus[0]

    // Récupérer les plats du menu avec leurs allergènes
    const [plats] = await pool.query(
      `SELECT p.*, GROUP_CONCAT(a.libelle) as allergenes
       FROM plat p
       JOIN menu_plat mp ON p.plat_id = mp.plat_id
       LEFT JOIN plat_allergene pa ON p.plat_id = pa.plat_id
       LEFT JOIN allergene a ON pa.allergene_id = a.allergene_id
       WHERE mp.menu_id = ?
       GROUP BY p.plat_id`,
      [id]
    )

    res.json({ ...menu, plats })

  } catch (error) {
    console.error('Erreur getMenuById :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── CRÉER UN MENU (employé/admin) ─────────────────────
const createMenu = async (req, res) => {
  try {
    const { 
      theme_id, regime_id, titre, description, 
      nb_personnes_min, prix, conditions, stock 
    } = req.body

    const [result] = await pool.query(
      `INSERT INTO menu 
      (theme_id, regime_id, titre, description, nb_personnes_min, prix, conditions, stock) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [theme_id, regime_id, titre, description, nb_personnes_min, prix, conditions, stock]
    )

    res.status(201).json({ 
      message: 'Menu créé avec succès',
      menu_id: result.insertId
    })

  } catch (error) {
    console.error('Erreur createMenu :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── MODIFIER UN MENU (employé/admin) ──────────────────
const updateMenu = async (req, res) => {
  try {
    const { id } = req.params
    const { 
      theme_id, regime_id, titre, description, 
      nb_personnes_min, prix, conditions, stock,
      delai_commande, image_url
    } = req.body

    await pool.query(
      `UPDATE menu SET 
      theme_id = ?, regime_id = ?, titre = ?, description = ?,
      nb_personnes_min = ?, prix = ?, conditions = ?, stock = ?,
      delai_commande = ?, image_url = ?
      WHERE menu_id = ?`,
      [theme_id, regime_id, titre, description, nb_personnes_min, 
       prix, conditions, stock, delai_commande, image_url || null, id]
    )

    res.json({ message: 'Menu modifié avec succès' })

  } catch (error) {
    console.error('Erreur updateMenu :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── SUPPRIMER UN MENU (employé/admin) ─────────────────
const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params

    // Suppression douce (on désactive plutôt que supprimer)
    await pool.query(
      'UPDATE menu SET actif = false WHERE menu_id = ?',
      [id]
    )

    res.json({ message: 'Menu supprimé avec succès' })

  } catch (error) {
    console.error('Erreur deleteMenu :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

module.exports = { getAllMenus, getMenuById, createMenu, updateMenu, deleteMenu }