import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_style.dart';
import '../../core/theme/app_text.dart';
import '../../routing/app_router.dart';
import '../../routing/route_names.dart';
import '../../state/app_scope.dart';
import '../../widgets/brand_logo.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_surfaces.dart';

/// Page d'accueil publique — portage de `pages/public/LandingPage.tsx`.
///
/// Présente la plateforme, le parcours en quatre étapes, les trois espaces et
/// les engagements, puis invite à créer un compte.
class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = AppScope.of(context).auth;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            _PublicHeader(isAuthenticated: auth.isAuthenticated),
            const Expanded(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    _HeroSection(),
                    _HowItWorksSection(),
                    _SpacesSection(),
                    _BenefitsSection(),
                    _FinalCallToAction(),
                    _PublicFooter(),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PublicHeader extends StatelessWidget {
  const _PublicHeader({required this.isAuthenticated});

  final bool isAuthenticated;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: AppColors.goldSoft(0.5))),
      ),
      child: Row(
        children: [
          InkWell(
            onTap: () => AppRouter.switchTo(context, Routes.landing),
            child: const BrandLogo(height: 34),
          ),
          const Spacer(),
          if (isAuthenticated)
            CsButton(
              label: 'Accéder à mon espace',
              compact: true,
              size: CsButtonSize.small,
              onPressed: () {
                final role = AppScope.read(context).auth.role;
                AppRouter.switchTo(context, switch (role) {
                  null => Routes.studentLogin,
                  _ =>
                    role.basePath == '/student'
                        ? Routes.studentHome
                        : role.basePath == '/merchant'
                        ? Routes.merchantDashboard
                        : Routes.adminDashboard,
                });
              },
            )
          else ...[
            CsTextLink(
              label: 'Se connecter',
              fontSize: 12.5,
              onPressed: () => AppRouter.switchTo(context, Routes.studentLogin),
            ),
            const SizedBox(width: 6),
            CsButton(
              label: 'Créer un compte',
              compact: true,
              size: CsButtonSize.small,
              onPressed: () =>
                  AppRouter.switchTo(context, Routes.studentRegister),
            ),
          ],
        ],
      ),
    );
  }
}

