import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect, useRef } from 'react'
import './Navbar.css'

const Navbar = () => {
  const { isAuthenticated, user, logout, hasRole } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  return (
    <nav className="navbar" ref={navRef}>
      <div className="navbar-container">

        {/* Logo */}
        <NavLink to="/" className="navbar-logo">
          Vite & Gourmand
        </NavLink>

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
            <NavLink to="/" onClick={() => setMenuOpen(false)}>
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink to="/menus" onClick={() => setMenuOpen(false)}>
              Nos menus
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </NavLink>
          </li>

          {/* Liens selon le rôle */}
          {isAuthenticated && (
            <li>
              <NavLink to="/mon-espace" onClick={() => setMenuOpen(false)}>
                Mon espace
              </NavLink>
            </li>
          )}

          {hasRole(['employe', 'administrateur']) && (
            <li>
              <NavLink to="/espace-employe" onClick={() => setMenuOpen(false)}>
                Espace employé
              </NavLink>
            </li>
          )}          
          {hasRole(['administrateur']) && (
            <li>
              <NavLink to="/espace-admin" onClick={() => setMenuOpen(false)}>
                Admin
              </NavLink>
            </li>
          )}
          <li className="navbar-auth-mobile">
            {isAuthenticated ? (
              <div>
                <p style={{ color: 'var(--texte-secondaire)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  Bonjour {user?.prenom} !
                </p>
                <button className="btn-danger" onClick={() => { handleLogout(); setMenuOpen(false) }}>
                  Déconnexion
                </button>
              </div>
            ) : (
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                <button className="btn-primaire">Connexion</button>
              </NavLink>
            )}
          </li>
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
            <NavLink to="/login">
              <button className="btn-primaire">Connexion</button>
            </NavLink>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar