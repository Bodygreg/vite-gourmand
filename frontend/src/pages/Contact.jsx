import { useState } from 'react'
import { Mail, User, FileText } from 'lucide-react'
import api from '../utils/axios'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      await api.post('/contact', formData)
      setMessage('Votre message a bien été envoyé ! Nous vous répondrons rapidement.')
      setFormData({ titre: '', description: '', email: '' })
    } catch (err) {
      setError('Erreur lors de l\'envoi du message.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-grid">

          {/* Infos contact */}
          <div className="contact-infos">
            <h1>Contactez-nous</h1>
            <p>Une question sur nos menus ? Un événement à organiser ? N'hésitez pas à nous contacter !</p>

            <div className="contact-detail">
              <Mail size={20} color="var(--accent-ambre)" />
              <span>contact@vitegourmand.fr</span>
            </div>
            <div className="contact-detail">
              <User size={20} color="var(--accent-ambre)" />
              <span>05 07 05 07 05</span>
            </div>
            <div className="contact-detail">
              <FileText size={20} color="var(--accent-ambre)" />
              <span>12 rue de la Paix, 33000 Bordeaux</span>
            </div>
          </div>

          {/* Formulaire */}
          <div className="contact-form-wrapper">
            {message && (
              <div className="contact-success">{message}</div>
            )}
            {error && (
              <div className="auth-error">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Votre email</label>
                <div className="input-icon">
                  <Mail size={18} color="var(--texte-secondaire)" />
                  <input
                    type="email"
                    placeholder="votre@email.fr"
                    autoComplete="new-password"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Titre</label>
                <div className="input-icon">
                  <FileText size={18} color="var(--texte-secondaire)" />
                  <input
                    type="text"
                    placeholder="Sujet de votre message"
                    value={formData.titre}
                    onChange={e => setFormData({...formData, titre: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  placeholder="Décrivez votre demande..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={6}
                  required
                />
              </div>
              <p className="contact-obligatoire">Tous les champs sont obligatoires</p>
              <button
                type="submit"
                className="btn-primaire btn-full"
                disabled={loading}
              >
                {loading ? 'Envoi...' : 'Envoyer le message'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Contact