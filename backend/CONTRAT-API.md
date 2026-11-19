# Contrat Backend ↔ Frontend (CampusSave)

Document de référence pour React et Flutter. Tout ce qui est ici est la **source unique** : rôles, statuts, collections, fonctions.

## 1. Architecture retenue

**Firebase Cloud Functions en JavaScript (Node.js)**, appelées via `httpsCallable` (pas d'Express / REST pour l'instant).
- Région : **`europe-west1`** (à préciser côté client : `getFunctions(app, "europe-west1")`).
- 1 seul endpoint HTTP classique : `konnectWebhook` (appelé par Konnect, jamais par le frontend).
- Lecture directe de Firestore autorisée côté client pour `offres`, `commandes`, `paiements`, `qrcodes`… (voir `firestore.rules`) ; **toute écriture passe par une fonction**.
- Si le cahier des charges impose Express/REST, les fonctions de `src/` se réutilisent telles quelles (la logique est séparée des endpoints).

## 2. Rôles (claim `role` du token + champ `users/{uid}.role`)

| Valeur | Signification |
|---|---|
| `etudiant` | Étudiant |
| `association` | Association (achète comme un étudiant) |
| `commercant_en_attente` | Commerçant inscrit, **pas encore validé** : aucun droit de publier |
| `commercant` | Commerçant **validé par l'admin** |
| `admin` | Administrateur (créé par script, jamais par inscription) |

Ancien vocabulaire **supprimé** : `student`, `merchant`, `pending_merchant`, `pending_commercant`.
⚠️ Après `validerCommercant`, le commerçant doit rafraîchir son token : `getIdToken(true)` (React) / `getIdToken(true)` (Flutter) pour obtenir le rôle `commercant`.

## 3. Statuts

- `statutValidation` (commerçant) : `en_attente` → `approuve` | `refuse`
- `commandes.statut` : `en_attente` → `payee` → `retiree` ; ou `annulee`
- `paiements.statutPaiement` : `initie` → `reussi` | `echoue` | `anomalie` | `a_rembourser`
- `offres.statut` : `active` | `inactive`
- `commandesGroupees.statutDemande` : `en_attente` → `acceptee` | `refusee`

## 4. Collections et champs

- `users/{uid}` : uid, nom, email, telephone, role, dateCreation ; étudiant/association : soldeEcoPoints, niveauFidelite ; commerçant : statutValidation
- `commercants/{uid}` : idCommerce, nomCommerce, logo, description, specialite, adresse, statutValidation, dateDemande, dateValidation, validePar, motifRefus
- `associations/{uid}` : idAssociation, nomClub, universite
- `offres/{id}` : titre, description, prixInitial, prixReduit, quantiteDisponible, estSurpriseBasket, horaireRecuperation, photo, statut, commercantId, nomCommerce, dateCreation, dateModification
- `commandes/{id}` : etudiantId (= id de l'acheteur, étudiant **ou** association), commercantId, statut, total, lignes[{offreId, quantiteDemandee, prixUnitaire}], offreIds[], dateCommande, dateExpirationReservation, motifAnnulation
- `paiements/{ref}` : commandeId, etudiantId, montant, modePaiement, statutPaiement, konnectRef, datePaiement
- `qrcodes/{commandeId}` : commandeId, etudiantId, codeUnique, estScanne, dateGeneration, dateScan
- `feedbacks`, `suggestionsIA`, `commandesGroupees`, `stats/impactEco` : inchangés

## 5. Fonctions callable

Erreurs : codes Firebase standard (`unauthenticated`, `permission-denied`, `invalid-argument`, `not-found`, `failed-precondition`). Les dates sont renvoyées en chaînes ISO.

| Fonction | Rôle requis | Entrée | Sortie |
|---|---|---|---|
| `completeRegistration` | connecté (compte Auth déjà créé) | `{role, nom, telephone?}` + commerçant : `nomCommerce, adresse, specialite, description?` ; association : `nomClub, universite` | `{alreadyRegistered, role}` |
| `validerCommercant` | admin | `{commercantId}` | `{ok, role, statutValidation}` |
| `refuserCommercant` | admin | `{commercantId, motif?}` | `{ok, statutValidation}` |
| `listerCommercantsEnAttente` | admin | `{}` | `{commercants[]}` |
| `creerOffre` | commercant validé | `{titre, prixInitial, prixReduit, quantiteDisponible, description?, estSurpriseBasket?, horaireRecuperation?, photo?, statut?}` | `{ok, offreId}` |
| `modifierOffre` | commercant propriétaire | `{offreId, …champs à changer}` | `{ok}` |
| `supprimerOffre` | commercant propriétaire | `{offreId}` | `{ok}` (refusé si commande en cours → mettre `statut: "inactive"`) |
| `getOffre` | connecté | `{offreId}` | `{offre}` |
| `listerOffres` | connecté | `{commercantId?, estSurpriseBasket?, prixMax?, recherche?, limite?}` | `{offres[]}` (actives et en stock) |
| `listerMesOffres` | commercant validé | `{}` | `{offres[]}` |
| `creerCommande` | etudiant / association | `{lignes:[{offreId, quantite}]}` | `{commandeId, total}` (stock réservé 30 min) |
| `initierPaiement` | etudiant / association | `{commandeId}` | `{payUrl}` |
| `validerRetrait` | commercant validé | `{codeUnique}` | `{ok}` |
| `soumettreFeedback` | etudiant | `{note 1-5, commentaire?}` | `{ok, feedbackId}` |
| `analyserFeedbacksIA` | admin | `{}` | `{ok, suggestionId, moyenne}` |
| `envoyerDemandeGroupee` | association | `{nomEvenement, dateEvenement}` | `{ok, commandeGroupeeId}` |
| `accepterOuRefuserProposition` | commercant validé | `{commandeGroupeeId, action: "accepte"\|"refuse"}` | `{ok}` |

Local uniquement (émulateur) : `simulerPaiement {commandeId, succes?: boolean}`.

## 6. Règles métier du paiement

1. `creerCommande` réserve le stock (transaction).
2. Paiement **échoué** (webhook) → paiement `echoue`, commande `annulee`, stock **restauré** (transaction).
3. Commande jamais payée → annulée et stock restauré après 30 min (`annulerCommandesExpirees`, toutes les 5 min).
4. Le webhook ne fait pas confiance à la requête : il relit le paiement chez Konnect et vérifie **statut, commande (`orderId`) et montant** avant de confirmer ; sinon paiement `anomalie`, pas de QR.
5. Paiement reçu sur une commande déjà annulée → `a_rembourser`, pas de QR.
6. Le QR code (`qrcodes/{commandeId}`) n'est créé qu'après paiement confirmé.

## 7. Tests

```
cd functions
npm run test:unit      # sans émulateur (logique pure)
# avec les émulateurs lancés (firebase emulators:start) :
npm run test:phase2    # inscription
npm run test:backend   # validation commerçant, offres, commandes, échec paiement, retrait
```
