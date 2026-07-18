const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

const sendEmail = async ({ to, subject, html }) => {
  const { data, error } = await resend.emails.send({
    from: 'Vite & Gourmand <onboarding@resend.dev>',
    to,
    subject,
    html
  })

  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }

  return data
}

module.exports = sendEmail