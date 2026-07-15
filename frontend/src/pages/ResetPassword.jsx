import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Lock, Check, Eye, EyeOff } from 'lucide-react'
import api from '../utils/axios'
import './Login.css'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réinitialisation')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1><Check size={40}/> Mot de passe modifié !</h1>
          <p style={{ color: 'var(--texte-secondaire)', textAlign: 'center' }}>
            Redirection vers la page de connexion...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Nouveau mot de passe</h1>
        <p className="auth-subtitle">
          Choisissez un nouveau mot de passe sécurisé.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nouveau mot de passe</label>
            <div className="input-icon">
                <Lock size={18} color="var(--texte-secondaire)" />
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="10 car. min, maj, chiffre, spécial"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword
                    ? <EyeOff size={18} color="var(--texte-secondaire)" />
                    : <Eye size={18} color="var(--texte-secondaire)" />
                    }
                </button>
            </div>
          </div>
          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <div className="input-icon">
                <Lock size={18} color="var(--texte-secondaire)" />
                <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Répétez le mot de passe"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirm(!showConfirm)}
                >
                    {showConfirm
                    ? <EyeOff size={18} color="var(--texte-secondaire)" />
                    : <Eye size={18} color="var(--texte-secondaire)" />
                    }
                </button>
            </div>
          </div>
          <button
            type="submit"
            className="btn-primaire btn-full"
            disabled={loading}
          >
            {loading ? 'Modification...' : 'Modifier le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword