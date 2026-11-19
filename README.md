<img width="1536" height="1024" alt="WhatsApp Image 2026-11-17 at 14 43 49" src="https://github.com/user-attachments/assets/c83d5b27-d91f-41aa-a59a-943532e52506" />


<p align="center">
  <img src="https://img.shields.io/badge/ESSECT-Business%20Computing-556B2F?style=for-the-badge&logoColor=white" alt="ESSECT"/>
  <img src="https://img.shields.io/badge/Statut-En%20Développement-D2691E?style=for-the-badge&logoColor=white" alt="Statut"/>
 
</p>

<h3 align="center" style="color: #D2691E;">🌱 <em>Moins de gaspillage, plus de partage</em> 🌱</h3>

---

## 📖 1. Présentation du projet

**CampusSave** est une plateforme numérique anti-gaspillage alimentaire mettant en relation les étudiants et les associations universitaires avec les restaurants, cafétérias, pâtisseries et commerces alimentaires situés à proximité de l'ESSECT. 

L'objectif est double :
- Permettre aux étudiants et aux clubs universitaires d'acheter des produits alimentaires à prix réduits.
- Aider les commerçants à valoriser leurs invendus, attirer de nouveaux clients et améliorer leurs services grâce aux données et à l'intelligence artificielle.

Le système repose sur une architecture centralisée comprenant deux applications clientes partageant les mêmes données en temps réel via une API REST commune :
- **Application Web** développée avec **React.js**.
- **Application Mobile** développée avec **Flutter**.

---

## 👥 2. Acteurs du système

La plateforme gère quatre profils d'utilisateurs distincts avec des droits d'accès sécurisés :
1. **Étudiant :** Consulte les offres, effectue des recherches filtrées, réserve et paie ses commandes en ligne, présente son QR code lors du retrait, cumule des EcoPoints et soumet des feedbacks.
2. **Commerçant :** Gère son établissement, publie/modifie/supprime ses offres et Surprise Baskets, analyse la concurrence, traite les commandes classiques et les demandes groupées des associations, et valide les retraits par scan de QR code.
3. **Association (Club universitaire) :** Crée un compte club, déclare des événements, sélectionne des produits en grande quantité, envoie des demandes de commandes groupées, négocie les conditions et effectue le paiement.
4. **Administrateur :** Supervise la plateforme, valide les partenariats des commerçants, gère les utilisateurs, consulte l'ImpactEco Dashboard et exploite les suggestions d'amélioration générées par l'Agent IA.

---

## ⚙️ 3. Fonctionnalités principales

### ✅ Fonctionnalités obligatoires
- **Authentification & Rôles :** Inscription, connexion, déconnexion et gestion des profils selon les rôles (Étudiant, Commerçant, Association, Admin) via Firebase Authentication.
- **Gestion des commerces :** Enregistrement des établissements partenaires, formulaire de partenariat et validation par l'administrateur.
- **Gestion des offres & Surprise Baskets :** CRUD complet des invendus (photo, prix initial, prix réduit, quantité, horaires de récupération) et création de paniers surprises.
- **Recherche & Analyse concurrentielle :** Exploration des offres par filtre (produit, commerce, catégorie, prix), compte à rebours des offres limitées, et consultation comparative pour les commerçants.
- **Commandes & Commandes groupées :** Gestion du panier étudiant et module spécifique permettant aux associations de commander en volume pour leurs événements (workshops, conférences).
- **Paiement électronique :** Intégration de la solution **Konnect** (en mode test / Sandbox) pour le règlement sécurisé.
- **Système de QR Code :** Génération automatique d'un QR code unique après confirmation du paiement et scan pour validation lors de la récupération.
- **Tableaux de bord & ImpactEco :** Statistiques de ventes, suivi des stocks en temps réel, et tableau de bord écologique mesurant le gaspillage évité et les économies réalisées.
- **Agent IA d'analyse des feedbacks :** Analyse périodique des notes et commentaires laissés par les étudiants pour générer des suggestions d'amélioration à destination des commerçants et de l'admin.
- **Programme de fidélité EcoPoints :** Attribution automatique de points aux étudiants après la validation effective du retrait.

---

## 🛠️ 4. Stack technique

| Composant | Technologie | Rôle |
| :--- | :--- | :--- |
| **Frontend Web** | React.js | Interface utilisateur Web (Étudiants, Commerçants, Associations, Admin) |
| **Application Mobile** | Flutter | Application mobile cross-platform (Android / iOS) |
| **Backend** | Node.js / Express.js | Serveur applicatif et API REST commune |
| **Base de données** | Firebase Firestore | Stockage NoSQL synchronisé en temps réel |
| **Authentification** | Firebase Authentication | Gestion des comptes et des rôles de sécurité |
| **Notifications** | Firebase Cloud Messaging | Notifications push (statut de commande, alertes) |
| **Paiement** | API Konnect | Passerelle de paiement en ligne (environnement Sandbox) |

---

## 📁 5. Architecture du dépôt GitHub

```text
CampusSave/
├── frontend-web/       # Code source de l'application Web (React.js)
├── mobile-app/         # Code source de l'application Mobile (Flutter)
├── backend/            # Code source du serveur API REST (Node.js / Express)
├── documentation/      # Livrables documentaires
│   ├── UML/            # Diagrammes de cas d'utilisation (DCU), de classes, etc.
│   ├── maquettes/      # Wireframes, prototypes UI/UX et logo
│   └── rapport/        # Rapport final du projet
├── .gitignore          # Exclusion des dépendances et clés privées
└── README.md           # Documentation générale du projet
