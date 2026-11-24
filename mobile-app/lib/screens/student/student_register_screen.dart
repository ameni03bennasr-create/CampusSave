import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text.dart';
import '../../data/models/student_models.dart';
import '../../routing/app_router.dart';
import '../../routing/route_names.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_inputs.dart';

class StudentRegisterScreen extends StatefulWidget {
  const StudentRegisterScreen({super.key});

  @override
  State<StudentRegisterScreen> createState() => _StudentRegisterScreenState();
}

class _StudentRegisterScreenState extends State<StudentRegisterScreen> {
  final _formKey = GlobalKey<FormState>();

  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _filiereController = TextEditingController();
  final _anneeController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _filiereController.dispose();
    _anneeController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final auth = AppScope.read(context).auth;
    auth.clearError();

    final form = StudentRegistrationForm(
      fullName: _nameController.text.trim(),
      email: _emailController.text.trim(),
      phone: _phoneController.text.trim(),
      filiere: _filiereController.text.trim(),
      annee: _anneeController.text.trim(),
      password: _passwordController.text,
      confirmPassword: _confirmPasswordController.text,
    );

    final success = await auth.registerStudent(form);

    if (!mounted) return;

    if (success) {
      AppScope.read(context).student.applyRegistration(form);
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
                  Icons.person_add_alt_1_rounded,
                  size: 42,
                  color: AppColors.primary,
                ),
                const SizedBox(height: 12),
                Text(
                  'Créer votre compte étudiant',
                  textAlign: TextAlign.center,
                  style: AppText.xl(
                    weight: FontWeight.w800,
                    color: AppColors.stone900,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Rejoignez CampusSave et profitez des offres près de votre campus.',
                  textAlign: TextAlign.center,
                  style: AppText.sm(color: AppColors.stone500),
                ),
                const SizedBox(height: 26),

                CsTextField(
                  label: 'NOM ET PRÉNOM',
                  hint: 'Votre nom complet',
                  controller: _nameController,
                  icon: Icons.person_outline,
                  textInputAction: TextInputAction.next,
                  enabled: !auth.isBusy,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Veuillez saisir votre nom complet.';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

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
                const SizedBox(height: 16),

                CsTextField(
                  label: 'NUMÉRO DE TÉLÉPHONE',
                  hint: 'Votre numéro de téléphone',
                  controller: _phoneController,
                  icon: Icons.phone_outlined,
                  keyboardType: TextInputType.phone,
                  textInputAction: TextInputAction.next,
                  enabled: !auth.isBusy,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Veuillez saisir votre numéro de téléphone.';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                CsTextField(
                  label: 'FILIÈRE',
                  hint: 'Ex. : Informatique de gestion',
                  controller: _filiereController,
                  icon: Icons.school_outlined,
                  textInputAction: TextInputAction.next,
                  enabled: !auth.isBusy,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Veuillez saisir votre filière.';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                CsTextField(
                  label: 'ANNÉE D’ÉTUDE',
                  hint: 'Ex. : 1ère année, 2ème année...',
                  controller: _anneeController,
                  icon: Icons.calendar_today_outlined,
                  textInputAction: TextInputAction.next,
                  enabled: !auth.isBusy,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Veuillez saisir votre année d’étude.';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                CsTextField(
                  label: 'MOT DE PASSE',
                  hint: 'Créer un mot de passe',
                  controller: _passwordController,
                  icon: Icons.lock_outline,
                  obscure: _obscurePassword,
                  textInputAction: TextInputAction.next,
                  enabled: !auth.isBusy,
                  onChanged: (_) {
                    if (_confirmPasswordController.text.isNotEmpty) {
                      _formKey.currentState?.validate();
                    }
                  },
                  suffix: IconButton(
                    onPressed: () {
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
                      return 'Veuillez créer un mot de passe.';
                    }
                    if (value.length < 6) {
                      return 'Le mot de passe doit contenir au moins 6 caractères.';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                CsTextField(
                  label: 'CONFIRMER LE MOT DE PASSE',
                  hint: 'Retaper votre mot de passe',
                  controller: _confirmPasswordController,
                  icon: Icons.lock_outline,
                  obscure: _obscureConfirmPassword,
                  textInputAction: TextInputAction.done,
                  enabled: !auth.isBusy,
                  onSubmitted: (_) => _submit(),
                  suffix: IconButton(
                    onPressed: () {
                      setState(() {
                        _obscureConfirmPassword = !_obscureConfirmPassword;
                      });
                    },
                    icon: Icon(
                      _obscureConfirmPassword
                          ? Icons.visibility_outlined
                          : Icons.visibility_off_outlined,
                      color: AppColors.stone500,
                      size: 19,
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Veuillez confirmer votre mot de passe.';
                    }
                    if (value != _passwordController.text) {
                      return 'Les mots de passe ne correspondent pas.';
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
                  label: 'Créer mon compte',
                  icon: Icons.person_add_alt_1,
                  expand: true,
                  size: CsButtonSize.large,
                  busy: auth.isBusy,
                  onPressed: _submit,
                ),

                const SizedBox(height: 16),

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Vous avez déjà un compte ?',
                      style: AppText.sm(color: AppColors.stone600),
                    ),
                    TextButton(
                      onPressed: auth.isBusy
                          ? null
                          : () {
                              AppRouter.replace(context, Routes.studentLogin);
                            },
                      child: Text(
                        'Se connecter',
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
