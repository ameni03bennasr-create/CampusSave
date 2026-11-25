import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text.dart';
import '../../data/models/merchant_models.dart';
import '../../routing/app_router.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_inputs.dart';
import '../../widgets/cs_surfaces.dart';

/// Formulaire de création / modification d'une offre commerçant.
///
/// Connecté à [MerchantWorkspace.addOffer] et [MerchantWorkspace.updateOffer].
class MerchantOfferFormScreen extends StatefulWidget {
  const MerchantOfferFormScreen({super.key, this.offerId});

  final String? offerId;

  @override
  State<MerchantOfferFormScreen> createState() => _MerchantOfferFormScreenState();
}

class _MerchantOfferFormScreenState extends State<MerchantOfferFormScreen> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _nameController;
  late final TextEditingController _descriptionController;
  late final TextEditingController _initialPriceController;
  late final TextEditingController _reducedPriceController;
  late final TextEditingController _quantityController;
  late final TextEditingController _pickupStartController;
  late final TextEditingController _pickupEndController;
  late final TextEditingController _photoController;

  String _category = 'Paniers surprises';

  static const List<String> _categories = [
    'Paniers surprises',
    'Plats préparés',
    'Boulangerie',
    'Pâtisserie',
    'Sandwichs & Snacks',
    'Boissons',
  ];

  bool get _isEditing => widget.offerId != null;

  @override
  void initState() {
    super.initState();
    final workspace = AppScope.read(context).merchant;
    final existing = widget.offerId != null ? workspace.offerById(widget.offerId) : null;

    _nameController = TextEditingController(text: existing?.name ?? '');
    _descriptionController = TextEditingController(text: existing?.description ?? '');
    _initialPriceController = TextEditingController(
      text: existing != null ? existing.initialPrice.toStringAsFixed(2) : '',
    );
    _reducedPriceController = TextEditingController(
      text: existing != null ? existing.reducedPrice.toStringAsFixed(2) : '',
    );
    _quantityController = TextEditingController(
      text: existing != null ? '${existing.quantity}' : '5',
    );
    _pickupStartController = TextEditingController(
      text: existing?.pickupStart ?? '12:00',
    );
    _pickupEndController = TextEditingController(
      text: existing?.pickupEnd ?? '14:30',
    );
    _photoController = TextEditingController(
      text: existing?.photo ?? 'assets/images/offer_basket_pastry.png',
    );

    if (existing != null && _categories.contains(existing.category)) {
      _category = existing.category;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _initialPriceController.dispose();
    _reducedPriceController.dispose();
    _quantityController.dispose();
    _pickupStartController.dispose();
    _pickupEndController.dispose();
    _photoController.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;

    final initialPrice = double.tryParse(_initialPriceController.text.replaceAll(',', '.')) ?? 0;
    final reducedPrice = double.tryParse(_reducedPriceController.text.replaceAll(',', '.')) ?? 0;

    if (initialPrice <= 0) {
      CsToast.show(context, 'Le prix initial doit être supérieur à 0.');
      return;
    }

    if (reducedPrice <= 0 || reducedPrice >= initialPrice) {
      CsToast.show(context, 'Le prix réduit doit être inférieur au prix initial.');
      return;
    }

    final submission = OfferFormSubmission(
      id: widget.offerId,
      name: _nameController.text.trim(),
      description: _descriptionController.text.trim(),
      category: _category,
      photo: _photoController.text.trim().isEmpty
          ? 'assets/images/offer_basket_pastry.png'
          : _photoController.text.trim(),
      initialPrice: _initialPriceController.text.trim(),
      reducedPrice: _reducedPriceController.text.trim(),
      quantity: _quantityController.text.trim(),
      pickupStart: _pickupStartController.text.trim(),
      pickupEnd: _pickupEndController.text.trim(),
    );

    final workspace = AppScope.read(context).merchant;
    if (_isEditing) {
      workspace.updateOffer(submission);
      CsToast.show(context, 'Offre modifiée avec succès.');
    } else {
      workspace.addOffer(submission);
      CsToast.show(context, 'Nouvelle offre publiée avec succès.');
    }

    AppRouter.back(context);
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          PageHeader(
            title: _isEditing ? 'Modifier l’offre' : 'Nouvelle offre',
            eyebrow: 'CATALOGUE COMMERÇANT',
            subtitle: _isEditing
                ? 'Mettez à jour les stocks ou les horaires de retrait.'
                : 'Créez un panier ou un plat anti-gaspillage à prix réduit.',
            onBack: () => AppRouter.back(context),
          ),
          const SizedBox(height: 16),

          // --- Identification de l'offre ---
          CsCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Informations du produit',
                  style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
                ),
                const SizedBox(height: 12),
                CsTextField(
                  label: 'TITRE DE L’OFFRE',
                  hint: 'Ex: Panier Surprise Boulangerie',
                  controller: _nameController,
                  icon: Icons.label_outline,
                  validator: (v) {
                    if (v == null || v.trim().length < 3) {
                      return 'Veuillez saisir un titre (au moins 3 caractères).';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),
                CsDropdownField<String>(
                  label: 'CATÉGORIE',
                  value: _category,
                  items: _categories
                      .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                      .toList(),
                  onChanged: (v) {
                    if (v != null) setState(() => _category = v);
                  },
                ),
                const SizedBox(height: 12),
                CsTextField(
                  label: 'DESCRIPTION DÉTAILLÉE',
                  hint: 'Contenu du panier, allergènes ou particularités…',
                  controller: _descriptionController,
                  maxLines: 3,
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) {
                      return 'La description est obligatoire.';
                    }
                    return null;
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // --- Tarification & Stock ---
          CsCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Prix et quantités',
                  style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: CsTextField(
                        label: 'PRIX INITIAL (DT)',
                        hint: '12.00',
                        controller: _initialPriceController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        icon: Icons.payments_outlined,
                        validator: (v) {
                          final val = double.tryParse((v ?? '').replaceAll(',', '.'));
                          if (val == null || val <= 0) {
                            return 'Prix initial > 0.';
                          }
                          return null;
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: CsTextField(
                        label: 'PRIX RÉDUIT (DT)',
                        hint: '6.00',
                        controller: _reducedPriceController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        icon: Icons.price_check,
                        validator: (v) {
                          final val = double.tryParse((v ?? '').replaceAll(',', '.'));
                          if (val == null || val <= 0) {
                            return 'Prix réduit > 0.';
                          }
                          return null;
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                CsTextField(
                  label: 'QUANTITÉ DISPONIBLE',
                  hint: 'Nombre de portions (ex: 5)',
                  controller: _quantityController,
                  keyboardType: TextInputType.number,
                  icon: Icons.inventory_2_outlined,
                  validator: (v) {
                    final val = int.tryParse(v ?? '');
                    if (val == null || val < 0) {
                      return 'Quantité entière >= 0.';
                    }
                    return null;
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // --- Créneau horaire de retrait ---
          CsCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Créneau de récupération des commandes',
                  style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: CsTextField(
                        label: 'HEURE DÉBUT',
                        hint: '12:00',
                        controller: _pickupStartController,
                        icon: Icons.access_time,
                        validator: (v) => v == null || v.trim().isEmpty ? 'Requis' : null,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: CsTextField(
                        label: 'HEURE FIN',
                        hint: '14:30',
                        controller: _pickupEndController,
                        icon: Icons.access_time_filled,
                        validator: (v) => v == null || v.trim().isEmpty ? 'Requis' : null,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          CsButton(
            label: _isEditing ? 'Enregistrer les modifications' : 'Publier l’offre',
            variant: CsButtonVariant.primary,
            size: CsButtonSize.large,
            expand: true,
            icon: Icons.check,
            onPressed: _submit,
          ),
        ],
      ),
    );
  }
}
