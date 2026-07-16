import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import api from '../utils/axios'
import './Login.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post('/auth/forgot-password', { email })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Email envoyé !</h1>
          <p className="auth-subtitle">
            Si cet email existe, un lien de réinitialisation vous a été envoyé.
            Vérifiez votre boîte mail.
          </p>
          <Link to="/login">
            <button className="btn-primaire btn-full">
              Retour à la connexion
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Mot de passe oublié</h1>
        <p className="auth-subtitle">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <div className="input-icon">
              <Mail size={18} color="var(--texte-secondaire)" />
              <input
                type="email"
                placeholder="votre@email.fr"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn-primaire btn-full"
            disabled={loading}
          >
            {loading ? 'Envoi...' : 'Envoyer le lien'}
          </button>
        </form>

        <p className="auth-switch">
          <Link to="/login">← Retour à la connexion</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword