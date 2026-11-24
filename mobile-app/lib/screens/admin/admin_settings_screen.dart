import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_style.dart';
import '../../core/theme/app_text.dart';
import '../../data/models/admin_models.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_inputs.dart';
import '../../widgets/cs_surfaces.dart';

/// Paramètres et préférences du compte administrateur (CampusSave Mobile).
///
/// Permet la mise à jour des coordonnées administratives et des alertes
/// de supervision via [AdminWorkspace.updateProfile].
class AdminSettingsScreen extends StatefulWidget {
  const AdminSettingsScreen({super.key});

  @override
  State<AdminSettingsScreen> createState() => _AdminSettingsScreenState();
}

class _AdminSettingsScreenState extends State<AdminSettingsScreen> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _nameController;
  late final TextEditingController _emailController;
  late final TextEditingController _phoneController;
  late final TextEditingController _departmentController;

  bool _alertNewMerchant = true;
  bool _alertFailedPayments = true;
  bool _dailyDigest = false;

  @override
  void initState() {
    super.initState();
    final profile = AppScope.read(context).admin.profile;

    _nameController = TextEditingController(text: profile.fullName);
    _emailController = TextEditingController(text: profile.email);
    _phoneController = TextEditingController(text: profile.phone);
    _departmentController = TextEditingController(text: profile.department);

    _alertNewMerchant = profile.preferences.alertNewMerchant;
    _alertFailedPayments = profile.preferences.alertFailedPayments;
    _dailyDigest = profile.preferences.dailyDigest;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _departmentController.dispose();
    super.dispose();
  }

  void _saveSettings() {
    if (!_formKey.currentState!.validate()) return;

    final admin = AppScope.read(context).admin;

    admin.updateProfile(
      fullName: _nameController.text.trim(),
      email: _emailController.text.trim(),
      phone: _phoneController.text.trim(),
      department: _departmentController.text.trim(),
      preferences: AdminPreferences(
        alertNewMerchant: _alertNewMerchant,
        alertFailedPayments: _alertFailedPayments,
        dailyDigest: _dailyDigest,
      ),
    );

    CsToast.show(context, 'Paramètres enregistrés avec succès.');
  }

  @override
  Widget build(BuildContext context) {
    final profile = AppScope.of(context).admin.profile;

    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          PageHeader(
            title: 'Paramètres',
            eyebrow: 'ADMINISTRATION',
            subtitle:
                'Gérez les informations de contact et les alertes de la plateforme.',
          ),
          const SizedBox(height: 16),

          // --- Fiche de synthèse profil ---
          CsCard(
            padding: const EdgeInsets.all(18),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundColor: AppColors.primarySoft(),
                  child: Text(
                    profile.fullName.trim().isNotEmpty
                        ? profile.fullName.trim()[0].toUpperCase()
                        : 'A',
                    style: AppText.lg(
                      weight: FontWeight.w900,
                      color: AppColors.primary,
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        profile.fullName.isNotEmpty
                            ? profile.fullName
                            : 'Administrateur CampusSave',
                        style: AppText.sm(
                          weight: FontWeight.w800,
                          color: AppColors.stone900,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        profile.email,
                        style: AppText.t11(color: AppColors.stone500),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Département : ${profile.department.isNotEmpty ? profile.department : 'Direction ESSECT'}',
                        style: AppText.t10(
                          weight: FontWeight.w600,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // --- Coordonnées personnelles ---
          CsCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Coordonnées administratives',
                  style: AppText.t10(
                    weight: FontWeight.w800,
                    color: AppColors.stone400,
                  ),
                ),
                const SizedBox(height: 14),
                CsTextField(
                  label: 'NOM COMPLET',
                  hint: 'Nom et prénom du responsable',
                  controller: _nameController,
                  icon: Icons.person_outline,
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) {
                      return 'Veuillez saisir votre nom.';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),
                CsTextField(
                  label: 'ADRESSE E-MAIL INSTITUTIONNELLE',
                  hint: 'admin@essect.u-tunis.tn',
                  controller: _emailController,
                  icon: Icons.email_outlined,
                  keyboardType: TextInputType.emailAddress,
                  validator: (v) {
                    if (v == null || !v.contains('@')) {
                      return 'Adresse e-mail invalide.';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),
                CsTextField(
                  label: 'TÉLÉPHONE DIRECT',
                  hint: '+216 71 000 000',
                  controller: _phoneController,
                  icon: Icons.phone_outlined,
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 12),
                CsTextField(
                  label: 'SERVICE / DÉPARTEMENT',
                  hint: 'Direction des études / Vie étudiante',
                  controller: _departmentController,
                  icon: Icons.business_outlined,
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // --- Préférences de notification ---
          CsCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Alertes de supervision',
                  style: AppText.t10(
                    weight: FontWeight.w800,
                    color: AppColors.stone400,
                  ),
                ),
                const SizedBox(height: 10),
                SwitchListTile.adaptive(
                  contentPadding: EdgeInsets.zero,
                  activeColor: AppColors.green,
                  title: Text(
                    'Candidatures commerçants',
                    style: AppText.xs(
                      weight: FontWeight.w700,
                      color: AppColors.stone900,
                    ),
                  ),
                  subtitle: Text(
                    'Alerte immédiate lors d’une nouvelle inscription d’établissement.',
                    style: AppText.t10(color: AppColors.stone500),
                  ),
                  value: _alertNewMerchant,
                  onChanged: (val) => setState(() => _alertNewMerchant = val),
                ),
                const Divider(height: 12),
                SwitchListTile.adaptive(
                  contentPadding: EdgeInsets.zero,
                  activeColor: AppColors.green,
                  title: Text(
                    'Paiements contestés ou échoués',
                    style: AppText.xs(
                      weight: FontWeight.w700,
                      color: AppColors.stone900,
                    ),
                  ),
                  subtitle: Text(
                    'Signalement immédiat en cas d’anomalie sur une transaction bancaire.',
                    style: AppText.t10(color: AppColors.stone500),
                  ),
                  value: _alertFailedPayments,
                  onChanged: (val) =>
                      setState(() => _alertFailedPayments = val),
                ),
                const Divider(height: 12),
                SwitchListTile.adaptive(
                  contentPadding: EdgeInsets.zero,
                  activeColor: AppColors.green,
                  title: Text(
                    'Rapport quotidien récapitulatif',
                    style: AppText.xs(
                      weight: FontWeight.w700,
                      color: AppColors.stone900,
                    ),
                  ),
                  subtitle: Text(
                    'Synthèse par email des commandes et de l’impact anti-gaspillage.',
                    style: AppText.t10(color: AppColors.stone500),
                  ),
                  value: _dailyDigest,
                  onChanged: (val) => setState(() => _dailyDigest = val),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // --- Sécurité et accréditation ---
          CsCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Sécurité des accès',
                  style: AppText.t10(
                    weight: FontWeight.w800,
                    color: AppColors.stone400,
                  ),
                ),
                const SizedBox(height: 12),
                CsInfoRow(
                  label: 'Rôle d’accréditation',
                  value: profile.role.isNotEmpty
                      ? profile.role
                      : 'Administrateur Principal',
                ),
                const Divider(height: 18),
                CsInfoRow(
                  label: 'Identifiant système',
                  value: profile.id.isNotEmpty ? profile.id : 'ADMIN-ESSECT-01',
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.stone100,
                    borderRadius: AppRadii.rLg,
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.shield_outlined,
                        size: 16,
                        color: AppColors.primary,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Les comptes administrateurs sont strictement provisionnés par l’administration de l’ESSECT Tunis.',
                          style: AppText.t10(color: AppColors.stone600),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // --- Bouton d'enregistrement ---
          CsButton(
            label: 'Enregistrer les paramètres',
            variant: CsButtonVariant.primary,
            expand: true,
            onPressed: _saveSettings,
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
