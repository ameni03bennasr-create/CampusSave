import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text.dart';
import '../../data/models/merchant_models.dart';
import '../../routing/app_router.dart';
import '../../routing/route_names.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_inputs.dart';
import '../../widgets/cs_surfaces.dart';

/// Écran des paramètres de l'espace commerçant.
///
/// Gère les préférences de notification, le statut d'ouverture de l'établissement
/// et la fermeture de session.
class MerchantSettingsScreen extends StatefulWidget {
  const MerchantSettingsScreen({super.key});

  @override
  State<MerchantSettingsScreen> createState() => _MerchantSettingsScreenState();
}

class _MerchantSettingsScreenState extends State<MerchantSettingsScreen> {
  late bool _newReservations;
  late bool _paidOrders;
  late bool _lowStock;
  bool _isOpen = true;

  @override
  void initState() {
    super.initState();
    final prefs = AppScope.read(context).merchant.profile.notificationsPrefs;
    _newReservations = prefs.newReservations;
    _paidOrders = prefs.paidOrders;
    _lowStock = prefs.lowStock;
  }

  void _updatePrefs() {
    AppScope.read(context).merchant.updateProfile(
      prefs: MerchantNotificationPrefs(
        newReservations: _newReservations,
        paidOrders: _paidOrders,
        lowStock: _lowStock,
      ),
    );
    CsToast.show(context, 'Préférences enregistrées.');
  }

  @override
  Widget build(BuildContext context) {
    final workspace = AppScope.of(context).merchant;
    final profile = workspace.profile;
    final establishment = workspace.establishment;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PageHeader(
          title: 'Paramètres',
          subtitle: 'Gérez vos alertes, votre disponibilité et votre compte.',
        ),
        const SizedBox(height: 16),

        // --- Résumé du compte ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Compte commerçant',
                style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
              ),
              const SizedBox(height: 8),
              Text(
                profile.fullName.isEmpty ? establishment.name : profile.fullName,
                style: AppText.base(weight: FontWeight.w800, color: AppColors.stone900),
              ),
              const SizedBox(height: 2),
              Text(
                profile.email.isEmpty ? establishment.email : profile.email,
                style: AppText.xs(color: AppColors.stone500),
              ),
              const SizedBox(height: 10),
              CsInfoRow(
                label: 'Établissement',
                value: establishment.name,
              ),
              CsInfoRow(
                label: 'Statut validation',
                value: establishment.adminValidated ? 'Validé' : 'En attente',
                valueColor: establishment.adminValidated ? AppColors.green : AppColors.orange,
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Disponibilité du commerce ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Disponibilité en direct',
                style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
              ),
              const SizedBox(height: 10),
              CsSwitchRow(
                title: 'Commerce ouvert aux retraits',
                subtitle: 'Permet aux étudiants de réserver vos offres actives',
                value: _isOpen,
                icon: Icons.storefront,
                onChanged: (val) {
                  setState(() => _isOpen = val);
                  CsToast.show(
                    context,
                    val ? 'Commerce marqué comme ouvert.' : 'Commerce temporairement fermé.',
                  );
                },
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Notifications ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Préférences de notifications',
                style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
              ),
              const SizedBox(height: 10),
              CsSwitchRow(
                title: 'Nouvelles réservations',
                subtitle: 'Alerte instantanée lors d’une réservation',
                value: _newReservations,
                icon: Icons.shopping_bag_outlined,
                onChanged: (val) {
                  setState(() => _newReservations = val);
                  _updatePrefs();
                },
              ),
              const Divider(height: 18),
              CsSwitchRow(
                title: 'Paiements confirmés',
                subtitle: 'Alerte dès qu’un paiement client est validé',
                value: _paidOrders,
                icon: Icons.check_circle_outline,
                onChanged: (val) {
                  setState(() => _paidOrders = val);
                  _updatePrefs();
                },
              ),
              const Divider(height: 18),
              CsSwitchRow(
                title: 'Alerte stock faible',
                subtitle: 'Notification lorsqu’une offre a 2 portions ou moins',
                value: _lowStock,
                icon: Icons.warning_amber_outlined,
                onChanged: (val) {
                  setState(() => _lowStock = val);
                  _updatePrefs();
                },
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // --- Déconnexion ---
        CsButton(
          label: 'Fermer la session commerçant',
          variant: CsButtonVariant.danger,
          size: CsButtonSize.regular,
          expand: true,
          icon: Icons.logout,
          onPressed: () {
            AppScope.read(context).auth.signOut();
            CsToast.show(context, 'Session commerçant fermée.');
            AppRouter.switchTo(context, Routes.merchantLogin);
          },
        ),
      ],
    );
  }
}
