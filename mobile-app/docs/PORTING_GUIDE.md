# Guide de portage React → Flutter (CampusSave Mobile)

Ce document fixe les conventions du portage. **Tout écran ajouté au projet doit
s'y conformer**, afin que les 41 pages du frontend React restent visuellement
identiques et techniquement homogènes.

---

## 1. Principe général

L'application Flutter est un **portage fidèle** de l'application React
(`CampusSave-Web/client/src`). On ne réinvente ni les écrans, ni les textes, ni
les couleurs :

* **Textes** : reprise mot pour mot du français d'origine (accents compris).
* **Couleurs** : uniquement via `AppColors` (voir `lib/core/theme/app_colors.dart`).
* **Tailles / rayons / ombres** : uniquement via `AppText`, `AppRadii`,
  `AppShadows`.
* **Composants** : uniquement via `lib/widgets/*` (jamais de `Card`, `ElevatedButton`
  ou `TextField` Material brut, sauf conteneurs invisibles).
* **Aucune fonctionnalité nouvelle** : si une page React n'a pas de bouton, la
  page Flutter n'en ajoute pas.

### Adaptation mobile (autorisée et attendue)

Le design d'origine est « desktop-first ». Sur téléphone :

* les grilles `md:grid-cols-2` / `lg:grid-cols-4` deviennent des colonnes
  empilées ou des `Wrap` à 2 colonnes ;
* les tableaux (`<table>`) deviennent des cartes empilées (une carte = une
  ligne, avec libellé/valeur) — **jamais** de `DataTable` horizontale ;
* les `sticky` barres latérales (résumé de réservation) deviennent des blocs
  normaux en fin de contenu ;
* le tiroir de navigation et la barre inférieure remplacent la sidebar
  (déjà fournis par `lib/layouts/*`) ;
* rien ne doit provoquer de débordement horizontal (`RenderFlex overflowed`).

---

## 2. Anatomie d'un écran

Chaque écran est un **contenu pur** : la coquille (en-tête, tiroir, barre
inférieure, garde de rôle) est fournie par `AppRouter` dans
`lib/routing/app_router.dart`. Un écran ne crée **jamais** de `Scaffold`, ni
d'`AppBar`, ni de `Drawer`.

```dart
class ExampleScreen extends StatelessWidget {
  const ExampleScreen({super.key, required this.orderId});

  final String orderId;

  @override
  Widget build(BuildContext context) {
    final ws = AppScope.of(context).student; // état réactif
    ...
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [ ... ],
    );
  }
}
```

Le corps est déjà placé dans un `SingleChildScrollView` avec 16 px de marge :
**ne pas** ajouter de `ListView`/`SingleChildScrollView` racine (utiliser
`Column`, `Wrap`, `ListView.separated(shrinkWrap: true, physics: NeverScrollableScrollPhysics())`
si une liste paresseuse est vraiment nécessaire).

---

## 3. Boîte à outils disponible

### Thème

| Fichier | Contenu |
|---|---|
| `core/theme/app_colors.dart` | `AppColors.background/primary/primaryDark/gold/green/orange/stone50…900/red700/red50/amberText`, helpers `goldSoft()`, `primarySoft()`, `greenSoft()`, `orangeSoft()`, `goldTint()` |
| `core/theme/app_text.dart` | `AppText.t10/t11/xs/sm/base/lg/xl/xl2/xl3/xl4/xl5({weight, color, height, letterSpacing})` |
| `core/theme/app_style.dart` | `AppRadii.rLg/rXl/rXl2/rXl3/rXl32/rFull`, `AppSpacing`, `AppShadows.xs2/xs/sm/md/xl/xl2`, `AppBorders.card` |

### Widgets partagés

