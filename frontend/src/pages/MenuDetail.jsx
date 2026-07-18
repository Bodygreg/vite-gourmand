import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, Tag, AlertTriangle, ShoppingCart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/axios'
import './MenuDetail.css'

const MenuDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [menu, setMenu] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/menus/${id}`)
      .then(res => {
        setMenu(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  const handleCommander = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirect: `/commande?menu_id=${id}` } })
    } else {
      navigate(`/commande?menu_id=${id}`)
    }
  }

  if (loading) return <div className="loading">Chargement...</div>
  if (!menu) return <div className="loading">Menu non trouvé</div>

  // Séparer les plats par type
  const entrees = menu.plats?.filter(p => p.type === 'entree') || []
  const plats = menu.plats?.filter(p => p.type === 'plat') || []
  const desserts = menu.plats?.filter(p => p.type === 'dessert') || []

  return (
    <div className="menu-detail">

      {/* ── HERO IMAGE ───────────────────────────── */}
      <div className="detail-hero">
        <img
          src={menu.image_url || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'}
          alt={menu.titre}
        />
        <div className="detail-hero-overlay">
          <div className="detail-badges">
            <span className="badge-detail">
              <span className="badge-label">Thème</span>
              <span className="badge-value">{menu.theme}</span>
            </span>
            <h1>{menu.titre}</h1>
            <span className="badge-detail">
              <span className="badge-label">Régime</span>
              <span className="badge-value">{menu.regime}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── CONTENU ──────────────────────────────── */}
      <div className="detail-content">
        <div className="container">
          <div className="detail-grid">

            {/* Colonne gauche */}
            <div className="detail-left">

              <section className="detail-section">
                <h2>Description</h2>
                <p>{menu.description}</p>
              </section>

              <section className="detail-section">
                <h2>Les plats</h2>
                {entrees.length > 0 && (
                  <div className="plats-groupe">
                    <h3>Entrées</h3>
                    {entrees.map(p => (
                      <div key={p.plat_id} className="plat-item">
                        <span>{p.nom}</span>
                        {p.allergenes && (
                          <span className="allergenes">
                            <AlertTriangle size={14} color="var(--accent-ambre)" />
                            <span> </span>
                            {p.allergenes}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {plats.length > 0 && (
                  <div className="plats-groupe">
                    <h3>Plats</h3>
                    {plats.map(p => (
                      <div key={p.plat_id} className="plat-item">
                        <span>{p.nom}</span>
                        {p.allergenes && (
                          <span className="allergenes">
                            <AlertTriangle size={14} color="var(--accent-ambre)" />
                            <span> </span>
                            {p.allergenes}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {desserts.length > 0 && (
                  <div className="plats-groupe">
                    <h3>Desserts</h3>
                    {desserts.map(p => (
                      <div key={p.plat_id} className="plat-item">
                        <span>{p.nom}</span>
                        {p.allergenes && (
                          <span className="allergenes">
                            <AlertTriangle size={14} color="var(--accent-ambre)" />
                            <span> </span>
                            {p.allergenes}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>

            {/* Colonne droite */}
            <div className="detail-right">

              <div className="detail-infos-card">
                <div className="detail-info-item">
                  <Tag size={20} color="var(--accent-ambre)" />
                  <span>À partir de <strong>{menu.prix}€</strong></span>
                </div>
                <div className="detail-info-item">
                  <Users size={20} color="var(--accent-ambre)" />
                  <span>Minimum <strong>{menu.nb_personnes_min} personnes</strong></span>
                </div>
                <div className="detail-info-item stock">
                  <span>Stock disponible : <strong>{menu.stock}</strong></span>
                </div>

                {/* Conditions */}
                <div className="detail-conditions">
                  <AlertTriangle size={18} color="var(--accent-ambre)" />
                  <p>{menu.conditions}</p>
                </div>

                {/* Bouton commander */}
                <button
                  className="btn-primaire btn-commander"
                  onClick={handleCommander}
                  disabled={menu.stock <= 0}
                >
                  <ShoppingCart size={18} />
                  {menu.stock <= 0 ? 'Indisponible' : 'Commander ce menu'}
                </button>

                {!isAuthenticated && (
                  <p className="detail-login-hint">
                    Vous devez être connecté pour commander
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default MenuDetail