class _HeroSection extends StatelessWidget {
  const _HeroSection();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 26, 16, 28),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(999),
              border: Border.all(color: AppColors.gold),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.eco_outlined,
                  size: 13,
                  color: AppColors.green,
                ),
                const SizedBox(width: 5),
                Flexible(
                  child: Text(
                    'Anti-gaspillage alimentaire • Campus ESSECT',
                    style: AppText.t11(
                      weight: FontWeight.w800,
                      color: AppColors.green,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Text.rich(
            TextSpan(
              children: [
                TextSpan(text: 'Moins de gaspillage,\n', style: AppText.xl4()),
                TextSpan(
                  text: 'plus de partage.',
                  style: AppText.xl4(color: AppColors.primary),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          Text(
            'CampusSave met en relation les étudiants et les restaurants ou '
            'cafétérias autour du campus pour récupérer, à prix réduit, les '
            'repas et viennoiseries invendus du jour.',
            style: AppText.sm(color: AppColors.stone600, height: 1.55),
          ),
          const SizedBox(height: 20),
          CsButton(
            label: 'Je suis étudiant — créer un compte',
            icon: Icons.arrow_forward,
            expand: true,
            onPressed: () =>
                AppRouter.switchTo(context, Routes.studentRegister),
          ),
          const SizedBox(height: 10),
          CsButton(
            label: 'Choisir mon espace',
            variant: CsButtonVariant.secondary,
            expand: true,
            onPressed: () => _scrollHint(context),
          ),
          const SizedBox(height: 12),
          Wrap(
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              Text(
                'Déjà inscrit ? ',
                style: AppText.xs(color: AppColors.stone500),
              ),
              CsTextLink(
                label: 'Se connecter',
                onPressed: () =>
                    AppRouter.switchTo(context, Routes.studentLogin),
              ),
              Text(
                ' • Commerçant ? ',
                style: AppText.xs(color: AppColors.stone500),
              ),
              CsTextLink(
                label: 'Demander un compte',
                onPressed: () =>
                    AppRouter.switchTo(context, Routes.merchantRegister),
              ),
            ],
          ),
          const SizedBox(height: 22),
          // Carte de marque avec les trois arguments clés.
          Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: AppRadii.rXl32,
              border: Border.all(color: AppColors.goldSoft(0.6)),
              boxShadow: AppShadows.xl,
            ),
            child: const Column(
              children: [
                BrandLogo(height: 76),
                SizedBox(height: 18),
                _BenefitLine(
                  icon: Icons.sell_outlined,
                  color: AppColors.green,
                  label: 'Des prix réduits sur les invendus du jour',
                ),
                SizedBox(height: 10),
                _BenefitLine(
                  icon: Icons.credit_card,
                  color: AppColors.primary,
                  label: 'Paiement en ligne sécurisé',
                ),
                SizedBox(height: 10),
                _BenefitLine(
                  icon: Icons.qr_code_2,
                  color: AppColors.orange,
                  label: 'Retrait rapide par QR Code',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _scrollHint(BuildContext context) {
    // Le bouton « Choisir mon espace » fait défiler vers la section des
    // espaces, comme l'ancre `#espaces` de la page React.
    Scrollable.ensureVisible(
      context,
      duration: const Duration(milliseconds: 400),
      alignment: 0.2,
    );
  }
}

class _BenefitLine extends StatelessWidget {
  const _BenefitLine({
    required this.icon,
    required this.color,
    required this.label,
  });

  final IconData icon;
  final Color color;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 34,
          height: 34,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          child: Icon(icon, size: 16, color: Colors.white),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            label,
            style: AppText.xs(
              weight: FontWeight.w700,
              color: AppColors.stone700,
            ),
          ),
        ),
      ],
    );
  }
}

class _HowItWorksSection extends StatelessWidget {
  const _HowItWorksSection();

  static const List<(IconData, String, String)> _steps = [
    (
      Icons.storefront_outlined,
      'Les commerçants publient',
      'Restaurants et cafétérias proposent leurs invendus du jour à prix '
          'réduit, avec un créneau de retrait.',
    ),
    (
      Icons.search,
      'Les étudiants réservent',
      'Parcourez les offres autour du campus, choisissez vos quantités et '
          'réservez en quelques clics.',
    ),
    (
      Icons.credit_card,
      'Paiement en ligne sécurisé',
      'Le paiement s’effectue en ligne via un prestataire de paiement. '
          'CampusSave ne stocke aucune donnée bancaire.',
    ),
    (
      Icons.qr_code_2,
      'Retrait par QR Code',
      'Un QR Code unique est généré après confirmation du paiement : le '
          'commerçant le scanne au comptoir.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 26),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'COMMENT ÇA MARCHE',
                  style: AppText.t11(
                    weight: FontWeight.w800,
                    color: AppColors.green,
                    letterSpacing: 1,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Quatre étapes, du comptoir à votre assiette',
                  style: AppText.xl2(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
                for (var i = 0; i < _steps.length; i++) ...[
                  _StepCard(
                    index: i + 1,
                    icon: _steps[i].$1,
                    title: _steps[i].$2,
                    text: _steps[i].$3,
                  ),
                  if (i < _steps.length - 1) const SizedBox(height: 10),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StepCard extends StatelessWidget {
  const _StepCard({
    required this.index,
    required this.icon,
    required this.title,
    required this.text,
  });

  final int index;
  final IconData icon;
  final String title;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.background.withValues(alpha: 0.6),
        borderRadius: AppRadii.rXl3,
        border: Border.all(color: AppColors.goldSoft(0.6)),
      ),
      child: Stack(
        children: [
          Positioned(
            top: 0,
            right: 0,
            child: Text(
              '$index',
              style: TextStyle(
                fontSize: 30,
                fontWeight: FontWeight.w800,
                color: AppColors.gold.withValues(alpha: 0.85),
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: AppRadii.rXl2,
                  boxShadow: AppShadows.xs,
                ),
                child: Icon(icon, size: 19, color: AppColors.primary),
              ),
              const SizedBox(height: 10),
              Text(
                title,
                style: AppText.sm(
                  weight: FontWeight.w800,
                  color: AppColors.stone900,
                ),
              ),
              const SizedBox(height: 4),
              Padding(
                padding: const EdgeInsets.only(right: 26),
                child: Text(
                  text,
                  style: AppText.xs(color: AppColors.stone600, height: 1.5),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _SpacesSection extends StatelessWidget {
  const _SpacesSection();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 26, 16, 26),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'ACCÉDER À CAMPUSSAVE',
            style: AppText.t11(
              weight: FontWeight.w800,
              color: AppColors.green,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 6),
          Text('Choisissez votre espace', style: AppText.xl2()),
          const SizedBox(height: 4),
          Text(
            'Chaque profil dispose de son propre espace, adapté à ses besoins.',
            style: AppText.sm(color: AppColors.stone600),
          ),
          const SizedBox(height: 16),
          const _SpaceCard(
            icon: Icons.school_outlined,
            title: 'Étudiant',
            text:
                'Trouvez des offres près de vous, réservez, payez en ligne et '
                'récupérez votre commande avec votre QR Code.',
            loginRoute: Routes.studentLogin,
            registerRoute: Routes.studentRegister,
            registerLabel: 'Créer un compte',
          ),
          const SizedBox(height: 12),
          const _SpaceCard(
            icon: Icons.storefront_outlined,
            title: 'Commerçant',
            text:
                'Publiez vos invendus, gérez les réservations et validez les '
                'retraits en scannant le QR Code des étudiants.',
            note:
                'Votre demande d’inscription est examinée par l’administration '
                'CampusSave avant la publication d’offres.',
            loginRoute: Routes.merchantLogin,
            registerRoute: Routes.merchantRegister,
            registerLabel: 'Demander un compte',
          ),
          const SizedBox(height: 12),
          const _SpaceCard(
            icon: Icons.shield_outlined,
            title: 'Administrateur',
            text:
                'Supervisez la plateforme : validation des commerçants, suivi '
                'des offres, des commandes et des statistiques.',
            note:
                'Accès réservé à l’équipe CampusSave. Il n’existe pas '
                'd’inscription publique.',
            loginRoute: Routes.adminLogin,
          ),
        ],
      ),
    );
  }
}

class _SpaceCard extends StatelessWidget {
  const _SpaceCard({
    required this.icon,
    required this.title,
    required this.text,
    required this.loginRoute,
    this.note,
    this.registerRoute,
    this.registerLabel,
  });

  final IconData icon;
  final String title;
  final String text;
  final String loginRoute;
  final String? note;
  final String? registerRoute;
  final String? registerLabel;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadii.rXl3,
        border: Border.all(color: AppColors.goldSoft(0.6)),
        boxShadow: AppShadows.xs,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 46,
            height: 46,
            decoration: BoxDecoration(
              color: AppColors.primarySoft(0.1),
              borderRadius: AppRadii.rXl2,
            ),
            child: Icon(icon, size: 23, color: AppColors.primary),
          ),
          const SizedBox(height: 12),
          Text(title, style: AppText.lg()),
          const SizedBox(height: 6),
          Text(text, style: AppText.xs(color: AppColors.stone600, height: 1.5)),
          if (note != null) ...[
            const SizedBox(height: 10),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: AppRadii.rXl,
                border: Border.all(color: AppColors.goldSoft(0.7)),
              ),
              child: Text(
                note!,
                style: AppText.t11(color: AppColors.stone600, height: 1.45),
              ),
            ),
          ],
          const SizedBox(height: 14),
          CsButton(
            label: 'Se connecter',
            expand: true,
            compact: true,
            onPressed: () => AppRouter.switchTo(context, loginRoute),
          ),
          if (registerRoute != null && registerLabel != null) ...[
            const SizedBox(height: 8),
            CsButton(
              label: registerLabel!,
              variant: CsButtonVariant.secondary,
              expand: true,
              compact: true,
              onPressed: () => AppRouter.switchTo(context, registerRoute!),
            ),
          ],
        ],
      ),
    );
  }
}

class _BenefitsSection extends StatelessWidget {
  const _BenefitsSection();

  static const List<(IconData, String, String)> _benefits = [
    (
      Icons.eco_outlined,
      'Moins de gaspillage',
      'Chaque repas récupéré est un repas qui n’est pas jeté.',
    ),
    (
      Icons.account_balance_wallet_outlined,
      'Des prix étudiants',
      'Des plats et viennoiseries à prix réduit, près de votre campus.',
    ),
    (
      Icons.verified_user_outlined,
      'Des partenaires validés',
      'Chaque établissement est vérifié par l’administration avant de publier.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 26),
      child: Column(
        children: [
          for (var i = 0; i < _benefits.length; i++) ...[
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 42,
                  height: 42,
                  decoration: const BoxDecoration(
                    color: AppColors.green,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(_benefits[i].$1, size: 20, color: Colors.white),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _benefits[i].$2,
                        style: AppText.sm(
                          weight: FontWeight.w800,
                          color: AppColors.stone900,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        _benefits[i].$3,
                        style: AppText.xs(
                          color: AppColors.stone600,
                          height: 1.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            if (i < _benefits.length - 1) const SizedBox(height: 18),
          ],
        ],
      ),
    );
  }
}

class _FinalCallToAction extends StatelessWidget {
  const _FinalCallToAction();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 26),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 26),
        decoration: BoxDecoration(
          color: AppColors.primary,
          borderRadius: AppRadii.rXl32,
        ),
        child: Column(
          children: [
            Text(
              'Prêt à sauver votre prochain repas ?',
              textAlign: TextAlign.center,
              style: AppText.xl2(color: Colors.white),
            ),
            const SizedBox(height: 6),
            Text(
              'Rejoignez CampusSave et participez à un campus plus responsable.',
              textAlign: TextAlign.center,
              style: AppText.sm(color: Colors.white.withValues(alpha: 0.85)),
            ),
            const SizedBox(height: 18),
            CsButton(
              label: 'Créer un compte étudiant',
              variant: CsButtonVariant.white,
              expand: true,
              onPressed: () =>
                  AppRouter.switchTo(context, Routes.studentRegister),
            ),
            const SizedBox(height: 8),
            CsButton(
              label: 'Je suis commerçant',
              variant: CsButtonVariant.ghost,
              expand: true,
              onPressed: () =>
                  AppRouter.switchTo(context, Routes.merchantRegister),
            ),
          ],
        ),
      ),
    );
  }
}

