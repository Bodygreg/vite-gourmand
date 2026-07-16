const sendEmail = async ({ to, subject, html }) => {
  const response = await fetch(
    `https://sandbox.api.mailtrap.io/api/send/${process.env.MAILTRAP_INBOX_ID}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MAILTRAP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: { email: 'noreply@vitegourmand.fr', name: 'Vite & Gourmand' },
        to: [{ email: to }],
        subject,
        html
      })
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Mailtrap API error: ${error}`)
  }

  return response.json()
}

module.exports = sendEmail