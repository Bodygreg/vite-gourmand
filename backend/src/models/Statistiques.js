const mongoose = require('mongoose')

const statistiqueSchema = new mongoose.Schema({
  menu_id: {
    type: Number,
    required: true
  },
  menu_titre: {
    type: String,
    required: true
  },
  commande_id: {
    type: Number,
    required: true
  },
  nb_personnes: {
    type: Number,
    required: true
  },
  prix_total: {
    type: Number,
    required: true
  },
  date_commande: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Statistique', statistiqueSchema)