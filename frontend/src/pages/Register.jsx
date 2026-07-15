import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react'
import api from '../utils/axios'
import './Login.css'

const Register = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (formData.password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    try {
      await api.post('/auth/register', formData)
      navigate('/login', { 
        state: { message: 'Compte créé avec succès ! Connectez-vous.' } 
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du compte')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <h1>Créer un compte</h1>
        <p className="auth-subtitle">
          Rejoignez Vite & Gourmand et commandez vos menus !
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* Nom et Prénom */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Nom</label>
              <div className="input-icon">
                <User size={18} color="var(--texte-secondaire)" />
                <input
                  type="text"
                  placeholder="Dupont"
                  value={formData.nom}
                  onChange={e => setFormData({...formData, nom: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Prénom</label>
              <div className="input-icon">
                <User size={18} color="var(--texte-secondaire)" />
                <input
                  type="text"
                  placeholder="Marie"
                  value={formData.prenom}
                  onChange={e => setFormData({...formData, prenom: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <div className="input-icon">
              <Mail size={18} color="var(--texte-secondaire)" />
              <input
                type="email"
                placeholder="votre@email.fr"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="form-group">
            <label>Mot de passe</label>
            <div className="input-icon">
              <Lock size={18} color="var(--texte-secondaire)" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="10 car. min, maj, chiffre, spécial"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
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

          {/* Confirmer le mot de passe */}
          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <div className="input-icon">
              <Lock size={18} color="var(--texte-secondaire)" />
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Répétez votre mot de passe"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
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

          {/* Téléphone */}
          <div className="form-group">
            <label>Téléphone</label>
            <div className="input-icon">
              <Phone size={18} color="var(--texte-secondaire)" />
              <input
                type="tel"
                placeholder="0612345678"
                value={formData.telephone}
                onChange={e => setFormData({...formData, telephone: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Adresse */}
          <div className="form-group">
            <label>Adresse</label>
            <div className="input-icon">
              <MapPin size={18} color="var(--texte-secondaire)" />
              <input
                type="text"
                placeholder="12 rue de la Paix"
                value={formData.adresse}
                onChange={e => setFormData({...formData, adresse: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Ville et Code postal */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Ville</label>
              <div className="input-icon">
                <MapPin size={18} color="var(--texte-secondaire)" />
                <input
                  type="text"
                  placeholder="Bordeaux"
                  value={formData.ville}
                  onChange={e => setFormData({...formData, ville: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Code postal</label>
              <div className="input-icon">
                <MapPin size={18} color="var(--texte-secondaire)" />
                <input
                  type="text"
                  placeholder="33000"
                  value={formData.code_postal}
                  onChange={e => setFormData({...formData, code_postal: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <p style={{ 
            color: 'var(--texte-secondaire)', 
            fontSize: '0.8rem',
            marginBottom: '1.8rem',
            marginTop: '-0.8rem'
          }}>
            Tous les champs sont obligatoires
          </p>

          <button
            type="submit"
            className="btn-primaire btn-full"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="auth-switch">
          Déjà un compte ?{' '}
          <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}

export default Register