import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text.dart';
import '../../routing/app_router.dart';
import '../../routing/route_names.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_badges.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_inputs.dart';
import '../../widgets/cs_surfaces.dart';
import '../../widgets/safe_image.dart';

/// Écran « Mon profil » de l'espace étudiant.
///
/// Permet la consultation et la mise à jour des coordonnées personnelles et
/// académiques de l'étudiant via [StudentWorkspace.updateProfile].
class StudentProfileScreen extends StatefulWidget {
  const StudentProfileScreen({super.key});

  @override
  State<StudentProfileScreen> createState() => _StudentProfileScreenState();
}

class _StudentProfileScreenState extends State<StudentProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _emailController;
  late final TextEditingController _phoneController;
  late final TextEditingController _filiereController;
  late final TextEditingController _etablissementController;

  bool _isEditing = false;

  @override
  void initState() {
    super.initState();
    final profile = AppScope.read(context).student.profile;
    _nameController = TextEditingController(text: profile.fullName);
    _emailController = TextEditingController(text: profile.email);
    _phoneController = TextEditingController(text: profile.phone);
    _filiereController = TextEditingController(text: profile.filiere);
    _etablissementController = TextEditingController(
      text: profile.etablissement.isEmpty ? 'ESSECT Montfleury' : profile.etablissement,
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _filiereController.dispose();
    _etablissementController.dispose();
    super.dispose();
  }

  void _saveProfile() {
    if (!_formKey.currentState!.validate()) return;

    AppScope.read(context).student.updateProfile(
      fullName: _nameController.text.trim(),
      email: _emailController.text.trim(),
      phone: _phoneController.text.trim(),
      filiere: _filiereController.text.trim(),
      etablissement: _etablissementController.text.trim(),
    );

    setState(() => _isEditing = false);
    CsToast.show(context, 'Profil mis à jour avec succès.');
  }

  @override
  Widget build(BuildContext context) {
    final student = AppScope.of(context).student;
    final profile = student.profile;

    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          PageHeader(
            title: 'Mon profil',
            subtitle: 'Gérez vos informations personnelles et votre compte ESSECT.',
            trailing: CsButton(
              label: _isEditing ? 'Annuler' : 'Modifier',
              variant: _isEditing ? CsButtonVariant.ghost : CsButtonVariant.secondary,
              size: CsButtonSize.small,
              onPressed: () {
                setState(() {
                  if (_isEditing) {
                    _nameController.text = profile.fullName;
                    _emailController.text = profile.email;
                    _phoneController.text = profile.phone;
                    _filiereController.text = profile.filiere;
                  }
                  _isEditing = !_isEditing;
                });
              },
            ),
          ),
          const SizedBox(height: 16),

          // --- En-tête profil (Avatar + Nom + Points) ---
          CsCard(
            padding: const EdgeInsets.all(18),
            child: Row(
              children: [
                Avatar(
                  src: profile.avatar,
                  name: profile.fullName,
                  size: 54,
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        profile.fullName.isEmpty ? 'Étudiant CampusSave' : profile.fullName,
                        style: AppText.base(weight: FontWeight.w800, color: AppColors.stone900),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        profile.email,
                        style: AppText.xs(color: AppColors.stone500),
                      ),
                      const SizedBox(height: 6),
                      CsPill(
                        label: '${profile.ecoPoints} EcoPoints',
                        background: AppColors.greenSoft(0.15),
                        foreground: AppColors.green,
                        icon: Icons.eco_outlined,
                        dense: true,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // --- Informations personnelles ---
          CsCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Coordonnées personnelles',
                  style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
                ),
                const SizedBox(height: 14),
                CsTextField(
                  label: 'NOM COMPLET',
                  hint: 'Votre nom complet',
                  controller: _nameController,
                  enabled: _isEditing,
                  icon: Icons.person_outline,
                  validator: (v) {
                    if (v == null || v.trim().length < 3) {
                      return 'Veuillez saisir votre nom complet.';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),
                CsTextField(
                  label: 'ADRESSE E-MAIL',
                  hint: 'etudiant@email.com',
                  controller: _emailController,
                  enabled: _isEditing,
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
                  label: 'TÉLÉPHONE',
                  hint: 'XX XXX XXX',
                  controller: _phoneController,
                  enabled: _isEditing,
                  icon: Icons.phone_outlined,
                  keyboardType: TextInputType.phone,
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // --- Informations académiques ---
          CsCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Filière & Établissement',
                  style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
                ),
                const SizedBox(height: 14),
                CsTextField(
                  label: 'FILIÈRE',
                  hint: 'Ex: Business Computing',
                  controller: _filiereController,
                  enabled: _isEditing,
                  icon: Icons.school_outlined,
                ),
                const SizedBox(height: 12),
                CsTextField(
                  label: 'ÉTABLISSEMENT',
                  hint: 'ESSECT Montfleury',
                  controller: _etablissementController,
                  enabled: _isEditing,
                  icon: Icons.account_balance_outlined,
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          if (_isEditing) ...[
            CsButton(
              label: 'Enregistrer les modifications',
              variant: CsButtonVariant.primary,
              size: CsButtonSize.large,
              expand: true,
              icon: Icons.save_outlined,
              onPressed: _saveProfile,
            ),
            const SizedBox(height: 12),
          ],

          // --- Déconnexion ---
          CsButton(
            label: 'Se déconnecter',
            variant: CsButtonVariant.danger,
            size: CsButtonSize.regular,
            expand: true,
            icon: Icons.logout,
            onPressed: () {
              AppScope.read(context).auth.signOut();
              CsToast.show(context, 'Session fermée.');
              AppRouter.switchTo(context, Routes.studentLogin);
            },
          ),
        ],
      ),
    );
  }
}