| Widget | Usage |
|---|---|
| `BrandLogo(height: 48)` | logo officiel (jamais recoloré) |
| `CsButton(label:, onPressed:, variant:, icon:, expand:, busy:, compact:, size:)` | `CsButtonVariant.primary/secondary/green/ghost/soft/danger/white`, `CsButtonSize.small/regular/large` |
| `CsIconButton(icon:, onPressed:, background:, foreground:, badge:, tooltip:)` | bouton carré arrondi des en-têtes |
| `CsCard(child:, padding:, radius:, onTap:, borderColor:, shadow:)` | carte blanche à contour or |
| `PageHeader(title:, eyebrow:, subtitle:, onBack:, backLabel:, trailing:)` | titre de page + surtitre « Étape 1 sur 3 » |
| `SectionHeader(title:, subtitle:, actionLabel:, onAction:, actionIcon:)` | titre de section + lien d'action |
| `CsTextLink(label:, onPressed:, icon:, color:)` | lien texte terracotta |
| `StatCard(label:, value:, note:, valueColor:, onTap:, highlighted:, icon:)` | indicateur clé (KPI) |
| `CsKpiGrid(children: [...])` | grille adaptative de KPI |
| `CsInfoRow(label:, value:, valueColor:)` | ligne libellé/valeur |
| `CsSplitBar(leftFraction:, leftColor:, rightColor:)` | barre de répartition bicolore |
| `CsLegendDot(color:, label:)` | légende |
| `CsInfoBanner(title:, message:, icon:, color:)` | encart d'information |
| `CsTextField(label:, controller:, hint:, icon:, errorText:, keyboardType:, obscure:, maxLines:, maxLength:, prefixText:, enabled:, onChanged:, inputFormatters:)` | champ de formulaire étiqueté |
| `CsSearchField(controller:, hint:, onChanged:)` | champ de recherche |
| `CsDropdownField<T>(label:, value:, items:, onChanged:, hint:, errorText:)` | liste déroulante |
| `QuantityStepper(value:, max:, min:, onChanged:)` | sélecteur de quantité |
| `CsSwitchRow(title:, subtitle:, value:, onChanged:, icon:)` | réglage booléen |
| `EmptyState(icon:, title:, description:, actionLabel:, onAction:, secondaryActionLabel:, onSecondaryAction:, compact:, borderless:)` | état vide |
| `CsAlert(message:, title:, icon:, color:)` | bandeau d'erreur inline |
| `CsToast.show(context, 'message')` | notification éphémère |
| `LoadingScreen()` | chargement plein écran |
| `SafeImage(src:, width:, height:, radius:, fit:)` | image avec repli (asset ou URL) |
| `Avatar(src:, name:, size:)` | photo ou initiales |
| `CsIconBadge(icon:, background:, foreground:, size:, radius:)` | pastille d'icône |
| `OfferImage(src:, height:, discountPercent:, remainingLabel:, surpriseBasket:)` | visuel d'offre avec pastilles |
| `QrCodeView(value:, size:)` | QR Code réel |
| `CsPill(label:, background:, foreground:, borderColor:, icon:, dotColor:, dense:)` | pastille générique |
| `StudentOrderStatusBadge(status:)` / `MerchantOrderStatusBadge(status:)` / `AdminOrderStatusBadge(status:)` / `PaymentStatusBadge(status:, pendingLabel:, failedLabel:)` / `ValidationStatusBadge(status:)` / `AccountStatusBadge(status:)` / `RoleBadge(role:)` / `OfferStatusBadge(status:, quantity:)` / `PublicationStatusBadge(status:)` | pastilles de statut |

### Utilitaires

| Fichier | Contenu |
|---|---|
| `core/utils/formatters.dart` | `Formatters.price(9.5)` → `« 9,50 DT »`, `.decimal`, `.discountPercent`, `.discount`, `.initials`, `.remaining(n)`, `.plural`, `.truncate` |
| `core/utils/id_generator.dart` | `IdGenerator.nextOrderId()`, `.qrTokenFor(orderId, seed)`, `.nowTimeLabel()`, `.justNow` |
| `routing/route_names.dart` | `Routes.*` |
| `routing/page_args.dart` | `PageArgs(offerId:, orderId:, userId:, merchantId:, quantity:, qrCode:, searchProduct:, searchRestaurant:, category:)` |
| `routing/app_router.dart` | `AppRouter.switchTo(context, route, args:)`, `.push(...)`, `.replace(...)`, `.back(context)` |

### État applicatif

```dart
final root = AppScope.of(context);   // réactif (rebuild à chaque notify)
final student = root.student;        // StudentWorkspace
final merchant = root.merchant;      // MerchantWorkspace
final admin = root.admin;            // AdminWorkspace
root.auth                            // AuthController (role, isAuthenticated, signIn…)
```

Chaque `Workspace` expose des listes **immuables** (`List.unmodifiable`) et des
actions qui appellent `notifyListeners()`. Ne jamais modifier les listes
directement : passer par les actions fournies.

Pour déclencher une action dans un callback sans s'abonner :
`AppScope.read(context)`.

Navigation :

