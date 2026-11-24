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
import '../../widgets/cs_surfaces.dart';

/// Écran de connexion de l'espace commerçant.
///
/// Connecté à [AuthController.signIn] avec le rôle [UserRole.merchant].
class MerchantLoginScreen extends StatefulWidget {
  const MerchantLoginScreen({super.key});

  @override
  State<MerchantLoginScreen> createState() => _MerchantLoginScreenState();
}

class _MerchantLoginScreenState extends State<MerchantLoginScreen> {
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
    if (!_formKey.currentState!.validate()) return;

    final auth = AppScope.read(context).auth;
    auth.clearError();

    final success = await auth.signIn(
      role: UserRole.merchant,
      email: _emailController.text.trim(),
      password: _passwordController.text,
    );

    if (!mounted) return;

    if (success) {
      AppRouter.switchTo(context, Routes.merchantDashboard);
    } else if (auth.error != null) {
      CsToast.show(context, auth.error!);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = AppScope.of(context).auth;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Center(
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
                      color: AppColors.orange.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(22),
                    ),
                    child: const Icon(
                      Icons.storefront_rounded,
                      color: AppColors.orange,
                      size: 36,
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  'Espace Commerçant',
                  textAlign: TextAlign.center,
                  style: AppText.xl2(weight: FontWeight.w800, color: AppColors.stone900),
                ),
                const SizedBox(height: 6),
                Text(
                  'Connectez-vous pour publier vos offres et gérer vos retraits.',
                  textAlign: TextAlign.center,
                  style: AppText.sm(color: AppColors.stone500),
                ),
                const SizedBox(height: 24),

                if (auth.error != null) ...[
                  CsAlert(message: auth.error!),
                  const SizedBox(height: 16),
                ],

                CsTextField(
                  label: 'ADRESSE E-MAIL',
                  hint: 'contact@etablissement.tn',
                  controller: _emailController,
                  icon: Icons.email_outlined,
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
                  hint: 'Votre mot de passe',
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
                  label: 'Se connecter',
                  variant: CsButtonVariant.primary,
                  size: CsButtonSize.large,
                  busy: auth.isBusy,
                  expand: true,
                  onPressed: _login,
                ),
                const SizedBox(height: 16),

                Center(
                  child: CsTextLink(
                    label: 'Pas encore partenaire ? Déposer une demande',
                    onPressed: () => AppRouter.switchTo(context, Routes.merchantRegister),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
