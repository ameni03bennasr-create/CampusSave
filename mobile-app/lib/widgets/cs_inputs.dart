import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';

import '../core/theme/app_colors.dart';
import '../core/theme/app_style.dart';
import '../core/theme/app_text.dart';

/// Champ de saisie CampusSave.
///
/// Reprend l'apparence du formulaire React : libellé en petites majuscules,
/// fond crème `#F8F1E7`, contour or, bordure terracotta et fond blanc au focus.
/// Le message d'erreur est affiché sous le champ (validation visuelle).
class CsTextField extends StatefulWidget {
  const CsTextField({
    super.key,
    required this.label,
    this.hint,
    this.controller,
    this.icon,
    this.suffix,
    this.obscure = false,
    this.keyboardType,
    this.textInputAction,
    this.errorText,
    this.helperText,
    this.maxLines = 1,
    this.maxLength,
    this.onChanged,
    this.onSubmitted,
    this.enabled = true,
    this.autofocus = false,
    this.prefixText,
    this.validator,
    this.inputFormatters,
    this.readOnly = false,
    this.onTap,
  });

  final String label;
  final String? hint;
  final TextEditingController? controller;
  final IconData? icon;
  final Widget? suffix;
  final bool obscure;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final String? errorText;
  final String? helperText;
  final int maxLines;
  final int? maxLength;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final bool enabled;
  final bool autofocus;
  final String? prefixText;
  final String? Function(String?)? validator;
  final List<TextInputFormatter>? inputFormatters;
  final bool readOnly;
  final VoidCallback? onTap;

  @override
  State<CsTextField> createState() => _CsTextFieldState();
}

class _CsTextFieldState extends State<CsTextField> {
  late final FocusNode _focusNode = FocusNode();
  bool _focused = false;

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_onFocusChanged);
  }

  void _onFocusChanged() {
    if (mounted) setState(() => _focused = _focusNode.hasFocus);
  }

  @override
  void dispose() {
    _focusNode.removeListener(_onFocusChanged);
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final hasError = widget.errorText != null && widget.errorText!.isNotEmpty;
    final borderColor = hasError
        ? AppColors.red600
        : _focused
        ? AppColors.primary
        : AppColors.goldSoft(0.7);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.label,
          style: AppText.xs(
            weight: FontWeight.w700,
            color: AppColors.stone500,
            letterSpacing: 0.6,
          ).copyWith(textBaseline: TextBaseline.alphabetic),
        ),
        const SizedBox(height: 6),
        AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          decoration: BoxDecoration(
            color: _focused ? Colors.white : AppColors.background,
            borderRadius: AppRadii.rXl,
            border: Border.all(color: borderColor, width: hasError ? 1.5 : 1),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              if (widget.icon != null)
                Padding(
                  padding: const EdgeInsets.only(left: 14),
                  child: Icon(
                    widget.icon,
                    size: 17,
                    color: _focused ? AppColors.primary : AppColors.stone400,
                  ),
                ),
              Expanded(
                child: TextFormField(
                  controller: widget.controller,
                  focusNode: _focusNode,
                  obscureText: widget.obscure,
                  keyboardType: widget.keyboardType,
                  textInputAction: widget.textInputAction,
                  maxLines: widget.maxLines,
                  maxLength: widget.maxLength,
                  onChanged: widget.onChanged,
                  onFieldSubmitted: widget.onSubmitted,
                  enabled: widget.enabled,
                  autofocus: widget.autofocus,
                  validator: widget.validator,
                  inputFormatters: widget.inputFormatters,
                  readOnly: widget.readOnly,
                  onTap: widget.onTap,
                  cursorColor: AppColors.primary,
                  style: AppText.sm(
                    color: widget.enabled
                        ? AppColors.stone800
                        : AppColors.stone400,
                  ),
                  decoration: InputDecoration(
                    hintText: widget.hint,
                    hintStyle: AppText.sm(
                      color: AppColors.stone400,
                    ).copyWith(fontSize: 13),
                    prefixText: widget.prefixText,
                    prefixStyle: AppText.sm(
                      weight: FontWeight.w700,
                      color: AppColors.stone600,
                    ),
                    isDense: true,
                    counterText: '',
                    border: InputBorder.none,
                    enabledBorder: InputBorder.none,
                    focusedBorder: InputBorder.none,
                    errorBorder: InputBorder.none,
                    disabledBorder: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: widget.icon == null ? 14 : 10,
                      vertical: widget.maxLines > 1 ? 12 : 14,
                    ),
                  ),
                ),
              ),
              if (widget.suffix != null)
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: widget.suffix,
                )
              else
                const SizedBox(width: 14),
            ],
          ),
        ),
        if (hasError)
          Padding(
            padding: const EdgeInsets.only(top: 6, left: 2),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(
                  Icons.error_outline,
                  size: 13,
                  color: AppColors.red700,
                ),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    widget.errorText!,
                    style: AppText.xs(
                      color: AppColors.red700,
                      weight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          )
        else if (widget.helperText != null)
          Padding(
            padding: const EdgeInsets.only(top: 6, left: 2),
            child: Text(
              widget.helperText!,
              style: AppText.xs(color: AppColors.stone400),
            ),
          ),
      ],
    );
  }
}

