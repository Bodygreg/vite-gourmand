import { useState, useEffect } from 'react'
import { Search, Filter, UtensilsCrossed} from 'lucide-react'
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
    delai_commande: 48,
    plats: [],
    image_url: ''
  })
  const [menuEdite, setMenuEdite] = useState(null)
  const [showMenuForm, setShowMenuForm] = useState(false)
  const [plats, setPlats] = useState([])
  const [allergenes, setAllergenes] = useState([])
  const [platForm, setPlatForm] = useState({ nom: '', type: 'entree', description: '', allergenes: [] })
  const [platEdite, setPlatEdite] = useState(null)
  const [showPlatForm, setShowPlatForm] = useState(false)
  const [horaires, setHoraires] = useState([])
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    chargerDonnees()
  }, [])

  const chargerDonnees = async () => {
    try {
      const [commandesRes, avisRes, menusRes, themesRes, regimesRes, platsRes, allergenesRes, horairesRes] = await Promise.all([
        api.get('/commandes'),
        api.get('/avis/tous'),
        api.get('/menus'),
        api.get('/themes'),
        api.get('/regimes'),
        api.get('/plats'),
        api.get('/allergenes'),
        api.get('/horaires')
      ])
      setCommandes(commandesRes.data)
      setAvis(avisRes.data)
      setMenus(menusRes.data)
      setThemes(themesRes.data)
      setRegimes(regimesRes.data)
      setPlats(platsRes.data)
      setAllergenes(allergenesRes.data)
      setHoraires(horairesRes.data)
      setLoading(false)
    } catch (err) {
      console.error('Erreur chargerDonnees:', err)
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
      let menu_id
      if (menuEdite) {
        await api.put(`/menus/${menuEdite.menu_id}`, menuForm)
        menu_id = menuEdite.menu_id
        // Supprimer tous les plats existants et réinsérer
        await Promise.all((menuForm.plats || []).map(plat_id =>
          api.post('/plats/menu', { menu_id, plat_id })
        ))
      } else {
        const res = await api.post('/menus', menuForm)
        menu_id = res.data.menu_id
        await Promise.all((menuForm.plats || []).map(plat_id =>
          api.post('/plats/menu', { menu_id, plat_id })
        ))
      }
      setShowMenuForm(false)
      setMenuEdite(null)
      setMenuForm({
        titre: '', description: '', theme_id: '', regime_id: '',
        nb_personnes_min: '', prix: '', conditions: '', stock: '', 
        delai_commande: 48, plats: []
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

  const handlePlatSubmit = async (e) => {
    e.preventDefault()
    try {
      if (platEdite) {
        await api.put(`/plats/${platEdite.plat_id}`, platForm)
      } else {
        await api.post('/plats', platForm)
      }
      setShowPlatForm(false)
      setPlatEdite(null)
      setPlatForm({ nom: '', type: 'entree', description: '', allergenes: [] })
      chargerDonnees()
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur')
    }
  }

  const handlePlatEdit = (plat) => {
    setPlatEdite(plat)
    setPlatForm({
      nom: plat.nom,
      type: plat.type,
      description: plat.description || '',
      allergenes: plat.allergenes ? plat.allergenes.split(',').map(a => {
        const found = allergenes.find(al => al.libelle === a.trim())
        return found ? found.allergene_id : null
      }).filter(Boolean) : []
    })
    setShowPlatForm(true)
  }

  const handlePlatDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return
    try {
      await api.delete(`/plats/${id}`)
      chargerDonnees()
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur')
    }
  }

  const handleAddPlatToMenu = async (menu_id, plat_id) => {
    try {
      await api.post('/plats/menu', { menu_id, plat_id })
      chargerDonnees()
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur')
    }
  }

  const handleRemovePlatFromMenu = async (menu_id, plat_id) => {
    try {
      await api.delete(`/plats/menu/${menu_id}/${plat_id}`)
      chargerDonnees()
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur')
    }
  }

  const handleHoraireUpdate = async (id, heure_ouverture, heure_fermeture) => {
    try {
      await api.put(`/horaires/${id}`, { heure_ouverture, heure_fermeture })
      chargerDonnees()
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setUploadingImage(true)
    const formData = new FormData()
    formData.append('image', file)
    
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMenuForm(prev => ({...prev, image_url: res.data.url}))
    } catch (err) {
      alert('Erreur upload image')
    } finally {
      setUploadingImage(false)
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
          <button
            className={`onglet ${onglet === 'plats' ? 'active' : ''}`}
            onClick={() => setOnglet('plats')}
          >
            <UtensilsCrossed size={18} />
            Plats
          </button>

          <button
            className={`onglet ${onglet === 'horaires' ? 'active' : ''}`}
            onClick={() => setOnglet('horaires')}
          >
            <Clock size={18} />
            Horaires
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

                  <div className="form-group">
                    <label>Image du menu</label>
                    {menuForm.image_url && (
                      <img 
                        src={menuForm.image_url} 
                        alt="aperçu" 
                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }}
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                    {uploadingImage && <p style={{ color: 'var(--accent-ambre)' }}>Upload en cours...</p>}
                  </div>

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
                    <div className="form-group">
                      <label>Plats du menu</label>
                      <div className="allergenes-checkboxes">
                        {plats.map(p => (
                          <label key={p.plat_id} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={menuForm.plats?.includes(p.plat_id) || false}
                              onChange={e => {
                                const current = menuForm.plats || []
                                if (e.target.checked) {
                                  setMenuForm({...menuForm, plats: [...current, p.plat_id]})
                                } else {
                                  setMenuForm({...menuForm, plats: current.filter(id => id !== p.plat_id)})
                                }
                              }}
                            />
                            {p.nom} ({p.type})
                          </label>
                        ))}
                      </div>
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

        {onglet === 'plats' && (
          <div className="gestion-menus">
            <div className="gestion-header">
              <h2>Gestion des plats</h2>
              <button className="btn-primaire" onClick={() => { setPlatEdite(null); setShowPlatForm(true) }}>
                + Nouveau plat
              </button>
            </div>

            <div className="menus-gestion-list">
              {plats.map(p => (
                <div key={p.plat_id} className="menu-gestion-item">
                  <div className="menu-gestion-info">
                    <h3>{p.nom}</h3>
                    <p>{p.type} {p.allergenes ? `— Allergènes : ${p.allergenes}` : ''}</p>
                  </div>
                  <div className="menu-gestion-actions">
                    <button className="btn-outline" onClick={() => handlePlatEdit(p)}>Modifier</button>
                    <button className="btn-danger" onClick={() => handlePlatDelete(p.plat_id)}>Supprimer</button>
                  </div>
                </div>
              ))}
            </div>

            {showPlatForm && (
              <div className="modal-overlay">
                <div className="modal">
                  <h2>{platEdite ? 'Modifier le plat' : 'Nouveau plat'}</h2>
                  <form onSubmit={handlePlatSubmit}>
                    <div className="form-group">
                      <label>Nom *</label>
                      <input type="text" value={platForm.nom} onChange={e => setPlatForm({...platForm, nom: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>Type *</label>
                      <select value={platForm.type} onChange={e => setPlatForm({...platForm, type: e.target.value})}>
                        <option value="entree">Entrée</option>
                        <option value="plat">Plat</option>
                        <option value="dessert">Dessert</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea value={platForm.description} onChange={e => setPlatForm({...platForm, description: e.target.value})} rows={2} />
                    </div>
                    <div className="form-group">
                      <label>Allergènes</label>
                      <div className="allergenes-checkboxes">
                        {allergenes.map(a => (
                          <label key={a.allergene_id} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={platForm.allergenes.includes(a.allergene_id)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setPlatForm({...platForm, allergenes: [...platForm.allergenes, a.allergene_id]})
                                } else {
                                  setPlatForm({...platForm, allergenes: platForm.allergenes.filter(id => id !== a.allergene_id)})
                                }
                              }}
                            />
                            {a.libelle}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="modal-actions">
                      <button type="submit" className="btn-primaire">{platEdite ? 'Modifier' : 'Créer'}</button>
                      <button type="button" className="btn-outline" onClick={() => setShowPlatForm(false)}>Annuler</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {onglet === 'horaires' && (
          <div className="gestion-menus">
            <h2>Gestion des horaires</h2>
            <div className="menus-gestion-list">
              {horaires.map(h => (
                <div key={h.horaire_id} className="menu-gestion-item">
                  <div className="menu-gestion-info">
                    <h3>{h.jour}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                      type="time"
                      defaultValue={h.heure_ouverture}
                      onChange={e => h.heure_ouverture = e.target.value}
                    />
                    <span style={{ color: 'var(--texte-sombre)' }}>→</span>
                    <input
                      type="time"
                      defaultValue={h.heure_fermeture}
                      onChange={e => h.heure_fermeture = e.target.value}
                    />
                    <button
                      className="btn-primaire"
                      onClick={() => handleHoraireUpdate(h.horaire_id, h.heure_ouverture, h.heure_fermeture)}
                    >
                      Sauvegarder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default EspaceEmploye