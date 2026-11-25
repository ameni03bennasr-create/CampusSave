import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text.dart';
import '../../data/models/user_role.dart';
import '../../routing/app_router.dart';
import '../../routing/route_names.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_inputs.dart';

/// Écran de connexion administrateur.
///
/// Sécurisé : aucun lien d'inscription publique, aucun identifiant par défaut.
/// Connecté à [AuthController.signIn] avec le rôle [UserRole.admin].
class AdminLoginScreen extends StatefulWidget {
  const AdminLoginScreen({super.key});

  @override
  State<AdminLoginScreen> createState() => _AdminLoginScreenState();
}

class _AdminLoginScreenState extends State<AdminLoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    FocusScope.of(context).unfocus();

    if (!_formKey.currentState!.validate()) return;

    final auth = AppScope.read(context).auth;
    auth.clearError();

    final success = await auth.signIn(
      role: UserRole.admin,
      email: _emailController.text.trim(),
      password: _passwordController.text,
    );

    if (!mounted) return;

    if (success) {
      AppRouter.switchTo(context, Routes.adminDashboard);
    } else if (auth.error != null) {
      CsToast.show(context, auth.error!);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = AppScope.of(context).auth;

    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 420),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(22),
                  ),
                  child: const Icon(
                    Icons.admin_panel_settings_outlined,
                    color: Colors.white,
                    size: 38,
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'Administration CampusSave',
                textAlign: TextAlign.center,
                style: AppText.xl2(weight: FontWeight.w800, color: AppColors.stone900),
              ),
              const SizedBox(height: 6),
              Text(
                'Supervision globale de la plateforme, des commerces et des utilisateurs.',
                textAlign: TextAlign.center,
                style: AppText.sm(color: AppColors.stone500),
              ),
              const SizedBox(height: 24),

              if (auth.error != null) ...[
                CsAlert(message: auth.error!),
                const SizedBox(height: 16),
              ],

              CsTextField(
                label: 'IDENTIFIANT ADMINISTRATEUR (EMAIL)',
                hint: 'admin@campussave.tn',
                controller: _emailController,
                icon: Icons.shield_outlined,
                keyboardType: TextInputType.emailAddress,
                enabled: !auth.isBusy,
                validator: (v) {
                  if (v == null || v.trim().isEmpty) {
                    return 'Veuillez saisir votre adresse e-mail.';
                  }
                  if (!v.contains('@')) {
                    return 'Adresse e-mail invalide.';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 14),

              CsTextField(
                label: 'MOT DE PASSE',
                hint: 'Mot de passe sécurisé',
                controller: _passwordController,
                icon: Icons.lock_outline,
                obscure: _obscurePassword,
                enabled: !auth.isBusy,
                onSubmitted: (_) => _login(),
                suffix: IconButton(
                  icon: Icon(
                    _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                    size: 18,
                    color: AppColors.stone400,
                  ),
                  onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                ),
                validator: (v) {
                  if (v == null || v.isEmpty) {
                    return 'Veuillez saisir votre mot de passe.';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 22),

              CsButton(
                label: 'Accéder au panneau d’administration',
                variant: CsButtonVariant.primary,
                size: CsButtonSize.large,
                busy: auth.isBusy,
                expand: true,
                icon: Icons.lock_open_rounded,
                onPressed: _login,
              ),
              const SizedBox(height: 16),

              Text(
                'Accès strictement restreint au personnel habilité ESSECT.',
                textAlign: TextAlign.center,
                style: AppText.t11(color: AppColors.stone400),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
