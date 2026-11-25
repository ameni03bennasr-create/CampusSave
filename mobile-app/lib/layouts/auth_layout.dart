import 'package:material_ui/material_ui.dart';

import '../core/theme/app_colors.dart';
import '../core/theme/app_style.dart';
import '../core/theme/app_text.dart';
import '../routing/app_router.dart';
import '../routing/route_names.dart';
import '../widgets/brand_logo.dart';

/// Variante de l'écran d'authentification (une par espace).
enum AuthVariant { student, merchant, admin }

/// Mise en page commune des pages de connexion / inscription.
///
/// Adaptation mobile des `StudentAuthLayout` / `MerchantAuthLayout` /
/// `AdminAuthLayout` du projet React : bandeau éditorial terracotta avec le
/// logo et les arguments de l'espace, puis carte blanche contenant le
/// formulaire, et pied de page institutionnel.
class AuthLayout extends StatelessWidget {
  const AuthLayout({super.key, required this.variant, required this.child});

  final AuthVariant variant;
  final Widget child;

  _AuthCopy get _copy {
    switch (variant) {
      case AuthVariant.student:
        return const _AuthCopy(
          badge: 'ESSECT • Montfleury',
          headline:
              'Sauvez des repas délicieux à prix étudiant autour de l’ESSECT.',
          description:
              'Réservez les invendus du jour auprès des restaurants et '
              'cafétérias partenaires à proximité du campus, payez en ligne en '
              'toute sécurité et récupérez votre commande avec votre QR Code.',
          bullets: <_AuthBullet>[
            _AuthBullet(
              icon: Icons.sell_outlined,
              color: AppColors.green,
              text:
                  'Des prix réduits sur les plats et viennoiseries invendus du jour',
            ),
            _AuthBullet(
              icon: Icons.qr_code_2,
              color: AppColors.orange,
              text: 'Retrait rapide sans attente par QR Code unique',
            ),
          ],
          footer:
              'CampusSave © 2026 • Projet Intégrateur 3ème année Business Computing – ESSECT Tunis',
        );
      case AuthVariant.merchant:
        return const _AuthCopy(
          badge: 'Portail Commerçant • ESSECT',
          headline: 'Valorisez vos invendus auprès des étudiants de l’ESSECT.',
          description:
              'Publiez vos produits alimentaires invendus en quelques clics, '
              'recevez des réservations payées d’avance et validez le retrait '
              'par scan QR Code.',
          bullets: <_AuthBullet>[
            _AuthBullet(
              icon: Icons.verified_user_outlined,
              color: AppColors.green,
              text: 'Établissements vérifiés par l’administration CampusSave',
            ),
            _AuthBullet(
              icon: Icons.qr_code_2,
              color: AppColors.orange,
              text: 'Validation rapide au comptoir par QR Code sécurisé',
            ),
          ],
          footer:
              'CampusSave © 2026 • Espace Commerçant Partenaire — ESSECT Montfleury, Tunis',
        );
      case AuthVariant.admin:
        return const _AuthCopy(
          badge: 'Administration • ESSECT',
          headline: 'Supervision & Gouvernance de la plateforme.',
          description:
              'Espace réservé aux administrateurs CampusSave pour la gestion des '
              'utilisateurs, la validation des restaurants et cafétérias '
              'partenaires autour de l’ESSECT et le suivi global de l’activité.',
          bullets: <_AuthBullet>[
            _AuthBullet(
              icon: Icons.shield_outlined,
              color: AppColors.gold,
              text: 'Contrôle d’accès sécurisé par rôle (RBAC)',
            ),
            _AuthBullet(
              icon: Icons.storefront_outlined,
              color: AppColors.gold,
              text: 'Validation obligatoire des établissements partenaires',
            ),
          ],
          footer:
              'CampusSave © 2026 • Portail Administration — ESSECT Montfleury, Tunis',
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    final copy = _copy;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              InkWell(
                onTap: () => AppRouter.switchTo(context, Routes.landing),
                borderRadius: AppRadii.rLg,
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.chevron_left,
                        size: 16,
                        color: AppColors.stone500,
                      ),
                      const SizedBox(width: 2),
                      Text(
                        'Retour à l’accueil',
                        style: AppText.xs(
                          weight: FontWeight.w700,
                          color: AppColors.stone500,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: AppRadii.rXl3,
                  border: Border.all(color: AppColors.goldSoft(0.6)),
                  boxShadow: AppShadows.xl,
                ),
                clipBehavior: Clip.antiAlias,
                child: Column(
                  children: [
                    _EditorialPanel(copy: copy),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 24, 20, 26),
                      child: child,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              Center(
                child: Text(
                  copy.footer,
                  textAlign: TextAlign.center,
                  style: AppText.t11(color: AppColors.stone500),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _AuthCopy {
  const _AuthCopy({
    required this.badge,
    required this.headline,
    required this.description,
    required this.bullets,
    required this.footer,
  });

  final String badge;
  final String headline;
  final String description;
  final List<_AuthBullet> bullets;
  final String footer;
}

class _AuthBullet {
  const _AuthBullet({
    required this.icon,
    required this.color,
    required this.text,
  });

  final IconData icon;
  final Color color;
  final String text;
}

class _EditorialPanel extends StatelessWidget {
  const _EditorialPanel({required this.copy});

  final _AuthCopy copy;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: AppColors.primary,
      padding: const EdgeInsets.fromLTRB(20, 22, 20, 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Pastille blanche contenant le logo officiel.
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: AppRadii.rXl2,
              boxShadow: AppShadows.sm,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const BrandLogo(height: 56),
                const SizedBox(height: 2),
                Text(
                  copy.badge,
                  style: AppText.t11(
                    weight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Text(
            copy.headline,
            style: AppText.xl2(
              weight: FontWeight.w800,
              color: Colors.white,
              height: 1.25,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            copy.description,
            style: AppText.sm(
              color: Colors.white.withValues(alpha: 0.85),
              height: 1.5,
            ),
          ),
          const SizedBox(height: 18),
          Container(height: 1, color: Colors.white.withValues(alpha: 0.2)),
          const SizedBox(height: 14),
          for (final bullet in copy.bullets)
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container(
                    width: 30,
                    height: 30,
                    decoration: BoxDecoration(
                      color: bullet.color,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(bullet.icon, size: 15, color: Colors.white),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      bullet.text,
                      style: AppText.xs(color: Colors.white, height: 1.4),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
