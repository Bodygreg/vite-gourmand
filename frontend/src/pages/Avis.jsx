import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import api from '../utils/axios'
import './Avis.css'

const Avis = () => {
  const [avis, setAvis] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/avis')
      .then(res => {
        setAvis(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const moyenne = avis.length > 0
    ? (avis.reduce((acc, a) => acc + a.note, 0) / avis.length).toFixed(1)
    : 0

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="avis-page">
      <div className="avis-bandeau">
        <h1>Avis de nos clients</h1>
        {avis.length > 0 && (
          <div className="avis-moyenne">
            <span className="moyenne-note">{moyenne}</span>
            <div>
              <div className="etoiles-moyenne">
                {'★'.repeat(Math.round(moyenne))}
                {'☆'.repeat(5 - Math.round(moyenne))}
              </div>
              <span className="nb-avis">Basé sur {avis.length} avis</span>
            </div>
          </div>
        )}
      </div>

      <div className="container">
        {avis.length === 0 ? (
          <p className="no-avis">Aucun avis pour le moment.</p>
        ) : (
          <div className="avis-liste">
            {avis.map(a => (
              <div key={a.avis_id} className="avis-card-full">
                <div className="avis-card-header">
                  <div>
                    <span className="avis-auteur">
                      {a.prenom} {a.nom?.charAt(0)}.
                    </span>
                    <span className="avis-date">
                      {new Date(a.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="avis-etoiles-detail">
                    {[1,2,3,4,5].map(n => (
                      <Star
                        key={n}
                        size={18}
                        fill={n <= a.note ? 'var(--accent-ambre)' : 'none'}
                        color="var(--accent-ambre)"
                      />
                    ))}
                  </div>
                </div>
                <p className="avis-texte">"{a.description}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Avis