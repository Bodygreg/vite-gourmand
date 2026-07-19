import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/axios'
import './Accueil.css'
import { Trophy, Truck, Heart, Star, ChefHat, Leaf } from 'lucide-react'

const Accueil = () => {
  const [avis, setAvis] = useState([])

  useEffect(() => {
    api.get('/avis')
      .then(res => setAvis(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="accueil">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Vite & Gourmand</h1>
          <h2>Des saveurs authentiques livrées chez vous</h2>
          <p>Traiteur à Bordeaux depuis 25 ans</p>
          <Link to="/menus">
            <button className="btn-primaire">Découvrir nos menus</button>
          </Link>
        </div>
      </section>

      {/* ── QUI SOMMES NOUS ──────────────────────── */}
      <section className="qui-sommes-nous">
        <div className="container">
          <div className="qsn-grid">
            <div className="qsn-image">
              <img 
                src="https://res.cloudinary.com/kofjf7cu/image/upload/v1784456317/premium_photo-1663089236650-3efc51597de5_m4u8os.avif" 
                alt="Notre équipe en cuisine"
              />
            </div>
            <div className="qsn-content">
              <h2>Qui sommes nous ?</h2>
              <p>
                Vite & Gourmand est une entreprise constituée de deux personnes, 
                Julie et José. Elle existe depuis 25 ans à Bordeaux, et propose 
                ses prestations pour tout événement au travers d'un menu en 
                constante évolution.
              </p>
              <div className="qsn-atouts">
                <span>
                  <Trophy size={18} color="var(--accent-ambre)" />
                  Qualité
                </span>
                <span>
                  <Truck size={18} color="var(--accent-ambre)" />
                  Livraison
                </span>
                <span>
                  <Heart size={18} color="var(--accent-ambre)" />
                  Passion
                </span>
</div>
              <Link to="/contact">
                <button className="btn-outline">En savoir plus</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOS ATOUTS ───────────────────────────── */}
      <section className="nos-atouts">
        <div className="container">
          <div className="atouts-grid">
            <div className="atouts-content">
              <h2>Vite & Gourmand, c'est</h2>
              <ul>
                <li>
                  <Star size={18} color="var(--accent-ambre)" />
                  25 ans d'expérience
                </li>
                <li>
                  <Leaf size={18} color="var(--accent-ambre)" />
                  Des produits frais
                </li>
                <li>
                  <ChefHat size={18} color="var(--accent-ambre)" />
                  100% fait maison
                </li>
                <li>
                  <Star size={18} color="var(--accent-ambre)" />
                  Une moyenne de 4,8/5 d'avis clients
                </li>
              </ul>
            </div>
            <div className="atouts-image">
              <img 
                src="https://images.unsplash.com/photo-1555244162-803834f70033?w=600" 
                alt="Nos plats"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── AVIS CLIENTS ─────────────────────────── */}
      <section className="avis-section">
        <div className="container">
          <h2>Ce que nos clients disent</h2>
          <div className="avis-grid">
            {avis.length > 0 ? (
              avis.slice(0, 3).map(a => (
                <div key={a.avis_id} className="avis-card">
                  <div className="avis-etoiles">
                    {'★'.repeat(a.note)}{'☆'.repeat(5 - a.note)}
                  </div>
                  <p>"{a.description}"</p>
                  <span>— {a.prenom} {a.nom?.charAt(0)}.</span>
                </div>
              ))
            ) : (
              <p className="no-avis">Aucun avis pour le moment.</p>
            )}
          </div>
          <Link to="/menus">
            <button className="btn-outline">Voir plus d'avis</button>
          </Link>
        </div>
      </section>

    </div>
  )
}

export default Accueil