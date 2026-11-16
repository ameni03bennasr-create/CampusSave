# 🥗 CampusSave — Plateforme intelligente de lutte contre le gaspillage alimentaire

**Projet pédagogique intégrateur — 3ème année Business Computing / E-Business (ESSECT)**[cite: 5]  
**Date limite de dépôt :** 25 novembre 2026 à minuit (00h00)[cite: 5, 8]

---

## 📖 1. Présentation du projet

**CampusSave** est une plateforme numérique mettant en relation les étudiants universitaires avec les restaurants et cafétérias situés à proximité de l'ESSECT[cite: 5]. L'objectif est de lutter contre le gaspillage alimentaire tout en permettant aux étudiants d'accéder à des repas de qualité à prix réduit[cite: 5, 8].

Les commerçants publient leurs invendus alimentaires avec une remise, et les étudiants peuvent consulter les offres, réserver leurs produits, payer électroniquement et récupérer leur commande via un système de QR Code[cite: 5, 6].

Le système repose sur une architecture centralisée comprenant deux applications clientes partageant les mêmes données en temps réel via une API REST commune[cite: 5, 7] :
* **Application Web** développée avec **React.js**[cite: 5].
* **Application Mobile** développée avec **Flutter**[cite: 5].

---

## 👥 2. Acteurs du système

La plateforme gère trois profils d'utilisateurs distincts avec des droits d'accès sécurisés[cite: 6, 7] :
1. **Étudiant :** Consulte les offres disponibles, effectue des recherches filtrées, réserve et paie ses commandes en ligne, puis présente son QR Code lors du retrait[cite: 6].
2. **Commerçant :** Gère les informations de son établissement, publie/modifie/supprime ses offres d'invendus (prix, quantités, horaires) et valide le retrait des commandes en scannant le QR Code client[cite: 6].
3. **Administrateur :** Supervise la plateforme, gère les comptes utilisateurs et valide l'inscription des nouveaux commerces[cite: 6].

---

## ⚙️ 3. Fonctionnalités principales

### ✅ Fonctionnalités obligatoires
* **Authentification & Rôles :** Inscription, connexion, déconnexion et gestion des profils sécurisée via Firebase Authentication[cite: 6, 7].
* **Gestion des commerces :** Enregistrement des établissements partenaires et validation par l'administrateur[cite: 6].
* **Gestion des offres :** CRUD complet des invendus (photo, prix initial, prix réduit, quantité disponible, créneau de récupération)[cite: 6].
* **Recherche & Filtres :** Exploration des offres par produit, commerce, catégorie ou tranche de prix[cite: 6].
* **Réservation & Commandes :** Gestion du panier, sélection des quantités et suivi du statut des commandes[cite: 6].
* **Paiement électronique :** Intégration de la solution **Konnect** (en mode test) pour le règlement sécurisé[cite: 6].
* **Système de QR Code :** Génération automatique d'un QR Code unique après confirmation du paiement et scan pour validation lors de la récupération[cite: 6].
* **Tableaux de bord :** Visualisation des statistiques et historiques adaptés à chaque rôle (Étudiant, Commerçant, Administrateur)[cite: 6].

### 🌟 Fonctionnalités bonus (Innovantes)
* **Campus Radar :** Géolocalisation des restaurants et cafétérias partenaires autour de l'ESSECT[cite: 6].
* **Surprise Basket :** Paniers surprises composés d'invendus variés à tarif préférentiel[cite: 6].
* **EcoPoints :** Système de fidélité récompensant les étudiants à chaque commande récupérée[cite: 6].
* **Impact Dashboard :** Suivi statistique des quantités de nourriture sauvées et du gaspillage évité.

---

## 🛠️ 4. Stack technique

| Composant | Technologie | Rôle |
| :--- | :--- | :--- |
| **Frontend Web** | React.js | Interface utilisateur Web (Étudiant, Commerçant, Admin)[cite: 5, 7] |
| **Application Mobile** | Flutter | Application mobile cross-platform (Android / iOS)[cite: 5, 7] |
| **Backend** | Node.js / Express | Serveur applicatif et API REST commune[cite: 5, 7] |
| **Base de données** | Firebase Firestore | Stockage NoSQL synchronisé en temps réel[cite: 5, 7] |
| **Authentification** | Firebase Authentication | Gestion des comptes et des rôles[cite: 5, 7] |
| **Notifications** | Firebase Cloud Messaging | Notifications push (statut de commande, nouvelles offres)[cite: 7] |
| **Paiement** | API Konnect | Passerelle de paiement en ligne (environnement Sandbox)[cite: 6] |

---

## 📁 5. Architecture du dépôt GitHub

```text
CampusSave/
├── frontend-web/       # Code source de l'application Web (React.js)
├── mobile-app/         # Code source de l'application Mobile (Flutter)[cite: 8]
├── backend/            # Code source du serveur API REST (Node.js / Express)[cite: 8]
├── documentation/      # Livrables documentaires[cite: 7, 8]
│   ├── UML/            # Diagrammes de cas d'utilisation, classes et séquence[cite: 7]
│   ├── maquettes/      # Wireframes et prototypes UI/UX[cite: 7]
│   └── rapport/        # Rapport final du projet[cite: 8]
├── .gitignore          # Exclusion des dépendances et clés privées[cite: 8]
└── README.md           # Documentation générale du projet[cite: 8]
