import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text.dart';
import '../../data/models/user_role.dart';
import '../../routing/app_router.dart';
import '../../routing/route_names.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_inputs.dart';

class StudentLoginScreen extends StatefulWidget {
  const StudentLoginScreen({super.key});

  @override
  State<StudentLoginScreen> createState() => _StudentLoginScreenState();
}

class _StudentLoginScreenState extends State<StudentLoginScreen> {
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

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final auth = AppScope.read(context).auth;
    auth.clearError();

    final success = await auth.signIn(
      role: UserRole.student,
      email: _emailController.text.trim(),
      password: _passwordController.text,
    );

    if (!mounted) return;

    if (success) {
      AppRouter.switchTo(context, Routes.studentHome);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = AppScope.of(context).auth;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(8),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 420),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Icon(
                  Icons.school_rounded,
                  size: 42,
                  color: AppColors.primary,
                ),
                const SizedBox(height: 12),
                Text(
                  'Bienvenue étudiant !',
                  textAlign: TextAlign.center,
                  style: AppText.xl(
                    weight: FontWeight.w800,
                    color: AppColors.stone900,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Connectez-vous pour découvrir les offres près de votre campus.',
                  textAlign: TextAlign.center,
                  style: AppText.sm(color: AppColors.stone500),
                ),
                const SizedBox(height: 28),
                CsTextField(
                  label: 'ADRESSE EMAIL',
                  hint: 'exemple@email.com',
                  controller: _emailController,
                  icon: Icons.email_outlined,
                  keyboardType: TextInputType.emailAddress,
                  textInputAction: TextInputAction.next,
                  enabled: !auth.isBusy,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Veuillez saisir votre adresse email.';
                    }
                    if (!value.contains('@') || !value.contains('.')) {
                      return 'Veuillez saisir une adresse email valide.';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),
                CsTextField(
                  label: 'MOT DE PASSE',
                  hint: 'Votre mot de passe',
                  controller: _passwordController,
                  icon: Icons.lock_outline,
                  obscure: _obscurePassword,
                  textInputAction: TextInputAction.done,
                  enabled: !auth.isBusy,
                  onSubmitted: (_) => _submit(),
                  suffix: IconButton(
                    tooltip: _obscurePassword
                        ? 'Afficher le mot de passe'
                        : 'Masquer le mot de passe',
                    onPressed: auth.isBusy
                        ? null
                        : () {
                            setState(() {
                              _obscurePassword = !_obscurePassword;
                            });
                          },
                    icon: Icon(
                      _obscurePassword
                          ? Icons.visibility_outlined
                          : Icons.visibility_off_outlined,
                      color: AppColors.stone500,
                      size: 19,
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Veuillez saisir votre mot de passe.';
                    }
                    return null;
                  },
                ),
                if (auth.error != null) ...[
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.red50,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.red200),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.error_outline,
                          color: AppColors.red700,
                          size: 18,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            auth.error!,
                            style: AppText.sm(color: AppColors.red700),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: 24),
                CsButton(
                  label: 'Se connecter',
                  icon: Icons.login_rounded,
                  expand: true,
                  size: CsButtonSize.large,
                  busy: auth.isBusy,
                  onPressed: _submit,
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Pas encore de compte ? ',
                      style: AppText.sm(color: AppColors.stone600),
                    ),
                    TextButton(
                      onPressed: auth.isBusy
                          ? null
                          : () {
                              AppRouter.push(context, Routes.studentRegister);
                            },
                      child: Text(
                        'Créer un compte',
                        style: AppText.sm(
                          weight: FontWeight.w800,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
