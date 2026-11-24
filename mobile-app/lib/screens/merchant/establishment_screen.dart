import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_badges.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_inputs.dart';
import '../../widgets/cs_surfaces.dart';

/// Gestion de l'établissement commerçant.
///
/// Relié à [MerchantWorkspace.establishment] et [MerchantWorkspace.updateEstablishment].
class EstablishmentScreen extends StatefulWidget {
  const EstablishmentScreen({super.key});

  @override
  State<EstablishmentScreen> createState() => _EstablishmentScreenState();
}

class _EstablishmentScreenState extends State<EstablishmentScreen> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _nameController;
  late final TextEditingController _typeController;
  late final TextEditingController _addressController;
  late final TextEditingController _phoneController;
  late final TextEditingController _emailController;
  late final TextEditingController _descriptionController;
  late final TextEditingController _hoursController;

  bool _isEditing = false;

  @override
  void initState() {
    super.initState();
    final est = AppScope.read(context).merchant.establishment;
    _nameController = TextEditingController(text: est.name);
    _typeController = TextEditingController(text: est.type);
    _addressController = TextEditingController(text: est.address);
    _phoneController = TextEditingController(text: est.phone);
    _emailController = TextEditingController(text: est.email);
    _descriptionController = TextEditingController(text: est.description);
    _hoursController = TextEditingController(text: est.openingHours);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _typeController.dispose();
    _addressController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _descriptionController.dispose();
    _hoursController.dispose();
    super.dispose();
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;

    AppScope.read(context).merchant.updateEstablishment(
      name: _nameController.text.trim(),
      type: _typeController.text.trim(),
      address: _addressController.text.trim(),
      phone: _phoneController.text.trim(),
      email: _emailController.text.trim(),
      description: _descriptionController.text.trim(),
      openingHours: _hoursController.text.trim(),
    );

    setState(() => _isEditing = false);
    CsToast.show(context, 'Informations de l’établissement enregistrées.');
  }

  @override
  Widget build(BuildContext context) {
    final workspace = AppScope.of(context).merchant;
    final establishment = workspace.establishment;

    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          PageHeader(
            title: 'Mon établissement',
            subtitle: 'Coordonnées, horaires et description de votre commerce.',
            trailing: CsButton(
              label: _isEditing ? 'Annuler' : 'Modifier',
              variant: _isEditing ? CsButtonVariant.ghost : CsButtonVariant.secondary,
              size: CsButtonSize.small,
              onPressed: () {
                setState(() {
                  if (_isEditing) {
                    _nameController.text = establishment.name;
                    _typeController.text = establishment.type;
                    _addressController.text = establishment.address;
                    _phoneController.text = establishment.phone;
                    _emailController.text = establishment.email;
                    _descriptionController.text = establishment.description;
                    _hoursController.text = establishment.openingHours;
                  }
                  _isEditing = !_isEditing;
                });
              },
            ),
          ),
          const SizedBox(height: 16),

          // --- Badge de validation ---
          CsCard(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(
                  establishment.adminValidated ? Icons.verified : Icons.pending_actions,
                  color: establishment.adminValidated ? AppColors.green : AppColors.orange,
                  size: 24,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        establishment.adminValidated
                            ? 'Établissement validé par l’administration'
                            : 'Dossier en cours d’examen',
                        style: AppText.xs(weight: FontWeight.w800, color: AppColors.stone900),
                      ),
                      Text(
                        establishment.adminValidated
                            ? 'Validé le ${establishment.validatedDate}. Vos offres sont en ligne.'
                            : 'Vos offres seront publiées aux étudiants dès validation.',
                        style: AppText.t11(color: AppColors.stone500),
                      ),
                    ],
                  ),
                ),
                ValidationStatusBadge(
                  status: establishment.adminValidated ? 'Validé' : 'En attente',
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // --- Coordonnées principales ---
          CsCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Informations générales',
                  style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
                ),
                const SizedBox(height: 12),
                CsTextField(
                  label: 'NOM DE L’ÉTABLISSEMENT',
                  hint: 'Boulangerie Le Délice',
                  controller: _nameController,
                  enabled: _isEditing,
                  icon: Icons.store_outlined,
                  validator: (v) => v == null || v.trim().isEmpty ? 'Ce champ est obligatoire.' : null,
                ),
                const SizedBox(height: 12),
                CsTextField(
                  label: 'CATÉGORIE / TYPE',
                  hint: 'Boulangerie, Restaurant, etc.',
                  controller: _typeController,
                  enabled: _isEditing,
                  icon: Icons.category_outlined,
                ),
                const SizedBox(height: 12),
                CsTextField(
                  label: 'ADRESSE',
                  hint: 'Montfleury, Tunis',
                  controller: _addressController,
                  enabled: _isEditing,
                  icon: Icons.location_on_outlined,
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // --- Contact & Horaires ---
          CsCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Contact et horaires de retrait',
                  style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
                ),
                const SizedBox(height: 12),
                CsTextField(
                  label: 'TÉLÉPHONE DU COMMERCE',
                  hint: '+216 XX XXX XXX',
                  controller: _phoneController,
                  enabled: _isEditing,
                  icon: Icons.phone_outlined,
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 12),
                CsTextField(
                  label: 'E-MAIL DE CONTACT',
                  hint: 'contact@commerce.tn',
                  controller: _emailController,
                  enabled: _isEditing,
                  icon: Icons.email_outlined,
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: 12),
                CsTextField(
                  label: 'HORAIRES D’OUVERTURE ET DE RETRAIT',
                  hint: 'Ex: 12:00 – 14:30 / 17:00 – 19:30',
                  controller: _hoursController,
                  enabled: _isEditing,
                  icon: Icons.access_time,
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // --- Description ---
          CsCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Présentation du commerce',
                  style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
                ),
                const SizedBox(height: 12),
                CsTextField(
                  label: 'DESCRIPTION PUBLIQUE',
                  hint: 'Décrivez votre établissement et votre engagement anti-gaspillage…',
                  controller: _descriptionController,
                  enabled: _isEditing,
                  maxLines: 3,
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          if (_isEditing)
            CsButton(
              label: 'Enregistrer les modifications',
              variant: CsButtonVariant.primary,
              size: CsButtonSize.large,
              expand: true,
              icon: Icons.save_outlined,
              onPressed: _save,
            ),
        ],
      ),
    );
  }
}
