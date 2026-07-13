const express = require('express')
const router = express.Router()
const pool = require('../config/database')

router.get('/', async (req, res) => {
  const [themes] = await pool.query('SELECT * FROM theme')
  res.json(themes)
})

module.exports = router