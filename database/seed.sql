-- Données de test Vite & Gourmand

USE vite_gourmand;

-- Insertion des rôles
INSERT INTO role (libelle) VALUES
('administrateur'),
('employe'),
('utilisateur');

-- Insertion des utilisateurs
-- Mots de passe hashés avec bcrypt (valeur : "password")
INSERT INTO utilisateur (role_id, email, password, nom, prenom, telephone, adresse, ville, code_postal) VALUES
(1, 'admin@vitegourmand.fr', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dupont', 'José', '0605040302', '1 rue de la Paix', 'Bordeaux', '33000'),
(2, 'employe@vitegourmand.fr', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Martin', 'Julie', '0607080910', '2 rue du Commerce', 'Bordeaux', '33000'),
(3, 'user@vitegourmand.fr', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bernard', 'Jean', '0611121314', '3 avenue des Fleurs', 'Bordeaux', '33000');

-- Insertion des thèmes
INSERT INTO theme (libelle) VALUES
('Noël'),
('Pâques'),
('Classique'),
('Évènement');

-- Insertion des régimes
INSERT INTO regime (libelle) VALUES
('Classique'),
('Végétarien'),
('Vegan');

-- Insertion des menus
INSERT INTO menu (theme_id, regime_id, titre, description, nb_personnes_min, prix, conditions, stock) VALUES
(1, 1, 'Menu de Noël', 'Un menu festif pour célébrer Noël en famille', 4, 120.00, 'Commander 48h à l\'avance minimum', 10),
(2, 2, 'Menu de Pâques Végétarien', 'Un menu de saison sans viande pour Pâques', 6, 95.00, 'Commander 72h à l\'avance minimum', 8),
(3, 1, 'Menu Classique', 'Notre menu incontournable pour tous vos événements', 2, 45.00, 'Commander 24h à l\'avance minimum', 15),
(4, 3, 'Menu Événement Vegan', 'Un menu 100% vegan pour vos événements', 8, 150.00, 'Commander 1 semaine à l\'avance minimum', 5);

-- Insertion des plats
INSERT INTO plat (nom, type, description) VALUES
('Foie gras maison', 'entree', 'Foie gras fait maison avec confiture de figues'),
('Velouté de butternut', 'entree', 'Velouté onctueux de courge butternut'),
('Bûche de Noël', 'dessert', 'Bûche traditionnelle chocolat-praliné'),
('Dinde farcie', 'plat', 'Dinde farcie aux marrons et champignons'),
('Tarte aux légumes', 'plat', 'Tarte feuilletée aux légumes de saison'),
('Mousse au chocolat', 'dessert', 'Mousse au chocolat noir 70%'),
('Salade de chèvre chaud', 'entree', 'Salade verte avec chèvre chaud et miel'),
('Magret de canard', 'plat', 'Magret de canard sauce aux cerises'),
('Tarte tatin', 'dessert', 'Tarte tatin aux pommes caramélisées');

-- Insertion des allergènes
INSERT INTO allergene (libelle) VALUES
('Gluten'),
('Lactose'),
('Oeufs'),
('Fruits à coque'),
('Céleri'),
('Moutarde'),
('Soja'),
('Poisson');

-- Liaison menus et plats
INSERT INTO menu_plat (menu_id, plat_id) VALUES
(1, 1), -- Menu Noël → Foie gras
(1, 4), -- Menu Noël → Dinde farcie
(1, 3), -- Menu Noël → Bûche de Noël
(2, 7), -- Menu Pâques → Salade chèvre chaud
(2, 5), -- Menu Pâques → Tarte aux légumes
(2, 6), -- Menu Pâques → Mousse au chocolat
(3, 2), -- Menu Classique → Velouté butternut
(3, 8), -- Menu Classique → Magret de canard
(3, 9), -- Menu Classique → Tarte tatin
(4, 7), -- Menu Vegan → Salade chèvre chaud
(4, 5), -- Menu Vegan → Tarte aux légumes
(4, 6); -- Menu Vegan → Mousse au chocolat

-- Liaison plats et allergènes
INSERT INTO plat_allergene (plat_id, allergene_id) VALUES
(1, 2), -- Foie gras → Lactose
(2, 2), -- Velouté butternut → Lactose
(3, 1), -- Bûche → Gluten
(3, 2), -- Bûche → Lactose
(3, 3), -- Bûche → Oeufs
(4, 1), -- Dinde farcie → Gluten
(5, 1), -- Tarte légumes → Gluten
(6, 2), -- Mousse chocolat → Lactose
(6, 3), -- Mousse chocolat → Oeufs
(7, 2), -- Salade chèvre → Lactose
(8, 1), -- Magret → Gluten
(9, 1), -- Tarte tatin → Gluten
(9, 3); -- Tarte tatin → Oeufs

-- Insertion des horaires
INSERT INTO horaire (jour, heure_ouverture, heure_fermeture) VALUES
('Lundi', '09:00', '19:00'),
('Mardi', '09:00', '19:00'),
('Mercredi', '09:00', '19:00'),
('Jeudi', '09:00', '19:00'),
('Vendredi', '09:00', '19:00'),
('Samedi', '10:00', '18:00'),
('Dimanche', '10:00', '14:00');