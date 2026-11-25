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

/// Demande d'inscription commerçant (soumission en validation administrateur).
///
/// Relié à [AuthController.requestMerchantAccount].
class MerchantRegisterScreen extends StatefulWidget {
  const MerchantRegisterScreen({super.key});

  @override
  State<MerchantRegisterScreen> createState() => _MerchantRegisterScreenState();
}

class _MerchantRegisterScreenState extends State<MerchantRegisterScreen> {
  final _formKey = GlobalKey<FormState>();

  final _establishmentController = TextEditingController();
  final _ownerController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  String _establishmentType = 'Restaurant';
  bool _obscurePassword = true;
  bool _obscureConfirm = true;
  bool _acceptTerms = false;

  static const List<String> _types = [
    'Restaurant',
    'Boulangerie',
    'Pâtisserie',
    'Snack & Fast-food',
    'Cafétéria',
    'Autre commerce alimentaire',
  ];

  @override
  void dispose() {
    _establishmentController.dispose();
    _ownerController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (!_acceptTerms) {
      CsToast.show(context, 'Veuillez accepter les conditions d’utilisation.');
      return;
    }

    final auth = AppScope.read(context).auth;
    auth.clearError();

    final form = MerchantRegistrationForm(
      establishmentName: _establishmentController.text.trim(),
      merchantFullName: _ownerController.text.trim(),
      email: _emailController.text.trim(),
      phone: _phoneController.text.trim(),
      password: _passwordController.text,
      confirmPassword: _confirmPasswordController.text,
      address: _addressController.text.trim(),
      establishmentType: _establishmentType,
    );

    final success = await auth.requestMerchantAccount(form);

    if (!mounted) return;

    if (success) {
      CsToast.show(
        context,
        'Demande enregistrée avec succès. Votre compte est en attente de validation.',
      );
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
          constraints: const BoxConstraints(maxWidth: 440),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Center(
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppColors.orange.withValues(alpha: 0.12),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.storefront_outlined,
                      color: AppColors.orange,
                      size: 34,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Devenir Partenaire CampusSave',
                  textAlign: TextAlign.center,
                  style: AppText.xl(weight: FontWeight.w800, color: AppColors.stone900),
                ),
                const SizedBox(height: 6),
                Text(
                  'Déposez votre demande de partenariat pour valoriser vos surplus alimentaires auprès des étudiants de l’ESSECT.',
                  textAlign: TextAlign.center,
                  style: AppText.xs(color: AppColors.stone500, height: 1.4),
                ),
                const SizedBox(height: 24),

                if (auth.error != null) ...[
                  CsAlert(message: auth.error!),
                  const SizedBox(height: 16),
                ],

                CsTextField(
                  label: 'NOM DE L’ÉTABLISSEMENT',
                  hint: 'Ex: Boulangerie Le Délice',
                  controller: _establishmentController,
                  icon: Icons.store_outlined,
                  enabled: !auth.isBusy,
                  validator: (v) {
                    if (v == null || v.trim().length < 2) {
                      return 'Veuillez saisir le nom de votre établissement.';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),

                CsDropdownField<String>(
                  label: 'TYPE D’ÉTABLISSEMENT',
                  value: _establishmentType,
                  items: _types
                      .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                      .toList(),
                  onChanged: auth.isBusy ? null : (v) {
                    if (v != null) setState(() => _establishmentType = v);
                  },
                ),
                const SizedBox(height: 12),

                CsTextField(
                  label: 'NOM ET PRÉNOM DU RESPONSABLE',
                  hint: 'Responsable légal ou gérant',
                  controller: _ownerController,
                  icon: Icons.person_outline,
                  enabled: !auth.isBusy,
                  validator: (v) {
                    if (v == null || v.trim().length < 3) {
                      return 'Veuillez saisir le nom complet du responsable.';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),

                CsTextField(
                  label: 'ADRESSE E-MAIL PROFESSIONNELLE',
                  hint: 'contact@etablissement.tn',
                  controller: _emailController,
                  icon: Icons.email_outlined,
                  keyboardType: TextInputType.emailAddress,
                  enabled: !auth.isBusy,
                  validator: (v) {
                    if (v == null || !v.contains('@')) {
                      return 'Adresse e-mail invalide.';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),

                CsTextField(
                  label: 'NUMÉRO DE TÉLÉPHONE',
                  hint: 'XX XXX XXX',
                  controller: _phoneController,
                  icon: Icons.phone_outlined,
                  keyboardType: TextInputType.phone,
                  enabled: !auth.isBusy,
                  validator: (v) {
                    if (v == null || v.trim().length < 8) {
                      return 'Numéro de téléphone invalide (8 chiffres).';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),

                CsTextField(
                  label: 'ADRESSE (PROCHE ESSECT)',
                  hint: 'Rue, quartier (Montfleury / Bab Alioua / Tunis)',
                  controller: _addressController,
                  icon: Icons.location_on_outlined,
                  enabled: !auth.isBusy,
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) {
                      return 'Veuillez préciser l’adresse de l’établissement.';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),

                CsTextField(
                  label: 'MOT DE PASSE',
                  hint: 'Au moins 8 caractères',
                  controller: _passwordController,
                  icon: Icons.lock_outline,
                  obscure: _obscurePassword,
                  enabled: !auth.isBusy,
                  suffix: IconButton(
                    icon: Icon(
                      _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                      size: 18,
                      color: AppColors.stone400,
                    ),
                    onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                  ),
                  validator: (v) {
                    if (v == null || v.length < 8) {
                      return 'Le mot de passe doit contenir au moins 8 caractères.';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),

                CsTextField(
                  label: 'CONFIRMATION DU MOT DE PASSE',
                  hint: 'Répétez votre mot de passe',
                  controller: _confirmPasswordController,
                  icon: Icons.lock_outline,
                  obscure: _obscureConfirm,
                  enabled: !auth.isBusy,
                  suffix: IconButton(
                    icon: Icon(
                      _obscureConfirm ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                      size: 18,
                      color: AppColors.stone400,
                    ),
                    onPressed: () => setState(() => _obscureConfirm = !_obscureConfirm),
                  ),
                  validator: (v) {
                    if (v != _passwordController.text) {
                      return 'Les mots de passe ne correspondent pas.';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 14),

                InkWell(
                  onTap: () => setState(() => _acceptTerms = !_acceptTerms),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Checkbox(
                        value: _acceptTerms,
                        activeColor: AppColors.green,
                        onChanged: (val) => setState(() => _acceptTerms = val ?? false),
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: Text(
                            'J’atteste de l’exactitude des informations fournies et accepte la charte qualité alimentaire de la plateforme.',
                            style: AppText.t11(color: AppColors.stone600, height: 1.4),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                CsButton(
                  label: 'Déposer ma demande de partenariat',
                  variant: CsButtonVariant.primary,
                  size: CsButtonSize.large,
                  busy: auth.isBusy,
                  expand: true,
                  onPressed: _submit,
                ),
                const SizedBox(height: 16),

                Center(
                  child: CsTextLink(
                    label: 'Déjà inscrit ? Se connecter',
                    onPressed: () => AppRouter.switchTo(context, Routes.merchantLogin),
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
