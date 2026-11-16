# 🥗 CampusSave — Plateforme intelligente de lutte contre le gaspillage alimentaire

**Projet pédagogique intégrateur — 3ème année Business Computing / E-Business (ESSECT)**  
**Date limite de dépôt :** 25 novembre 2026 à minuit (00h00)

---

## 📖 1. Présentation du projet

**CampusSave** est une plateforme numérique mettant en relation les étudiants universitaires avec les restaurants et cafétérias situés à proximité de l'ESSECT. L'objectif est de lutter contre le gaspillage alimentaire tout en permettant aux étudiants d'accéder à des repas de qualité à prix réduit.

Les commerçants publient leurs invendus alimentaires avec une remise, et les étudiants peuvent consulter les offres, réserver leurs produits, payer électroniquement et récupérer leur commande via un système de QR Code.

Le système repose sur une architecture centralisée comprenant deux applications clientes partageant les mêmes données en temps réel via une API REST commune :
- **Application Web** développée avec **React.js**.
- **Application Mobile** développée avec **Flutter**.

---

## 👥 2. Acteurs du système

La plateforme gère trois profils d'utilisateurs distincts avec des droits d'accès sécurisés :
1. **Étudiant :** Consulte les offres disponibles, effectue des recherches filtrées, réserve et paie ses commandes en ligne, puis présente son QR Code lors du retrait.
2. **Commerçant :** Gère les informations de son établissement, publie/modifie/supprime ses offres d'invendus (prix, quantités, horaires) et valide le retrait des commandes en scannant le QR Code client.
3. **Administrateur :** Supervise la plateforme, gère les comptes utilisateurs et valide l'inscription des nouveaux commerces.

---

## ⚙️ 3. Fonctionnalités principales

### ✅ Fonctionnalités obligatoires
- **Authentification & Rôles :** Inscription, connexion, déconnexion et gestion des profils sécurisée via Firebase Authentication.
- **Gestion des commerces :** Enregistrement des établissements partenaires et validation par l'administrateur.
- **Gestion des offres :** CRUD complet des invendus (photo, prix initial, prix réduit, quantité disponible, créneau de récupération).
- **Recherche & Filtres :** Exploration des offres par produit, commerce, catégorie ou tranche de prix.
- **Réservation & Commandes :** Gestion du panier, sélection des quantités et suivi du statut des commandes.
- **Paiement électronique :** Intégration de la solution **Konnect** (en mode test) pour le règlement sécurisé.
- **Système de QR Code :** Génération automatique d'un QR Code unique après confirmation du paiement et scan pour validation lors de la récupération.
- **Tableaux de bord :** Visualisation des statistiques et historiques adaptés à chaque rôle (Étudiant, Commerçant, Administrateur).

### 🌟 Fonctionnalités bonus (Innovantes)
- **Campus Radar :** Géolocalisation des restaurants et cafétérias partenaires autour de l'ESSECT.
- **Surprise Basket :** Paniers surprises composés d'invendus variés à tarif préférentiel.
- **EcoPoints :** Système de fidélité récompensant les étudiants à chaque commande récupérée.
- **Impact Dashboard :** Suivi statistique des quantités de nourriture sauvées et du gaspillage évité.

---

## 🛠️ 4. Stack technique

| Composant | Technologie | Rôle |
| :--- | :--- | :--- |
| **Frontend Web** | React.js | Interface utilisateur Web (Étudiant, Commerçant, Admin) |
| **Application Mobile** | Flutter | Application mobile cross-platform (Android / iOS) |
| **Backend** | Node.js / Express | Serveur applicatif et API REST commune |
| **Base de données** | Firebase Firestore | Stockage NoSQL synchronisé en temps réel |
| **Authentification** | Firebase Authentication | Gestion des comptes et des rôles |
| **Notifications** | Firebase Cloud Messaging | Notifications push (statut de commande, nouvelles offres) |
| **Paiement** | API Konnect | Passerelle de paiement en ligne (environnement Sandbox) |

---

## 📁 5. Architecture du dépôt GitHub

```text
CampusSave/
├── frontend-web/       # Code source de l'application Web (React.js)
├── mobile-app/         # Code source de l'application Mobile (Flutter)
├── backend/            # Code source du serveur API REST (Node.js / Express)
├── documentation/      # Livrables documentaires
│   ├── UML/            # Diagrammes de cas d'utilisation, classes et séquence
│   ├── maquettes/      # Wireframes et prototypes UI/UX
│   └── rapport/        # Rapport final du projet
├── .gitignore          # Exclusion des dépendances et clés privées
└── README.md           # Documentation générale du projet
