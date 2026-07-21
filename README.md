# Vite & Gourmand

Application web traiteur développée dans le cadre de l'ECF TP Développeur Web et Web Mobile (Studi).

## Liens

- **Application en ligne :** https://vite-gourmand-lemon.vercel.app
- **API Backend :** https://vite-gourmand-production-2af1.up.railway.app
- **Gestion de projet (Notion) :** https://app.notion.com/p/Vite-Gourmand-ECF-39a661dfb4c3802f91a5ca8024e0ccc4?source=copy_link
- **Dépôt GitHub :** https://github.com/Bodygreg/vite-gourmand.git

## Stack technique

- **Frontend :** React 18 + Vite + React Router
- **Backend :** Node.js + Express
- **Base de données relationnelle :** MySQL (XAMPP en local, Railway en production)
- **Base de données NoSQL :** MongoDB Atlas
- **Authentification :** JWT (JSON Web Token)
- **Emails :** Resend (production), Mailtrap (développement)
- **Images :** Cloudinary
- **Déploiement :** Railway (backend) + Vercel (frontend)

## Prérequis

- Node.js v18+
- XAMPP (MySQL + phpMyAdmin)
- Compte MongoDB Atlas
- Compte Cloudinary
- Compte Resend
- Git

## Installation en local

### 1. Cloner le dépôt

```bash
git clone https://github.com/Bodygreg/vite-gourmand.git
cd vite-gourmand
```

### 2. Configurer la base de données MySQL

1. Lancer XAMPP et démarrer MySQL
2. Ouvrir phpMyAdmin (http://localhost/phpmyadmin)
3. Créer la base de données `vite_gourmand` avec l'encodage `utf8mb4_general_ci`
4. Dans l'onglet SQL, exécuter `database/create.sql`
5. Dans l'onglet SQL, exécuter `database/seed.sql`

### 3. Configurer le backend

```bash
cd backend
npm install
```

Créer le fichier `backend/.env` :

```
PORT=3000
JWT_SECRET=vite_gourmand_secret_key_2026
MYSQL_HOST=localhost
MYSQL_USER=vite_user
MYSQL_PASSWORD=vite2026
MYSQL_DATABASE=vite_gourmand
MYSQL_PORT=3309
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/vite_gourmand
RESEND_API_KEY=re_VOTRE_CLE_RESEND
EMAIL_TO=votre@email.com
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

Créer l'utilisateur MySQL dédié (dans phpMyAdmin → SQL) :

```sql
CREATE USER 'vite_user'@'localhost' IDENTIFIED BY 'vite2026';
GRANT ALL PRIVILEGES ON vite_gourmand.* TO 'vite_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Lancer le backend

```bash
cd backend
npm run dev
```

Le serveur démarre sur http://localhost:3000

### 5. Configurer le frontend

```bash
cd frontend
npm install
```

Créer le fichier `frontend/.env` :

```
VITE_API_URL=http://localhost:3000/api
```

### 6. Lancer le frontend

```bash
cd frontend
npm run dev
```

L'application est accessible sur http://localhost:5173

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Administrateur | admin@vitegourmand.fr | Password1234! |
| Employé | employe@vitegourmand.fr | Password1234! |
| Utilisateur | user@vitegourmand.fr | Password1234! |

## Structure du projet

```
vite-gourmand/
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/     # Navbar, Footer
│   │   ├── pages/          # Pages de l'application
│   │   ├── context/        # AuthContext (JWT)
│   │   ├── utils/          # axios.js
│   │   └── App.jsx         # Router principal
│   └── vercel.json         # Config routing Vercel
├── backend/                # API Node.js + Express
│   └── src/
│       ├── config/         # MySQL, MongoDB, Cloudinary
│       ├── controllers/    # Logique métier
│       ├── middlewares/    # JWT, vérification rôles
│       ├── models/         # Modèle Mongoose (Statistique)
│       ├── routes/         # Routes API
│       ├── utils/          # email.js (Resend)
│       └── index.js        # Point d'entrée
├── database/
│   ├── create.sql          # Création des tables
│   └── seed.sql            # Données de test
└── README.md
```

## Déploiement

### Backend (Railway)

1. Créer un projet sur railway.app
2. Connecter le repo GitHub
3. Configurer Root Directory → `backend`
4. Ajouter un service MySQL
5. Configurer les variables d'environnement
6. Importer create.sql et seed.sql via TablePlus

### Frontend (Vercel)

1. Créer un projet sur vercel.com
2. Connecter le repo GitHub
3. Configurer Root Directory → `frontend`
4. Ajouter la variable `VITE_API_URL` avec l'URL Railway
5. Déployer
