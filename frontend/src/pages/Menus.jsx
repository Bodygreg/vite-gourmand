import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Tag, Filter } from 'lucide-react'
import api from '../utils/axios'
import './Menus.css'

const Menus = () => {
  const [menus, setMenus] = useState([])
  const [themes, setThemes] = useState([])
  const [regimes, setRegimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtresOuverts, setFiltresOuverts] = useState(false)

  const [filtres, setFiltres] = useState({
    prix_min: '',
    prix_max: '',
    theme_id: '',
    regime_id: '',
    nb_personnes: ''
  })

  // Chargement initial
  useEffect(() => {
    Promise.all([
      api.get('/menus'),
      api.get('/themes'),
      api.get('/regimes')
    ])
      .then(([menusRes, themesRes, regimesRes]) => {
        setMenus(menusRes.data)
        setThemes(themesRes.data)
        setRegimes(regimesRes.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  // Appliquer les filtres
  const appliquerFiltres = () => {
    const params = {}
    if (filtres.prix_min) params.prix_min = filtres.prix_min
    if (filtres.prix_max) params.prix_max = filtres.prix_max
    if (filtres.theme_id) params.theme_id = filtres.theme_id
    if (filtres.regime_id) params.regime_id = filtres.regime_id
    if (filtres.nb_personnes) params.nb_personnes = filtres.nb_personnes

    api.get('/menus', { params })
      .then(res => setMenus(res.data))
      .catch(err => console.error(err))
  }

  const reinitialiserFiltres = () => {
    setFiltres({
      prix_min: '', prix_max: '',
      theme_id: '', regime_id: '',
      nb_personnes: ''
    })
    api.get('/menus').then(res => setMenus(res.data))
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="menus-page">

      {/* ── BANDEAU ──────────────────────────────── */}
      <div className="menus-bandeau">
        <h1>Nos menus</h1>
      </div>

      {/* ── FILTRES ──────────────────────────────── */}
      <div className="filtres-container">
        <button 
          className="filtres-toggle"
          onClick={() => setFiltresOuverts(!filtresOuverts)}
        >
          <Filter size={18} />
          Filtres {filtresOuverts ? '▲' : '▼'}
        </button>

        {filtresOuverts && (
          <div className="filtres-panel">
            <div className="filtres-grid">
              <div className="filtre-group">
                <label>Prix min (€)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filtres.prix_min}
                  onChange={e => setFiltres({...filtres, prix_min: e.target.value})}
                />
              </div>
              <div className="filtre-group">
                <label>Prix max (€)</label>
                <input
                  type="number"
                  placeholder="500"
                  value={filtres.prix_max}
                  onChange={e => setFiltres({...filtres, prix_max: e.target.value})}
                />
              </div>
              <div className="filtre-group">
                <label>Thème</label>
                <select
                  value={filtres.theme_id}
                  onChange={e => setFiltres({...filtres, theme_id: e.target.value})}
                >
                  <option value="">Tous</option>
                  {themes.map(t => (
                    <option key={t.theme_id} value={t.theme_id}>
                      {t.libelle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filtre-group">
                <label>Régime</label>
                <select
                  value={filtres.regime_id}
                  onChange={e => setFiltres({...filtres, regime_id: e.target.value})}
                >
                  <option value="">Tous</option>
                  {regimes.map(r => (
                    <option key={r.regime_id} value={r.regime_id}>
                      {r.libelle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filtre-group">
                <label>Nb personnes min</label>
                <input
                  type="number"
                  placeholder="1"
                  value={filtres.nb_personnes}
                  onChange={e => setFiltres({...filtres, nb_personnes: e.target.value})}
                />
              </div>
            </div>
            <div className="filtres-actions">
              <button className="btn-primaire" onClick={appliquerFiltres}>
                Filtrer
              </button>
              <button className="btn-outline" onClick={reinitialiserFiltres}>
                Réinitialiser
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── GRILLE MENUS ─────────────────────────── */}
      <div className="menus-page-content">
        <div className="container">
          {menus.length === 0 ? (
            <p className="no-menus">Aucun menu ne correspond à vos critères.</p>
          ) : (
            <div className="menus-grid">
              {menus.map(menu => (
                <div key={menu.menu_id} className="menu-card">
                  <div className="menu-card-image">
                    <img
                      src={menu.image_url || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'}
                      alt={menu.titre}
                    />
                  </div>
                  <div className="menu-card-content">
                    <h3>{menu.titre}</h3>
                    <p>{menu.description}</p>
                    <div className="menu-card-infos">
                      <span>
                        <Users size={16} color="var(--accent-ambre)" />
                        Min. {menu.nb_personnes_min} pers.
                      </span>
                      <span>
                        <Tag size={16} color="var(--accent-ambre)" />
                        {menu.prix}€
                      </span>
                    </div>
                    <div className="menu-card-badges">
                      <span className="badge">{menu.theme}</span>
                      <span className="badge">{menu.regime}</span>
                    </div>
                    <Link to={`/menus/${menu.menu_id}`}>
                      <button className="btn-outline">Voir le détail</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default Menus