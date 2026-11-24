import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_style.dart';
import '../../core/theme/app_text.dart';
import '../../core/utils/formatters.dart';
import '../../routing/app_router.dart';
import '../../routing/page_args.dart';
import '../../routing/route_names.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_inputs.dart';
import '../../widgets/cs_surfaces.dart';

/// Écran de paiement (Étape 3 sur 3).
///
/// Interface honnête et contractuelle : conformément aux directives, aucun faux
/// succès de paiement n'est simulé côté client sans confirmation par le backend
/// bancaire (Konnect / Flouci / GPG).
class PaymentScreen extends StatefulWidget {
  const PaymentScreen({super.key, required this.orderId});

  final String orderId;

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  final _formKey = GlobalKey<FormState>();
  final _cardNumberController = TextEditingController();
  final _cardExpiryController = TextEditingController();
  final _cardCvvController = TextEditingController();
  final _cardHolderController = TextEditingController();

  String _paymentMethod = 'card';
  bool _acceptedTerms = false;
  bool _showNotice = false;

  @override
  void dispose() {
    _cardNumberController.dispose();
    _cardExpiryController.dispose();
    _cardCvvController.dispose();
    _cardHolderController.dispose();
    super.dispose();
  }

  void _onPayPressed() {
    if (!_formKey.currentState!.validate()) return;

    if (!_acceptedTerms) {
      CsToast.show(context, 'Veuillez accepter les conditions de vente.');
      return;
    }

    setState(() {
      _showNotice = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    final student = AppScope.of(context).student;
    final order = student.orderById(widget.orderId);

    if (order == null) {
      return EmptyState(
        icon: Icons.error_outline,
        title: 'Commande introuvable',
        description: 'La référence « ${widget.orderId} » n’existe pas.',
        actionLabel: 'Retour à l’accueil',
        onAction: () => AppRouter.switchTo(context, Routes.studentHome),
      );
    }

    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          PageHeader(
            title: 'Paiement sécurisé',
            eyebrow: 'ÉTAPE 3 SUR 3',
            subtitle:
                'Réglez votre commande pour activer votre QR Code de retrait.',
            onBack: () => AppRouter.back(context),
          ),
          const SizedBox(height: 16),

          // --- Récapitulatif montant ---
          CsCard(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        order.productTitle,
                        style: AppText.sm(
                          weight: FontWeight.w800,
                          color: AppColors.stone900,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${order.restaurantName} • Commande #${order.id}',
                        style: AppText.t11(color: AppColors.stone500),
                      ),
                    ],
                  ),
                ),
                Text(
                  Formatters.price(order.totalAmount),
                  style: AppText.xl(
                    weight: FontWeight.w900,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // --- Choix du mode de paiement ---
          CsCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Mode de règlement',
                  style: AppText.t10(
                    weight: FontWeight.w800,
                    color: AppColors.stone400,
                  ),
                ),
                const SizedBox(height: 12),
                RadioGroup<String>(
                  groupValue: _paymentMethod,
                  onChanged: (String? val) {
                    if (val != null) {
                      setState(() => _paymentMethod = val);
                    }
                  },
                  child: Column(
                    children: [
                      _buildMethodTile(
                        value: 'card',
                        title: 'Carte bancaire (En ligne)',
                        subtitle: 'Paiement sécurisé via passerelle bancaire',
                        icon: Icons.credit_card,
                      ),
                      const Divider(height: 16),
                      _buildMethodTile(
                        value: 'counter',
                        title: 'Paiement sur place (Au comptoir)',
                        subtitle: 'Règlement direct lors de la récupération',
                        icon: Icons.storefront_outlined,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // --- Formulaire Carte si sélectionné ---
          if (_paymentMethod == 'card') ...[
            CsCard(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Coordonnées bancaires',
                    style: AppText.t10(
                      weight: FontWeight.w800,
                      color: AppColors.stone400,
                    ),
                  ),
                  const SizedBox(height: 12),
                  CsTextField(
                    label: 'TITULAIRE DE LA CARTE',
                    hint: 'Nom et prénom',
                    controller: _cardHolderController,
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
                    label: 'NUMÉRO DE CARTE',
                    hint: '•••• •••• •••• ••••',
                    controller: _cardNumberController,
                    icon: Icons.credit_card,
                    keyboardType: TextInputType.number,
                    validator: (v) {
                      if (v == null || v.replaceAll(' ', '').length < 16) {
                        return 'Numéro de carte incomplet (16 chiffres).';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: CsTextField(
                          label: 'EXPIRATION (MM/AA)',
                          hint: '12/28',
                          controller: _cardExpiryController,
                          icon: Icons.calendar_today_outlined,
                          validator: (v) {
                            if (v == null || !v.contains('/')) {
                              return 'Format MM/AA.';
                            }
                            return null;
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: CsTextField(
                          label: 'CVV',
                          hint: '123',
                          controller: _cardCvvController,
                          icon: Icons.lock_outline,
                          obscure: true,
                          keyboardType: TextInputType.number,
                          maxLength: 4,
                          validator: (v) {
                            if (v == null || v.length < 3) {
                              return 'CVV à 3 chiffres.';
                            }
                            return null;
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),
          ],

          // --- Consentement CGU ---
          CsCard(
            padding: const EdgeInsets.all(14),
            child: InkWell(
              onTap: () {
                setState(() => _acceptedTerms = !_acceptedTerms);
              },
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Checkbox(
                    value: _acceptedTerms,
                    activeColor: AppColors.green,
                    onChanged: (val) {
                      setState(() => _acceptedTerms = val ?? false);
                    },
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: Text(
                        'J’accepte les conditions générales de vente et m’engage à récupérer le panier dans le créneau imparti.',
                        style: AppText.xs(
                          color: AppColors.stone700,
                          height: 1.4,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 18),

          // --- Alerte honnête Backend Gateway Integration ---
          if (_showNotice) ...[
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.goldSoft(0.3),
                borderRadius: AppRadii.rXl,
                border: Border.all(color: AppColors.gold),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.info_outline,
                        color: AppColors.amberText,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Passerelle bancaire en cours d’intégration',
                        style: AppText.xs(
                          weight: FontWeight.w800,
                          color: AppColors.amberText,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Conformément aux directives CampusSave, les paiements réels sont traités par le service backend (ex. Konnect, Flouci, ClicToPay). Votre commande #${order.id} est bien enregistrée au statut « En attente de paiement ».\n\nDès que le webhook serveur confirme la transaction, votre QR Code de retrait sera immédiatement disponible.',
                    style: AppText.xs(color: AppColors.stone800, height: 1.5),
                  ),
                  const SizedBox(height: 12),
                  CsButton(
                    label: 'Consulter ma commande',
                    variant: CsButtonVariant.secondary,
                    size: CsButtonSize.small,
                    onPressed: () {
                      AppRouter.push(
                        context,
                        Routes.studentOrderDetails,
                        args: PageArgs(orderId: order.id),
                      );
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),
          ],

          // --- Bouton de validation ---
          CsButton(
            label:
                'Confirmer le règlement (${Formatters.price(order.totalAmount)})',
            variant: CsButtonVariant.primary,
            size: CsButtonSize.large,
            expand: true,
            icon: Icons.lock,
            onPressed: _onPayPressed,
          ),
        ],
      ),
    );
  }

  Widget _buildMethodTile({
    required String value,
    required String title,
    required String subtitle,
    required IconData icon,
  }) {
    final isSelected = _paymentMethod == value;

    return InkWell(
      onTap: () => setState(() => _paymentMethod = value),
      borderRadius: AppRadii.rLg,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Row(
          children: [
            Icon(
              icon,
              color: isSelected ? AppColors.primary : AppColors.stone400,
              size: 22,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: AppText.sm(
                      weight: isSelected ? FontWeight.w800 : FontWeight.w600,
                      color: AppColors.stone900,
                    ),
                  ),
                  Text(subtitle, style: AppText.t11(color: AppColors.stone500)),
                ],
              ),
            ),
            Radio<String>(
              value: value,
              fillColor: const WidgetStatePropertyAll(AppColors.primary),
            ),
          ],
        ),
      ),
    );
  }
}
