import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import './Navbar.css'

const Navbar = () => {
  const { isAuthenticated, user, logout, hasRole } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          Vite & Gourmand
        </Link>

        {/* Menu burger (mobile) */}
        <button 
          className="navbar-burger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '≡'}
        </button>

        {/* Liens navigation */}
        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Accueil
            </Link>
          </li>
          <li>
            <Link to="/menus" onClick={() => setMenuOpen(false)}>
              Nos menus
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </li>

          {/* Liens selon le rôle */}
          {isAuthenticated && (
            <li>
              <Link to="/mon-espace" onClick={() => setMenuOpen(false)}>
                Mon espace
              </Link>
            </li>
          )}

          {hasRole(['employe', 'administrateur']) && (
            <li>
              <Link to="/espace-employe" onClick={() => setMenuOpen(false)}>
                Espace employé
              </Link>
            </li>
          )}

          {hasRole(['administrateur']) && (
            <li>
              <Link to="/espace-admin" onClick={() => setMenuOpen(false)}>
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Bouton connexion/déconnexion */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="navbar-user">
              <span>Bonjour {user?.prenom}</span>
              <button 
                className="btn-outline"
                onClick={handleLogout}
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="btn-primaire">Connexion</button>
            </Link>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar