-- Base de données Vite & Gourmand
-- Création des tables

USE vite_gourmand;

-- Table des rôles
CREATE TABLE role (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL
);

-- Table des utilisateurs
CREATE TABLE utilisateur (
    utilisateur_id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    telephone VARCHAR(20),
    adresse VARCHAR(255),
    ville VARCHAR(100),
    code_postal VARCHAR(10),
    actif BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);

-- Table des thèmes
CREATE TABLE theme (
    theme_id INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL
);

-- Table des régimes
CREATE TABLE regime (
    regime_id INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL
);

-- Table des menus
CREATE TABLE menu (
    menu_id INT AUTO_INCREMENT PRIMARY KEY,
    theme_id INT NOT NULL,
    regime_id INT NOT NULL,
    titre VARCHAR(100) NOT NULL,
    description TEXT,
    nb_personnes_min INT NOT NULL,
    prix DOUBLE NOT NULL,
    conditions TEXT,
    stock INT DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    delai_commande INT DEFAULT 48,
    FOREIGN KEY (theme_id) REFERENCES theme(theme_id),
    FOREIGN KEY (regime_id) REFERENCES regime(regime_id)
);

-- Table des plats
CREATE TABLE plat (
    plat_id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    photo LONGBLOB,
    description TEXT
);

-- Table des allergènes
CREATE TABLE allergene (
    allergene_id INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL
);

-- Table de liaison menu_plat
CREATE TABLE menu_plat (
    menu_id INT NOT NULL,
    plat_id INT NOT NULL,
    PRIMARY KEY (menu_id, plat_id),
    FOREIGN KEY (menu_id) REFERENCES menu(menu_id),
    FOREIGN KEY (plat_id) REFERENCES plat(plat_id)
);

-- Table de liaison plat_allergene
CREATE TABLE plat_allergene (
    plat_id INT NOT NULL,
    allergene_id INT NOT NULL,
    PRIMARY KEY (plat_id, allergene_id),
    FOREIGN KEY (plat_id) REFERENCES plat(plat_id),
    FOREIGN KEY (allergene_id) REFERENCES allergene(allergene_id)
);

-- Table des commandes
CREATE TABLE commande (
    commande_id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    menu_id INT NOT NULL,
    date_prestation DATE NOT NULL,
    heure_livraison TIME NOT NULL,
    adresse_livraison VARCHAR(255) NOT NULL,
    ville_livraison VARCHAR(100) NOT NULL,
    nb_personnes INT NOT NULL,
    prix_menu DOUBLE NOT NULL,
    prix_livraison DOUBLE NOT NULL,
    statut VARCHAR(50) DEFAULT 'en attente',
    retour_materiel BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(utilisateur_id),
    FOREIGN KEY (menu_id) REFERENCES menu(menu_id)
);

-- Table de l'historique des statuts
CREATE TABLE historique_statut (
    historique_id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id INT NOT NULL,
    employe_id INT NOT NULL,
    statut VARCHAR(50) NOT NULL,
    date_changement DATETIME DEFAULT CURRENT_TIMESTAMP,
    motif TEXT,
    FOREIGN KEY (commande_id) REFERENCES commande(commande_id),
    FOREIGN KEY (employe_id) REFERENCES utilisateur(utilisateur_id)
);

-- Table des avis
CREATE TABLE avis (
    avis_id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    commande_id INT NOT NULL,
    note INT NOT NULL CHECK (note BETWEEN 1 AND 5),
    description VARCHAR(500),
    statut VARCHAR(20) DEFAULT 'en attente',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(utilisateur_id),
    FOREIGN KEY (commande_id) REFERENCES commande(commande_id)
);

-- Table des horaires
CREATE TABLE horaire (
    horaire_id INT AUTO_INCREMENT PRIMARY KEY,
    jour VARCHAR(20) NOT NULL,
    heure_ouverture VARCHAR(10) NOT NULL,
    heure_fermeture VARCHAR(10) NOT NULL
);