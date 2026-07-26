import './PageLegale.css'

const CGV = () => {
  return (
    <div className="page-legale">
      <div className="container">
        <h1>Conditions Générales de Vente</h1>
        <p className="date-maj">Dernière mise à jour : janvier 2026</p>

        <section>
          <h2>Article 1 — Objet</h2>
          <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre la société Vite & Gourmand SARL (ci-après "le Prestataire") et tout client passant commande via le site vitegourmand.fr (ci-après "le Client").</p>
        </section>

        <section>
          <h2>Article 2 — Commandes</h2>
          <p>Toute commande implique l'acceptation sans réserve des présentes CGV. Les commandes sont effectuées en ligne via le site et doivent respecter les délais minimaux indiqués pour chaque menu (24h, 48h, 72h ou 1 semaine selon le menu choisi).</p>
          <p>La commande est confirmée après validation du paiement. Un email de confirmation est envoyé automatiquement au Client.</p>
        </section>

        <section>
          <h2>Article 3 — Prix et paiement</h2>
          <p>Les prix sont indiqués en euros TTC. Ils comprennent :</p>
          <ul>
            <li>Le prix du menu multiplié par le nombre de personnes</li>
            <li>Les frais de livraison : 5€ pour Bordeaux, 5€ + 0,59€/km hors Bordeaux</li>
          </ul>
          <p>Une réduction de 10% est appliquée automatiquement lorsque le nombre de personnes commandées dépasse de 5 ou plus le minimum requis par le menu.</p>
        </section>

        <section>
          <h2>Article 4 — Livraison</h2>
          <p>La livraison est effectuée à l'adresse indiquée lors de la commande, dans les horaires d'ouverture de l'établissement. Le Client s'engage à être présent ou à déléguer une personne habilitée à réceptionner la livraison.</p>
        </section>

        <section>
          <h2>Article 5 — Annulation</h2>
          <p>Le Client peut annuler sa commande tant que celle-ci est au statut "en attente". Passé ce stade, aucune annulation ne sera acceptée et la totalité du montant sera due.</p>
        </section>

        <section>
          <h2>Article 6 — Matériel prêté</h2>
          <p>Dans le cadre de certaines prestations, du matériel peut être prêté au Client (plats, contenants, etc.). Ce matériel doit être restitué dans un délai de <strong>10 jours ouvrés</strong> suivant la prestation.</p>
          <p>En cas de non-restitution dans ce délai, des frais de <strong>600€ TTC</strong> seront facturés au Client à titre de dédommagement.</p>
        </section>

        <section>
          <h2>Article 7 — Réclamations</h2>
          <p>Toute réclamation doit être adressée par email à contact@vitegourmand.fr dans un délai de 48h suivant la prestation. Passé ce délai, aucune réclamation ne pourra être prise en compte.</p>
        </section>

        <section>
          <h2>Article 8 — Droit applicable</h2>
          <p>Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux de Bordeaux seront seuls compétents.</p>
        </section>
      </div>
    </div>
  )
}

export default CGV