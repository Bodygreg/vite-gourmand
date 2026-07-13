import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../utils/axios'
import './Footer.css'
import { MapPin, Phone, Mail } from 'lucide-react'

const Footer = () => {
  const [horaires, setHoraires] = useState([])

  useEffect(() => {
    api.get('/horaires')
      .then(res => setHoraires(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <footer className="footer">
      <div className="footer-line"></div>
      <div className="footer-container">

        {/* Horaires */}
        <div className="footer-col">
          <h4>Horaires</h4>
          {horaires.map(h => (
            <p key={h.horaire_id}>
              {h.jour} : {h.heure_ouverture} - {h.heure_fermeture}
            </p>
          ))}
        </div>

        {/* Liens utiles */}
        <div className="footer-col">
          <h4>Liens utiles</h4>
          <p><Link to="/mentions-legales">Mentions légales</Link></p>
          <p><Link to="/cgv">CGV</Link></p>
          <p><Link to="/confidentialite">Politique de confidentialité</Link></p>
        </div>

        {/* Contact */}
          <div className="footer-col">
            <h4>Contact</h4>
            <p>
              <MapPin size={16} color="var(--accent-ambre)" />
              12 rue de la Paix, 33000 Bordeaux
            </p>
            <p>
              <Phone size={16} color="var(--accent-ambre)" />
              05 07 05 07 05
            </p>
            <p>
              <Mail size={16} color="var(--accent-ambre)" />
              contact@vitegourmand.fr
            </p>
          </div>

      </div>
      <div className="footer-bottom">
        <p>© 2026 Vite & Gourmand — Tous droits réservés</p>
      </div>
    </footer>
  )
}

export default Footer