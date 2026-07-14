import { useState, useEffect } from 'react'
import { Users, TrendingUp, UserPlus } from 'lucide-react'
import api from '../utils/axios'
import './EspaceAdmin.css'

const EspaceAdmin = () => {
  const [onglet, setOnglet] = useState('stats')
  const [stats, setStats] = useState([])
  const [ca, setCa] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtreCA, setFiltreCA] = useState({
    menu_id: '',
    date_debut: '',
    date_fin: ''
  })
  const [menus, setMenus] = useState([])

  // Nouvel employé
  const [newEmploye, setNewEmploye] = useState({ email: '', password: '' })
  const [messageEmploye, setMessageEmploye] = useState('')

  const [employes, setEmployes] = useState([])

  useEffect(() => {
    chargerDonnees()
  }, [])

  const chargerDonnees = async () => {
    try {
      const [statsRes, caRes, menusRes, employesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/chiffre-affaires'),
        api.get('/menus'),
        api.get('/admin/employes')
      ])
      setStats(statsRes.data)
      setCa(caRes.data)
      setMenus(menusRes.data)
      setLoading(false)
      setEmployes(employesRes.data)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const handleFiltreCA = async () => {
    try {
      const params = {}
      if (filtreCA.menu_id) params.menu_id = filtreCA.menu_id
      if (filtreCA.date_debut) params.date_debut = filtreCA.date_debut
      if (filtreCA.date_fin) params.date_fin = filtreCA.date_fin
      const res = await api.get('/admin/chiffre-affaires', { params })
      setCa(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateEmploye = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/employes', newEmploye)
      setMessageEmploye('Compte employé créé avec succès !')
      setNewEmploye({ email: '', password: '' })
      setTimeout(() => setMessageEmploye(''), 3000)
    } catch (err) {
      setMessageEmploye(err.response?.data?.message || 'Erreur')
    }
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="espace-admin">
      <div className="container">
        <h1>Espace Administrateur</h1>

        {/* Onglets */}
        <div className="onglets">
          <button
            className={`onglet ${onglet === 'stats' ? 'active' : ''}`}
            onClick={() => setOnglet('stats')}
          >
            <TrendingUp size={18} />
            Statistiques
          </button>
          <button
            className={`onglet ${onglet === 'employes' ? 'active' : ''}`}
            onClick={() => setOnglet('employes')}
          >
            <Users size={18} />
            Employés
          </button>
        </div>

        {/* ── STATISTIQUES ───────────────────────── */}
        {onglet === 'stats' && (
          <div>
            {/* Cards résumé */}
            <div className="stats-cards">
              <div className="stat-card">
                <h3>Total commandes</h3>
                <p className="stat-number">
                  {stats.reduce((acc, s) => acc + s.nb_commandes, 0)}
                </p>
              </div>
              <div className="stat-card">
                <h3>Chiffre d'affaires total</h3>
                <p className="stat-number">
                  {ca.reduce((acc, s) => acc + s.chiffre_affaires, 0).toFixed(2)}€
                </p>
              </div>
              <div className="stat-card">
                <h3>Menus actifs</h3>
                <p className="stat-number">{menus.length}</p>
              </div>
            </div>

            {/* Filtres CA */}
            <div className="stats-section">
              <h2>Chiffre d'affaires filtré</h2>
              <div className="ca-filtres">
                <select
                  value={filtreCA.menu_id}
                  onChange={e => setFiltreCA({...filtreCA, menu_id: e.target.value})}
                >
                  <option value="">Tous les menus</option>
                  {menus.map(m => (
                    <option key={m.menu_id} value={m.menu_id}>
                      {m.titre}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={filtreCA.date_debut}
                  onChange={e => setFiltreCA({...filtreCA, date_debut: e.target.value})}
                  placeholder="Date début"
                />
                <input
                  type="date"
                  value={filtreCA.date_fin}
                  onChange={e => setFiltreCA({...filtreCA, date_fin: e.target.value})}
                  placeholder="Date fin"
                />
                <button className="btn-primaire" onClick={handleFiltreCA}>
                  Filtrer
                </button>
              </div>

              <div className="stats-table">
                <div className="stats-table-header">
                  <span>Menu</span>
                  <span>Nb commandes</span>
                  <span>CA généré</span>
                </div>
                {ca.map((s, i) => (
                  <div key={i} className="stats-table-row">
                    <span>{s._id.menu_titre}</span>
                    <span>{s.nb_commandes}</span>
                    <span>{s.chiffre_affaires.toFixed(2)}€</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── EMPLOYÉS ───────────────────────────── */}
        {onglet === 'employes' && (
          <div className="employes-section">
            <h2>Créer un compte employé</h2>

            {messageEmploye && (
              <div className="auth-error" style={{
                color: messageEmploye.includes('succès') ? 'var(--bouton-succes)' : 'var(--bouton-danger)',
                borderColor: messageEmploye.includes('succès') ? 'var(--bouton-succes)' : 'var(--bouton-danger)'
              }}>
                {messageEmploye}
              </div>
            )}

            <form onSubmit={handleCreateEmploye} className="employe-form">
              <div className="form-group">
                <label>Email de l'employé</label>
                <input
                  type="email"
                  placeholder="employe@vitegourmand.fr"
                  value={newEmploye.email}
                  onChange={e => setNewEmploye({...newEmploye, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mot de passe temporaire</label>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={newEmploye.password}
                  onChange={e => setNewEmploye({...newEmploye, password: e.target.value})}
                  required
                />              
              </div>              
              <button type="submit" className="btn-primaire">
                <UserPlus size={18} />
                Créer le compte
              </button>
            </form>
            {/* Liste employés existants */}
            <div className="employes-list">
              <h2>Comptes employés existants</h2>
              {employes.map(e => (
                <div key={e.utilisateur_id} className="employe-item">
                  <div className="employe-info">
                    <span className="employe-nom">{e.prenom} {e.nom}</span>
                    <span className="employe-email">{e.email}</span>
                    <span className={`employe-statut ${e.actif ? 'actif' : 'inactif'}`}>
                      {e.actif ? 'Actif' : 'Désactivé'}
                    </span>
                  </div>
                  <button
                    className={e.actif ? 'btn-danger' : 'btn-succes'}
                    onClick={async () => {
                      try {
                        await api.put(`/admin/employes/${e.utilisateur_id}/toggle`)
                        chargerDonnees()
                      } catch (err) {
                        alert(err.response?.data?.message || 'Erreur')
                      }
                    }}
                  >
                    {e.actif ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default EspaceAdmin