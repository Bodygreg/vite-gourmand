const express = require('express')
const router = express.Router()
const { sendContact } = require('../controllers/contactController')

// Route publique
router.post('/', sendContact)

module.exports = router