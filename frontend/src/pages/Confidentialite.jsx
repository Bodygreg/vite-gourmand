import './PageLegale.css'

const Confidentialite = () => {
  return (
    <div className="page-legale">
      <div className="container">
        <h1>Politique de confidentialité</h1>
        <p className="date-maj">Dernière mise à jour : janvier 2026</p>

        <section>
          <h2>1. Responsable du traitement</h2>
          <p>Vite & Gourmand SARL, 12 rue de la Paix, 33000 Bordeaux — contact@vitegourmand.fr</p>
        </section>

        <section>
          <h2>2. Données collectées</h2>
          <p>Lors de votre utilisation du site, nous collectons les données suivantes :</p>
          <ul>
            <li><strong>Données d'identité :</strong> nom, prénom</li>
            <li><strong>Données de contact :</strong> adresse email, numéro de téléphone</li>
            <li><strong>Données de livraison :</strong> adresse postale, ville, code postal</li>
            <li><strong>Données de commande :</strong> menus commandés, dates, montants</li>
          </ul>
        </section>

        <section>
          <h2>3. Finalités du traitement</h2>
          <ul>
            <li>Gestion des comptes utilisateurs et authentification</li>
            <li>Traitement et suivi des commandes</li>
            <li>Envoi d'emails transactionnels (confirmation de commande, réinitialisation de mot de passe)</li>
            <li>Établissement de statistiques anonymes sur l'activité du site</li>
          </ul>
        </section>

        <section>
          <h2>4. Base légale</h2>
          <p>Le traitement de vos données est fondé sur l'exécution du contrat (traitement des commandes) et votre consentement (création de compte).</p>
        </section>

        <section>
          <h2>5. Durée de conservation</h2>
          <p>Vos données personnelles sont conservées pendant la durée de votre relation avec Vite & Gourmand, puis archivées pendant 3 ans conformément aux obligations légales.</p>
        </section>

        <section>
          <h2>6. Partage des données</h2>
          <p>Vos données ne sont jamais vendues à des tiers. Elles peuvent être transmises à nos sous-traitants techniques dans le strict cadre de la fourniture du service :</p>
          <ul>
            <li>Vercel (hébergement frontend)</li>
            <li>Railway (hébergement backend)</li>
            <li>MongoDB Atlas (base de données)</li>
            <li>Resend (envoi d'emails transactionnels)</li>
            <li>Cloudinary (hébergement des images)</li>
          </ul>
        </section>

        <section>
          <h2>7. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
            <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
            <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
            <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
            <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
          </ul>
          <p>Pour exercer ces droits : <strong>contact@vitegourmand.fr</strong></p>
        </section>

        <section>
          <h2>8. Sécurité</h2>
          <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction :</p>
          <ul>
            <li>Mots de passe hashés avec bcrypt</li>
            <li>Communications chiffrées via HTTPS</li>
            <li>Authentification par token JWT</li>
            <li>Accès aux données limité par rôles</li>
          </ul>
        </section>

        <section>
          <h2>9. Cookies</h2>
          <p>Ce site n'utilise pas de cookies publicitaires ou de tracking. Seuls des mécanismes de stockage local (localStorage) sont utilisés pour maintenir votre session de connexion.</p>
        </section>

        <section>
          <h2>10. Contact et réclamations</h2>
          <p>Pour toute question relative à vos données personnelles : <strong>contact@vitegourmand.fr</strong></p>
          <p>Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL : <strong>cnil.fr</strong></p>
        </section>
      </div>
    </div>
  )
}

export default Confidentialite