```dart
// Changement d'écran « racine » de l'espace (barre inférieure, tiroir)
AppRouter.switchTo(context, Routes.studentOrders);

// Entrer dans un détail (le retour revient à l'écran précédent)
AppRouter.push(context, Routes.studentOfferDetails, args: PageArgs(offerId: offer.id));

// Remplacer l'étape courante (ex. paiement → confirmation)
AppRouter.replace(context, Routes.studentConfirmationQr, args: PageArgs(orderId: order.id));
```

---

## 4. Règles d'implémentation

1. **Fichiers** : un écran = un fichier, nommé en `snake_case`, dans
   `lib/screens/<espace>/`. Les widgets propres à un écran volent dans
   `lib/screens/<espace>/widgets/`.
2. **Classes** : `PascalCase`, `StatelessWidget` sauf si un état local
   (formulaire, filtre, sélection) est nécessaire → `StatefulWidget`.
3. **Const** : dès que possible (`const` constructors, `const` children) — le
   linter du projet l'exige.
4. **Import** : chemins relatifs, un seul par ligne, triés.
5. **Langue** : commentaires et doc en français ; identifiants de code en
   anglais.
6. **Validation de formulaire** : `errorText` sur `CsTextField`, contrôles dans
   l'ordre affiché, messages en français (voir section 6).
7. **Aucun `print`**, aucun `TODO` laissé dans le code livré.
8. **Pas de dépendance supplémentaire** : `pubspec.yaml` n'est jamais modifié.
9. **Ne jamais modifier** `lib/core`, `lib/widgets`, `lib/layouts`,
   `lib/state`, `lib/data`, `lib/routing` : ce sont des contrats partagés.
   Si un widget manque, le créer dans le dossier de l'espace concerné.

---

## 5. Correspondance React → Flutter

Les noms de fichiers et de classes sont imposés (le routeur les référence
déjà) :

| Page React | Fichier Flutter | Classe |
|---|---|---|
| `pages/public/LandingPage.tsx` | `screens/public/landing_screen.dart` | `LandingScreen` |
| `pages/public/NotFoundPage.tsx` | `screens/public/not_found_screen.dart` | `NotFoundScreen` |
| `pages/student/*` | `screens/student/*_screen.dart` | voir `app_router.dart` |

Le routeur crée déjà chaque écran avec ses paramètres : **ne pas changer les
constructeurs**.

---

## 6. Messages de validation attendus (français)

| Champ | Règle | Message |
|---|---|---|
| Nom complet | ≥ 3 caractères | « Veuillez saisir votre nom complet. » |
| E-mail | format e-mail | « Adresse e-mail invalide. » |
| Téléphone | 8 chiffres (indicatif toléré) | « Numéro de téléphone invalide (8 chiffres). » |
| Mot de passe | ≥ 8 caractères | « Le mot de passe doit contenir au moins 8 caractères. » |
| Confirmation | identique au mot de passe | « Les mots de passe ne correspondent pas. » |
| Prix initial | > 0 | « Le prix initial doit être supérieur à 0. » |
| Prix réduit | > 0 et < prix initial | « Le prix réduit doit être inférieur au prix initial. » |
| Quantité | entier ≥ 0 | « La quantité doit être un nombre entier positif. » |
| Horaires | début < fin | « L'heure de fin doit être postérieure à l'heure de début. » |
| Champs obligatoires | non vide | « Ce champ est obligatoire. » |

---

## 7. Vérification obligatoire

L'analyseur officiel (`flutter analyze`) ne peut pas être lancé dans cet
environnement (sous-processus bloqués). Un analyseur équivalent est fourni :

```powershell
$ws='C:\Users\HP\Documents\deepseek-harness\default-workspace'
$env:TEMP="$ws\_work\tmp2"; $env:TMP="$ws\_work\tmp2"
$env:PUB_CACHE="$ws\_sdk\pubcache"
$dart="$ws\_sdk\flutter\bin\cache\dart-sdk\bin\dart.exe"
Set-Location "$ws\campussave_mobile"
& $dart run tool/check.dart "$ws\campussave_mobile"
```

Objectif : **0 erreur** sur le projet. Les avertissements doivent être traités
(imports inutilisés, champs morts) au moins pour les fichiers de l'écran
concerné. Aucun fichier ne doit rester en `PlaceholderScreen`.

---

## 8. Contexte backend

L'application est **frontend uniquement** : les données viennent de
`lib/data/mock/mock_data.dart` via `lib/data/repositories/repositories.dart`.
Le paiement est **simulé localement** (`StudentWorkspace.confirmPayment`) : ne
jamais prétendre qu'un vrai prestataire est appelé, et ne jamais ajouter
d'appel réseau.