class _PublicFooter extends StatelessWidget {
  const _PublicFooter();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: Colors.white,
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 22, 16, 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const BrandLogo(height: 46),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 16,
                  runSpacing: 8,
                  children: [
                    CsTextLink(
                      label: 'Espace Étudiant',
                      color: AppColors.stone600,
                      fontSize: 12.5,
                      onPressed: () =>
                          AppRouter.switchTo(context, Routes.studentLogin),
                    ),
                    CsTextLink(
                      label: 'Espace Commerçant',
                      color: AppColors.stone600,
                      fontSize: 12.5,
                      onPressed: () =>
                          AppRouter.switchTo(context, Routes.merchantLogin),
                    ),
                    CsTextLink(
                      label: 'Espace Administrateur',
                      color: AppColors.stone600,
                      fontSize: 12.5,
                      onPressed: () =>
                          AppRouter.switchTo(context, Routes.adminLogin),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
            decoration: const BoxDecoration(
              border: Border(top: BorderSide(color: AppColors.background)),
            ),
            child: Text(
              'CampusSave © 2026 • Projet Intégrateur 3ème année Business '
              'Computing – ESSECT Tunis',
              textAlign: TextAlign.center,
              style: AppText.t11(color: AppColors.stone500),
            ),
          ),
        ],
      ),
    );
  }
}
