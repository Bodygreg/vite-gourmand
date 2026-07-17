import { useState, useEffect } from 'react'
import { Search, Filter, UtensilsCrossed } from 'lucide-react'
import api from '../utils/axios'
import './EspaceEmploye.css'
import {Clock, Calendar, MapPin, Users, Banknote} from "lucide-react"

const EspaceEmploye = () => {
  const [commandes, setCommandes] = useState([])
  const [avis, setAvis] = useState([])
  const [onglet, setOnglet] = useState('commandes')
  const [loading, setLoading] = useState(true)
  const [filtreStatut, setFiltreStatut] = useState('')
  const [filtreClient, setFiltreClient] = useState('')
  const [commandeSelectionnee, setCommandeSelectionnee] = useState(null)
  const [nouveauStatut, setNouveauStatut] = useState('')
  const [motif, setMotif] = useState('')
  const [menus, setMenus] = useState([])
  const [themes, setThemes] = useState([])
  const [regimes, setRegimes] = useState([])
  const [menuForm, setMenuForm] = useState({
    titre: '',
    description: '',
    theme_id: '',
    regime_id: '',
    nb_personnes_min: '',
    prix: '',
    conditions: '',
    stock: '',
    delai_commande: 48
  })
const [menuEdite, setMenuEdite] = useState(null)
const [showMenuForm, setShowMenuForm] = useState(false)

  useEffect(() => {
    chargerDonnees()
  }, [])

  const chargerDonnees = async () => {
    try {
      const [commandesRes, avisRes, menusRes, themesRes, regimesRes] = await Promise.all([
        api.get('/commandes'),
        api.get('/avis/tous'),
        api.get('/menus'),
        api.get('/themes'),
        api.get('/regimes')
      ])
      setCommandes(commandesRes.data)
      setAvis(avisRes.data)
      setMenus(menusRes.data)
      setThemes(themesRes.data)
      setRegimes(regimesRes.data)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const commandesFiltrees = commandes.filter(c => {
    const matchStatut = filtreStatut ? c.statut === filtreStatut : true
    const matchClient = filtreClient
      ? `${c.nom} ${c.prenom} ${c.email}`.toLowerCase().includes(filtreClient.toLowerCase())
      : true
    return matchStatut && matchClient
  })

  const handleUpdateStatut = async (id) => {
    try {
      await api.put(`/commandes/${id}/statut`, {
        statut: nouveauStatut,
        motif
      })
      setCommandeSelectionnee(null)
      setNouveauStatut('')
      setMotif('')
      chargerDonnees()
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur')
    }
  }

  const handleUpdateAvis = async (id, statut) => {
    try {
      await api.put(`/avis/${id}/statut`, { statut })
      chargerDonnees()
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur')
    }
  }

  const handleMenuSubmit = async (e) => {
    e.preventDefault()
    try {
      if (menuEdite) {
        await api.put(`/menus/${menuEdite.menu_id}`, menuForm)
      } else {
        await api.post('/menus', menuForm)
      }
      setShowMenuForm(false)
      setMenuEdite(null)
      setMenuForm({
        titre: '', description: '', theme_id: '', regime_id: '',
        nb_personnes_min: '', prix: '', conditions: '', stock: '', delai_commande: 48
      })
      chargerDonnees()
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur')
    }
  }

  const handleMenuEdit = (menu) => {
    setMenuEdite(menu)
    setMenuForm({
      titre: menu.titre,
      description: menu.description,
      theme_id: menu.theme_id,
      regime_id: menu.regime_id,
      nb_personnes_min: menu.nb_personnes_min,
      prix: menu.prix,
      conditions: menu.conditions,
      stock: menu.stock,
      delai_commande: menu.delai_commande || 48
    })
    setShowMenuForm(true)
  }

  const handleMenuDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return
    try {
      await api.delete(`/menus/${id}`)
      chargerDonnees()
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
    }
    return colors[statut] || 'var(--texte-secondaire)'
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="espace-employe">
      <div className="container">
        <h1>Espace Employé</h1>

        {/* Onglets */}
        <div className="onglets">
          <button
            className={`onglet ${onglet === 'commandes' ? 'active' : ''}`}
            onClick={() => setOnglet('commandes')}
          >
            Commandes ({commandes.length})
          </button>
          <button
            className={`onglet ${onglet === 'avis' ? 'active' : ''}`}
            onClick={() => setOnglet('avis')}
          >
            Avis à valider ({avis.filter(a => a.statut === 'en attente').length})
          </button>
          <button
            className={`onglet ${onglet === 'menus' ? 'active' : ''}`}
            onClick={() => setOnglet('menus')}
          >
            <UtensilsCrossed size={18} />
            Menus
          </button>
        </div>

        {/* ── COMMANDES ──────────────────────────── */}
        {onglet === 'commandes' && (
          <div>
            {/* Filtres */}
            <div className="employe-filtres">
              <div className="filtre-search">
                <Search size={18} color="var(--texte-secondaire)" />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={filtreClient}
                  onChange={e => setFiltreClient(e.target.value)}
                />
              </div>
              <select
                value={filtreStatut}
                onChange={e => setFiltreStatut(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="en attente">En attente</option>
                <option value="accepté">Accepté</option>
                <option value="en préparation">En préparation</option>
                <option value="en cours de livraison">En cours de livraison</option>
                <option value="livré">Livré</option>
                <option value="en attente du retour de matériel">Retour matériel</option>
                <option value="terminée">Terminée</option>
                <option value="annulée">Annulée</option>
              </select>
            </div>

            {/* Liste commandes */}
            <div className="employe-commandes">
              {commandesFiltrees.map(c => (
                <div key={c.commande_id} className="employe-commande-item">
                  <div className="employe-commande-header">
                    <div>
                      <h3>{c.menu_titre}</h3>
                      <p>{c.nom} {c.prenom} — {c.email} — {c.telephone}</p>
                    </div>
                    <span style={{ color: getStatutColor(c.statut) }}>
                      {c.statut}
                    </span>
                  </div>
                  <div className="employe-commande-infos">
                    <span><Calendar size={18} color="var(--accent-ambre)" /> {new Date(c.date_prestation).toLocaleDateString('fr-FR')}</span>
                    <span><Clock size={18} color="var(--accent-ambre)" /> {c.heure_livraison}</span>
                    <span><MapPin size={18} color="var(--accent-ambre)" /> {c.adresse_livraison}, {c.ville_livraison}</span>
                    <span><Users size={18} color="var(--accent-ambre)" /> {c.nb_personnes} pers.</span>
                    <span><Banknote size={18} color="var(--accent-ambre)" /> {(parseFloat(c.prix_menu) + parseFloat(c.prix_livraison)).toFixed(2)}€</span>
                  </div>
                  <div className="employe-commande-actions">
                    <button
                      className="btn-outline"
                      onClick={() => {
                        setCommandeSelectionnee(c)
                        setNouveauStatut(c.statut)
                      }}
                    >
                      Modifier le statut
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal modification statut */}
            {commandeSelectionnee && (
              <div className="modal-overlay">
                <div className="modal">
                  <h2>Modifier le statut</h2>
                  <p>Commande : <strong>{commandeSelectionnee.menu_titre}</strong></p>
                  <p>Client : <strong>{commandeSelectionnee.nom} {commandeSelectionnee.prenom}</strong></p>

                  <div className="form-group">
                    <label>Nouveau statut</label>
                    <select
                      value={nouveauStatut}
                      onChange={e => setNouveauStatut(e.target.value)}
                    >
                      <option value="en attente">En attente</option>
                      <option value="accepté">Accepté</option>
                      <option value="en préparation">En préparation</option>
                      <option value="en cours de livraison">En cours de livraison</option>
                      <option value="livré">Livré</option>
                      <option value="en attente du retour de matériel">Retour matériel</option>
                      <option value="terminée">Terminée</option>
                      <option value="annulée">Annulée</option>
                    </select>
                  </div>

                  {nouveauStatut === 'annulée' && (
                    <div className="form-group">
                      <label>Motif d'annulation *</label>
                      <textarea
                        value={motif}
                        onChange={e => setMotif(e.target.value)}
                        placeholder="Expliquez le motif d'annulation..."
                        rows={3}
                      />
                    </div>
                  )}

                  <div className="modal-actions">
                    <button
                      className="btn-primaire"
                      onClick={() => handleUpdateStatut(commandeSelectionnee.commande_id)}
                      disabled={nouveauStatut === 'annulée' && !motif}
                    >
                      Confirmer
                    </button>
                    <button
                      className="btn-outline"
                      onClick={() => setCommandeSelectionnee(null)}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── AVIS ───────────────────────────────── */}
        {onglet === 'avis' && (
          <div className="avis-moderation">
            {avis.map(a => (
              <div key={a.avis_id} className="avis-item">
                <div className="avis-item-header">
                  <div>
                    <span className="avis-etoiles">
                      {'★'.repeat(a.note)}{'☆'.repeat(5 - a.note)}
                    </span>
                    <span className="avis-auteur">
                      {a.prenom} {a.nom}
                    </span>
                  </div>
                  <span className={`avis-statut ${a.statut}`}>
                    {a.statut}
                  </span>
                </div>
                <p className="avis-description">"{a.description}"</p>
                {a.statut === 'en attente' && (
                  <div className="avis-actions">
                    <button
                      className="btn-succes"
                      onClick={() => handleUpdateAvis(a.avis_id, 'validé')}
                    >
                      Valider
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleUpdateAvis(a.avis_id, 'refusé')}
                    >
                      Refuser
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── GESTION DES MENUS ───────────────────────────────── */}
        {onglet === 'menus' && (
          <div className="gestion-menus">
            <div className="gestion-header">
              <h2>Gestion des menus</h2>
              <button
                className="btn-primaire"
                onClick={() => {
                  setMenuEdite(null)
                  setMenuForm({
                    titre: '', description: '', theme_id: '', regime_id: '',
                    nb_personnes_min: '', prix: '', conditions: '', stock: '', delai_commande: 48
                  })
                  setShowMenuForm(true)
                }}
              >
                + Nouveau menu
              </button>
            </div>

            {/* Liste des menus */}
            <div className="menus-gestion-list">
              {menus.map(m => (
                <div key={m.menu_id} className="menu-gestion-item">
                  <div className="menu-gestion-info">
                    <h3>{m.titre}</h3>
                    <p>{m.theme} — {m.regime} — {m.prix}€ — Stock : {m.stock}</p>
                  </div>
                  <div className="menu-gestion-actions">
                    <button
                      className="btn-outline"
                      onClick={() => handleMenuEdit(m)}
                    >
                      Modifier
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleMenuDelete(m.menu_id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Formulaire création/modification */}
            {showMenuForm && (
              <div className="modal-overlay">
                <div className="modal" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
                  <h2>{menuEdite ? 'Modifier le menu' : 'Nouveau menu'}</h2>
                  <form onSubmit={handleMenuSubmit}>
                    <div className="form-group">
                      <label>Titre *</label>
                      <input
                        type="text"
                        value={menuForm.titre}
                        onChange={e => setMenuForm({...menuForm, titre: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={menuForm.description}
                        onChange={e => setMenuForm({...menuForm, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Thème *</label>
                        <select
                          value={menuForm.theme_id}
                          onChange={e => setMenuForm({...menuForm, theme_id: e.target.value})}
                          required
                        >
                          <option value="">Sélectionner</option>
                          {themes.map(t => (
                            <option key={t.theme_id} value={t.theme_id}>{t.libelle}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Régime *</label>
                        <select
                          value={menuForm.regime_id}
                          onChange={e => setMenuForm({...menuForm, regime_id: e.target.value})}
                          required
                        >
                          <option value="">Sélectionner</option>
                          {regimes.map(r => (
                            <option key={r.regime_id} value={r.regime_id}>{r.libelle}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Nb personnes min *</label>
                        <input
                          type="number"
                          value={menuForm.nb_personnes_min}
                          onChange={e => setMenuForm({...menuForm, nb_personnes_min: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Prix (€) *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={menuForm.prix}
                          onChange={e => setMenuForm({...menuForm, prix: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Stock *</label>
                        <input
                          type="number"
                          value={menuForm.stock}
                          onChange={e => setMenuForm({...menuForm, stock: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Délai commande (heures) *</label>
                      <input
                        type="number"
                        value={menuForm.delai_commande}
                        onChange={e => setMenuForm({...menuForm, delai_commande: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Conditions</label>
                      <textarea
                        value={menuForm.conditions}
                        onChange={e => setMenuForm({...menuForm, conditions: e.target.value})}
                        rows={2}
                      />
                    </div>
                    <div className="modal-actions">
                      <button type="submit" className="btn-primaire">
                        {menuEdite ? 'Modifier' : 'Créer'}
                      </button>
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={() => setShowMenuForm(false)}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default EspaceEmploye