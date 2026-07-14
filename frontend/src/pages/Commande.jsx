import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/axios'
import './Commande.css'
import { AlertTriangle, Home, UtensilsCrossed, PartyPopper, Phone, Calendar, Check } from 'lucide-react'

const Commande = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const menuIdParam = searchParams.get('menu_id')

  const [etape, setEtape] = useState(1)
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  const [formData, setFormData] = useState({
    // Étape 1
    adresse_livraison: user?.adresse || '',
    ville_livraison: user?.ville || '',
    date_prestation: '',
    heure_livraison: '',
    // Étape 2
    menu_id: menuIdParam || '',
    nb_personnes: 1
  })

  useEffect(() => {
    api.get('/menus').then(res => setMenus(res.data))
  }, [])

  // Menu sélectionné
  const menuSelectionne = menus.find(m => m.menu_id === parseInt(formData.menu_id))

  // Calcul prix
  const calculPrix = () => {
    if (!menuSelectionne) return { prix_menu: 0, prix_livraison: 5, total: 5 }

    let prix_menu = menuSelectionne.prix
    if (formData.nb_personnes >= menuSelectionne.nb_personnes_min + 5) {
      prix_menu = prix_menu * 0.9
    }

    const prix_livraison = formData.ville_livraison.toLowerCase().trim() === 'bordeaux'
      ? 5
      : 5 + (20 * 0.59)

    return {
      prix_menu: prix_menu.toFixed(2),
      prix_livraison: prix_livraison.toFixed(2),
      total: (prix_menu + prix_livraison).toFixed(2),
      reduction: formData.nb_personnes >= menuSelectionne.nb_personnes_min + 5
    }
  }

  const prix = calculPrix()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/commandes', {
        ...formData,
        menu_id: parseInt(formData.menu_id),
        nb_personnes: parseInt(formData.nb_personnes)
      })
      setSuccess(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la commande')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="commande-page">
        <div className="commande-success">
          <h1><Check size={40}/> Commande confirmée !</h1>
          <p>Votre commande a bien été enregistrée.</p>
          <p>Un email de confirmation vous a été envoyé.</p>
          <div className="success-prix">
            <p>Prix menu : <strong>{success.prix_menu}€</strong></p>
            <p>Frais livraison : <strong>{success.prix_livraison}€</strong></p>
            <p className="total">Total : <strong>{success.total}€</strong></p>
          </div>
          <button className="btn-primaire" onClick={() => navigate('/mon-espace')}>
            Voir mes commandes
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="commande-page">
      <div className="container">
        <h1>Votre commande</h1>

        {/* ── STEPPER ──────────────────────────────── */}
        <div className="stepper">
          {['Infos de livraison', 'Choix du menu', 'Récapitulatif'].map((label, i) => (
            <>
              <div key={i} className={`step ${etape === i + 1 ? 'active' : ''} ${etape > i + 1 ? 'done' : ''}`}>
                <div className="step-circle">{etape > i + 1 ? '✓' : i + 1}</div>
                <span>{label}</span>
              </div>
              {i < 2 && <div className="step-line"></div>}
            </>
          ))}
        </div>

        {error && <div className="auth-error">{error}</div>}

        {/* ── ÉTAPE 1 ──────────────────────────────── */}
        {etape === 1 && (
          <div className="commande-form">
            <div className="form-grid-2">
              <div className="form-group">
                <label>Nom</label>
                <input type="text" value={user?.nom} disabled />
              </div>
              <div className="form-group">
                <label>Prénom</label>
                <input type="text" value={user?.prenom} disabled />
              </div>
            </div>
            <div className="form-group">
              <label>Adresse de livraison</label>
              <input
                type="text"
                placeholder="12 rue de la Paix"
                value={formData.adresse_livraison}
                onChange={e => setFormData({...formData, adresse_livraison: e.target.value})}
                required
              />
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Ville</label>
                <input
                  type="text"
                  placeholder="Bordeaux"
                  value={formData.ville_livraison}
                  onChange={e => setFormData({...formData, ville_livraison: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date de prestation</label>
                <input
                  type="date"
                  value={formData.date_prestation}
                  onChange={e => setFormData({...formData, date_prestation: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Heure de livraison</label>
                <input
                  type="time"
                  value={formData.heure_livraison}
                  onChange={e => setFormData({...formData, heure_livraison: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input type="text" value={user?.telephone} disabled />
              </div>
            <p style={{ 
              color: 'var(--texte-secondaire)', 
              fontSize: '0.8rem',
              marginBottom: '1.8rem',
              marginTop: '-1.5rem'
            }}>
              Tous les champs sont obligatoires
            </p>           
            
            </div>
            <p className="frais-livraison">
              Frais de livraison : 5€ à Bordeaux + 0,59€/km hors Bordeaux
            </p>
            <div className="commande-nav">
              <div></div>
              <button
                className="btn-primaire"
                onClick={() => setEtape(2)}
                disabled={!formData.adresse_livraison || !formData.ville_livraison || !formData.date_prestation || !formData.heure_livraison}
              >
                Étape suivante →
              </button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 2 ──────────────────────────────── */}
        {etape === 2 && (
          <div className="commande-form">
            <div className="form-group">
              <label>Menu</label>
              <select
                value={formData.menu_id}
                onChange={e => setFormData({...formData, menu_id: e.target.value, nb_personnes: menus.find(m => m.menu_id === parseInt(e.target.value))?.nb_personnes_min || 1})}
              >
                <option value="">Sélectionnez un menu</option>
                {menus.map(m => (
                  <option key={m.menu_id} value={m.menu_id}>
                    {m.titre} — {m.prix}€
                  </option>
                ))}
              </select>
            </div>

            {menuSelectionne && (
              <p className="menu-minimum">
                <AlertTriangle size={18} color="var(--accent-ambre)" /> Minimum {menuSelectionne.nb_personnes_min} personnes pour ce menu
              </p>
            )}

            <div className="form-group">
              <label>Nombre de personnes</label>
              <div className="compteur">
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData, 
                    nb_personnes: Math.max(menuSelectionne?.nb_personnes_min || 1, formData.nb_personnes - 1)
                  })}
                >−</button>
                <input
                  type="number"
                  value={formData.nb_personnes}
                  min={menuSelectionne?.nb_personnes_min || 1}
                  onChange={e => {
                    const val = e.target.value
                    // Permet la saisie vide temporairement
                    if (val === '') {
                      setFormData({...formData, nb_personnes: ''})
                      return
                    }
                    const num = parseInt(val)
                    if (!isNaN(num)) {
                      setFormData({...formData, nb_personnes: num})
                    }
                  }}
                  onBlur={() => {
                    // Vérifie le minimum quand on quitte le champ
                    const min = menuSelectionne?.nb_personnes_min || 1
                    if (!formData.nb_personnes || formData.nb_personnes < min) {
                      setFormData({...formData, nb_personnes: min})
                    }
                  }}
                  className="compteur-input"
                />
                <button
                  type="button"
                  onClick={() => setFormData({...formData, nb_personnes: formData.nb_personnes + 1})}
                >+</button>
              </div>
            </div>

            {prix.reduction && (
              <div className="reduction-badge">
                <PartyPopper size={18} color="var(--accent-ambre)" /> Réduction 10% appliquée !
              </div>
            )}

            <div className="commande-nav">
              <button className="btn-outline" onClick={() => setEtape(1)}>
                ← Étape précédente
              </button>
              <button
                className="btn-primaire"
                onClick={() => setEtape(3)}
                disabled={!formData.menu_id}
              >
                Étape suivante →
              </button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 3 ──────────────────────────────── */}
        {etape === 3 && (
          <div className="commande-form">
            <div className="recap-grid">

              {/* Bloc commande */}
              <div className="recap-card">
                <h3><UtensilsCrossed size={18} color="var(--accent-ambre)" /> {menuSelectionne?.titre}</h3>
                <h3>{formData.nb_personnes} personnes</h3>
                <div className="recap-prix">
                  <div className="prix-ligne">
                    <span>Prix menu</span>
                    <span>{prix.prix_menu}€</span>
                  </div>
                  {prix.reduction && (
                    <div className="prix-ligne reduction">
                      <span>Réduction (10%)</span>
                      <span>- {(menuSelectionne.prix * 0.1).toFixed(2)}€</span>
                    </div>
                  )}
                  <div className="prix-ligne">
                    <span>Frais de livraison</span>
                    <span>{prix.prix_livraison}€</span>
                  </div>
                  <div className="prix-ligne total">
                    <span>Total</span>
                    <span>{prix.total}€</span>
                  </div>
                </div>
              </div>

              {/* Bloc livraison */}
              <div className="recap-card">
                <h3><Home size={18} color="var(--accent-ambre)" /> Livraison pour :</h3>
                <p>{user?.nom} {user?.prenom}</p>
                <p>{formData.adresse_livraison}</p>
                <p>{formData.ville_livraison}</p>
                <p><Calendar size={16} color="var(--accent-ambre)" /> Le {formData.date_prestation} à {formData.heure_livraison}</p>
                <p><Phone size={16} color="var(--accent-ambre)" /> {user?.telephone}</p>
              </div>
            </div>         

            {/* Conditions */}
            {menuSelectionne?.conditions && (
              <div className="detail-conditions">
                <span><AlertTriangle size={18} color="var(--accent-ambre)" /></span>
                <p><strong>Conditions :</strong> {menuSelectionne.conditions}</p>
              </div>
            )}

            <div className="commande-nav">
              <button className="btn-outline" onClick={() => setEtape(2)}>
                ← Étape précédente
              </button>
              <button
                className="btn-primaire"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Traitement...' : '✓ Confirmer la commande'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Commande