/// Champ de recherche compact utilisé dans les listes et l'explorateur d'offres.
class CsSearchField extends StatelessWidget {
  const CsSearchField({
    super.key,
    this.controller,
    this.hint = 'Rechercher…',
    this.onChanged,
    this.onSubmitted,
    this.suffix,
  });

  final TextEditingController? controller;
  final String hint;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final Widget? suffix;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadii.rXl,
        border: Border.all(color: AppColors.goldSoft(0.7)),
      ),
      child: TextField(
        controller: controller,
        onChanged: onChanged,
        onSubmitted: onSubmitted,
        style: AppText.sm(),
        cursorColor: AppColors.primary,
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: AppText.sm(color: AppColors.stone400),
          prefixIcon: const Icon(
            Icons.search,
            size: 18,
            color: AppColors.stone400,
          ),
          suffixIcon: suffix,
          border: InputBorder.none,
          isDense: true,
          contentPadding: const EdgeInsets.symmetric(vertical: 13),
        ),
      ),
    );
  }
}

/// Liste déroulante stylée (filtres, catégories, horaires).
class CsDropdownField<T> extends StatelessWidget {
  const CsDropdownField({
    super.key,
    required this.label,
    required this.value,
    required this.items,
    required this.onChanged,
    this.hint,
    this.icon,
    this.errorText,
  });

  final String label;
  final T? value;
  final List<DropdownMenuItem<T>> items;
  final ValueChanged<T?>? onChanged;
  final String? hint;
  final IconData? icon;
  final String? errorText;

  @override
  Widget build(BuildContext context) {
    final hasError = errorText != null && errorText!.isNotEmpty;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: AppText.xs(
            weight: FontWeight.w700,
            color: AppColors.stone500,
            letterSpacing: 0.6,
          ),
        ),
        const SizedBox(height: 6),
        Container(
          decoration: BoxDecoration(
            color: AppColors.background,
            borderRadius: AppRadii.rXl,
            border: Border.all(
              color: hasError ? AppColors.red600 : AppColors.goldSoft(0.7),
            ),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 14),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<T>(
              value: value,
              items: items,
              onChanged: onChanged,
              isExpanded: true,
              isDense: true,
              borderRadius: AppRadii.rXl2,
              dropdownColor: Colors.white,
              style: AppText.sm(color: AppColors.stone800),
              padding: const EdgeInsets.symmetric(vertical: 12),
              icon: const Icon(
                Icons.keyboard_arrow_down,
                size: 20,
                color: AppColors.stone400,
              ),
              hint: hint == null
                  ? null
                  : Text(hint!, style: AppText.sm(color: AppColors.stone400)),
            ),
          ),
        ),
        if (hasError)
          Padding(
            padding: const EdgeInsets.only(top: 6, left: 2),
            child: Text(
              errorText!,
              style: AppText.xs(
                color: AppColors.red700,
                weight: FontWeight.w600,
              ),
            ),
          ),
      ],
    );
  }
}

/// Sélecteur de quantité `− n +` (page de réservation).
class QuantityStepper extends StatelessWidget {
  const QuantityStepper({
    super.key,
    required this.value,
    required this.onChanged,
    required this.max,
    this.min = 1,
  });

  final int value;
  final int max;
  final int min;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: AppRadii.rXl,
        border: Border.all(color: AppColors.stone200),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _StepButton(
            icon: Icons.remove,
            enabled: value > min,
            onTap: () => onChanged(value - 1),
          ),
          SizedBox(
            width: 44,
            child: Text(
              '$value',
              textAlign: TextAlign.center,
              style: AppText.base(weight: FontWeight.w800),
            ),
          ),
          _StepButton(
            icon: Icons.add,
            enabled: value < max,
            onTap: () => onChanged(value + 1),
          ),
        ],
      ),
    );
  }
}

class _StepButton extends StatelessWidget {
  const _StepButton({
    required this.icon,
    required this.enabled,
    required this.onTap,
  });

  final IconData icon;
  final bool enabled;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: AppRadii.rLg,
      child: InkWell(
        onTap: enabled ? onTap : null,
        borderRadius: AppRadii.rLg,
        child: SizedBox(
          width: 36,
          height: 36,
          child: Icon(
            icon,
            size: 16,
            color: enabled ? AppColors.stone800 : AppColors.stone300,
          ),
        ),
      ),
    );
  }
}

/// Ligne de réglage avec interrupteur (préférences de notifications).
class CsSwitchRow extends StatelessWidget {
  const CsSwitchRow({
    super.key,
    required this.title,
    this.subtitle,
    required this.value,
    required this.onChanged,
    this.icon,
  });

  final String title;
  final String? subtitle;
  final bool value;
  final ValueChanged<bool>? onChanged;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onChanged == null ? null : () => onChanged!(!value),
      borderRadius: AppRadii.rXl,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 2),
        child: Row(
          children: [
            if (icon != null) ...[
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: AppRadii.rLg,
                ),
                child: Icon(icon, size: 18, color: AppColors.primary),
              ),
              const SizedBox(width: 12),
            ],
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: AppText.sm(
                      weight: FontWeight.w700,
                      color: AppColors.stone800,
                    ),
                  ),
                  if (subtitle != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 2),
                      child: Text(
                        subtitle!,
                        style: AppText.xs(color: AppColors.stone500),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Switch(value: value, onChanged: onChanged),
          ],
        ),
      ),
    );
  }
}
