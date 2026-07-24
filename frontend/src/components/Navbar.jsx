import { Link, NavLink, useNavigate } from 'react-router-dom'
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
    setMenuOpen(false)
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
        <Link to="/" className="navbar-logo">
          Vite & Gourmand
        </Link>

          {/* Bonjour mobile — toujours visible sur mobile si connecté */}
        {isAuthenticated && (
          <span className="navbar-bonjour-mobile">
            Bonjour {user?.prenom} !
          </span>
        )}

        {/* Bouton burger — visible uniquement sur mobile */}
        <button
          className="navbar-burger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen 
            ? <span style={{ fontSize: '1.4rem' }}>✕</span>  /* ← croix plus petite */
            : '≡'
          }
        </button>

        {/* Menu — desktop : horizontal / mobile : dropdown */}
        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li>
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>
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

          {/* Connexion/Déconnexion — visible uniquement dans le burger mobile */}
          <li className="navbar-mobile-auth">
            {isAuthenticated ? (
              <>                
                <button className="btn-outline" onClick={handleLogout}>
                  Déconnexion
                </button>
              </>
            ) : (
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                <button className="btn-primaire">Connexion</button>
              </NavLink>
            )}
          </li>
        </ul>

        {/* Connexion/Déconnexion — visible uniquement sur desktop */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="navbar-user">
              <span>Bonjour {user?.prenom}</span>
              <button className="btn-outline" onClick={handleLogout}>
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