import './PageLegale.css'

const MentionsLegales = () => {
  return (
    <div className="page-legale">
      <div className="container">
        <h1>Mentions légales</h1>

        <section>
          <h2>Éditeur du site</h2>
          <p><strong>Raison sociale :</strong> Vite & Gourmand SARL</p>
          <p><strong>Capital social :</strong> 10 000 €</p>
          <p><strong>SIRET :</strong> 123 456 789 00012</p>
          <p><strong>APE/NAF :</strong> 5621Z (Traiteurs)</p>
          <p><strong>Siège social :</strong> 12 rue de la Paix, 33000 Bordeaux</p>
          <p><strong>Téléphone :</strong> 05 07 05 07 05</p>
          <p><strong>Email :</strong> contact@vitegourmand.fr</p>
          <p><strong>Directeur de la publication :</strong> José Martin</p>
        </section>

        <section>
          <h2>Hébergement</h2>
          <p><strong>Frontend :</strong> Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis — vercel.com</p>
          <p><strong>Backend :</strong> Railway Corp., San Francisco, CA, États-Unis — railway.app</p>
          <p><strong>Base de données :</strong> MongoDB Atlas, MongoDB Inc., New York, États-Unis — mongodb.com</p>
        </section>

        <section>
          <h2>Propriété intellectuelle</h2>
          <p>L'ensemble du contenu de ce site (textes, images, logos, graphismes) est la propriété exclusive de Vite & Gourmand SARL et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.</p>
          <p>Toute reproduction, représentation, modification ou exploitation non autorisée de tout ou partie du site est strictement interdite.</p>
        </section>

        <section>
          <h2>Données personnelles</h2>
          <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.</p>
          <p>Pour exercer ces droits, contactez-nous à : <strong>contact@vitegourmand.fr</strong></p>
          <p>Pour plus d'informations, consultez notre <a href="/confidentialite">Politique de confidentialité</a>.</p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>Ce site n'utilise pas de cookies de tracking ou publicitaires. Seuls des cookies techniques nécessaires au fonctionnement de l'application (authentification) sont utilisés.</p>
        </section>

        <section>
          <h2>Responsabilité</h2>
          <p>Vite & Gourmand SARL s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, elle ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.</p>
        </section>
      </div>
    </div>
  )
}

export default MentionsLegales