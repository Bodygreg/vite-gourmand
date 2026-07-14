import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
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

  useEffect(() => {
    chargerDonnees()
  }, [])

  const chargerDonnees = async () => {
    try {
      const [commandesRes, avisRes] = await Promise.all([
        api.get('/commandes'),
        api.get('/avis/tous')
      ])
      setCommandes(commandesRes.data)
      setAvis(avisRes.data)
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

      </div>
    </div>
  )
}

export default EspaceEmploye