const express = require('express')
const router = express.Router()
const pool = require('../config/database')

router.get('/', async (req, res) => {
  const [regimes] = await pool.query('SELECT * FROM regime')
  res.json(regimes)
})

module.exports = router