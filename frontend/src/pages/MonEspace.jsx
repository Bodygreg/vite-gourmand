import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Package, User, Star } from 'lucide-react'
import api from '../utils/axios'
import './MonEspace.css'

const MonEspace = () => {
  const { user } = useAuth()
  const [onglet, setOnglet] = useState('commandes')
  const [commandes, setCommandes] = useState([])
  const [profil, setProfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/commandes/mes-commandes'),
      api.get('/utilisateurs/profil')
    ])
      .then(([commandesRes, profilRes]) => {
        setCommandes(commandesRes.data)
        setProfil(profilRes.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handleUpdateProfil = async (e) => {
    e.preventDefault()
    try {
      await api.put('/utilisateurs/profil', profil)
      setMessage('Profil mis à jour avec succès !')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Erreur lors de la mise à jour')
    }
  }

  const handleAnnuler = async (id) => {
    if (!window.confirm('Confirmer l\'annulation ?')) return
    try {
      await api.put(`/commandes/${id}/annuler`)
      setCommandes(commandes.map(c =>
        c.commande_id === id ? {...c, statut: 'annulée'} : c
      ))
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur')
    }
  }

  const getStatutColor = (statut) => {
    const colors = {
      'en attente': 'var(--texte-secondaire)',
      'accepté': 'var(--bouton-succes)',
      'en préparation': 'var(--accent-ambre)',
      'en cours de livraison': 'var(--accent-ambre)',
      'livré': 'var(--bouton-succes)',
      'terminée': 'var(--bouton-succes)',
      'annulée': 'var(--bouton-danger)',
      'en attente du retour de matériel': 'var(--bouton-danger)'
    }
    return colors[statut] || 'var(--texte-secondaire)'
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="mon-espace">
      <div className="container">
        <h1>Mon espace</h1>
        <p className="espace-subtitle">Bonjour {user?.prenom} !</p>

        {/* Onglets */}
        <div className="onglets">
          <button
            className={`onglet ${onglet === 'commandes' ? 'active' : ''}`}
            onClick={() => setOnglet('commandes')}
          >
            <Package size={18} />
            Mes commandes
          </button>
          <button
            className={`onglet ${onglet === 'profil' ? 'active' : ''}`}
            onClick={() => setOnglet('profil')}
          >
            <User size={18} />
            Mon profil
          </button>
        </div>

        {/* ── COMMANDES ──────────────────────────── */}
        {onglet === 'commandes' && (
          <div className="commandes-list">
            {commandes.length === 0 ? (
              <div className="empty-state">
                <Package size={48} color="var(--texte-secondaire)" />
                <p>Vous n'avez pas encore de commande</p>
                <a href="/menus" className="btn-primaire">
                  Découvrir nos menus
                </a>
              </div>
            ) : (
              commandes.map(c => (
                <div key={c.commande_id} className="commande-item">
                  <div className="commande-item-header">
                    <h3>{c.menu_titre}</h3>
                    <span
                      className="statut-badge"
                      style={{ color: getStatutColor(c.statut) }}
                    >
                      {c.statut}
                    </span>
                  </div>
                  <div className="commande-item-infos">
                    <span>📅 {new Date(c.date_prestation).toLocaleDateString('fr-FR')}</span>
                    <span>👥 {c.nb_personnes} personnes</span>
                    <span>💶 {(parseFloat(c.prix_menu) + parseFloat(c.prix_livraison)).toFixed(2)}€</span>
                  </div>
                  {c.statut === 'en attente' && (
                    <div className="commande-item-actions">
                      <button
                        className="btn-danger"
                        onClick={() => handleAnnuler(c.commande_id)}
                      >
                        Annuler
                      </button>
                    </div>
                  )}
                  {c.statut === 'terminée' && (
                    <div className="commande-item-actions">
                      <button
                        className="btn-outline"
                        onClick={() => setOnglet(`avis-${c.commande_id}`)}
                      >
                        <Star size={16} />
                        Laisser un avis
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ── PROFIL ─────────────────────────────── */}
        {onglet === 'profil' && profil && (
          <div className="profil-form">
            {message && (
              <div className="auth-error" style={{ 
                color: message.includes('succès') ? 'var(--bouton-succes)' : 'var(--bouton-danger)',
                borderColor: message.includes('succès') ? 'var(--bouton-succes)' : 'var(--bouton-danger)'
              }}>
                {message}
              </div>
            )}
            <form onSubmit={handleUpdateProfil}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    value={profil.nom}
                    onChange={e => setProfil({...profil, nom: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Prénom</label>
                  <input
                    type="text"
                    value={profil.prenom}
                    onChange={e => setProfil({...profil, prenom: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={profil.email} disabled />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  value={profil.telephone || ''}
                  onChange={e => setProfil({...profil, telephone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Adresse</label>
                <input
                  type="text"
                  value={profil.adresse || ''}
                  onChange={e => setProfil({...profil, adresse: e.target.value})}
                />
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Ville</label>
                  <input
                    type="text"
                    value={profil.ville || ''}
                    onChange={e => setProfil({...profil, ville: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Code postal</label>
                  <input
                    type="text"
                    value={profil.code_postal || ''}
                    onChange={e => setProfil({...profil, code_postal: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primaire">
                Sauvegarder
              </button>
            </form>
          </div>
        )}

        {/* ── AVIS ───────────────────────────────── */}
        {onglet.startsWith('avis-') && (
          <AvisForm
            commandeId={parseInt(onglet.split('-')[1])}
            onSuccess={() => setOnglet('commandes')}
          />
        )}

      </div>
    </div>
  )
}

// Composant formulaire avis
const AvisForm = ({ commandeId, onSuccess }) => {
  const [note, setNote] = useState(5)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/avis', { commande_id: commandeId, note, description })
      onSuccess()
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profil-form">
      <h2>Laisser un avis</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Note (1 à 5)</label>
          <div className="etoiles-selector">
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setNote(n)}
                style={{ 
                  color: n <= note ? 'var(--accent-ambre)' : 'var(--texte-secondaire)',
                  fontSize: '2rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >★</button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Commentaire</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            placeholder="Partagez votre expérience..."
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn-primaire" disabled={loading}>
            {loading ? 'Envoi...' : 'Envoyer mon avis'}
          </button>
          <button type="button" className="btn-outline" onClick={onSuccess}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

export default MonEspace