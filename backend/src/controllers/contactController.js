const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

// ── ENVOYER MESSAGE CONTACT ───────────────────────────
const sendContact = async (req, res) => {
  try {
    const { titre, description, email } = req.body

    if (!titre || !description || !email) {
      return res.status(400).json({ 
        message: 'Tous les champs sont obligatoires' 
      })
    }

    try {
      await transporter.sendMail({
        from: email,
        to: process.env.EMAIL_USER,
        subject: `Contact - ${titre}`,
        html: `
          <h2>${titre}</h2>
          <p><strong>De :</strong> ${email}</p>
          <p>${description}</p>
        `
      })
    } catch (emailError) {
      console.error('Email contact non envoyé :', emailError.message)
    }

    res.json({ message: 'Message envoyé avec succès !' })

  } catch (error) {
    console.error('Erreur sendContact :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

module.exports = { sendContact }