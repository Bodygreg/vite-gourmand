# Vite & Gourmand

Application web traiteur développée dans le cadre de l'ECF 
TP Développeur Web et Web Mobile de la formation Studi.

## Stack technique

- **Front-end** : React
- **Back-end** : Node.js + Express
- **Base de données relationnelle** : MySQL
- **Base de données NoSQL** : MongoDB
- **Déploiement** : Railway

## Prérequis

- Node.js v18+
- MySQL 8+
- MongoDB 6+

## Installation en local

### 1. Cloner le dépôt
\`\`\`bash
git clone https://github.com/Bodygreg/vite-gourmand.git
cd vite-gourmand
\`\`\`

### 2. Installer les dépendances front-end
\`\`\`bash
cd frontend
npm install
\`\`\`

### 3. Installer les dépendances back-end
\`\`\`bash
cd ../backend
npm install
\`\`\`

### 4. Configurer les variables d'environnement
\`\`\`bash
cp .env.example .env
# Remplir les variables dans .env
\`\`\`

### 5. Créer la base de données
\`\`\`bash
mysql -u root -p < database/create.sql
mysql -u root -p < database/seed.sql
\`\`\`

### 6. Lancer l'application
\`\`\`bash
# Terminal 1 - Back-end
cd backend
npm run dev

# Terminal 2 - Front-end
cd frontend
npm run dev
\`\`\`

## Structure du projet

\`\`\`
vite-gourmand/
├── frontend/          # Application React
├── backend/           # API Node.js + Express
├── database/          # Fichiers SQL
│   ├── create.sql     # Création des tables
│   └── seed.sql       # Données de test
└── README.md
\`\`\`

## Accès de test

| Rôle          | Email                    | Mot de passe  |
|---------------|--------------------------|---------------|
| Administrateur| admin@vitegourmand.fr    | Admin123!     |
| Employé       | employe@vitegourmand.fr  | Employe123!   |
| Utilisateur   | user@vitegourmand.fr     | User123!      |



