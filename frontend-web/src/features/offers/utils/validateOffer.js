export const validateOffer = (formData) => {
  const errors = {};

  if (!formData.title || formData.title.trim() === '') {
    errors.title = 'Le titre est obligatoire.';
  }
  if (!formData.initialPrice || isNaN(formData.initialPrice) || formData.initialPrice <= 0) {
    errors.initialPrice = 'Le prix initial doit être un nombre positif.';
  }
  if (!formData.discountedPrice || isNaN(formData.discountedPrice) || formData.discountedPrice <= 0) {
    errors.discountedPrice = 'Le prix réduit doit être un nombre positif.';
  }
  if (formData.discountedPrice >= formData.initialPrice) {
    errors.discountedPrice = 'Le prix réduit doit être inférieur au prix initial.';
  }
  if (!formData.category || formData.category.trim() === '') {
    errors.category = 'La catégorie est obligatoire.';
  }
  if (!formData.quantity || isNaN(formData.quantity) || formData.quantity < 0) {
    errors.quantity = 'La quantité doit être un nombre positif ou zéro.';
  }
  if (!formData.pickupTime || formData.pickupTime.trim() === '') {
    errors.pickupTime = 'Les horaires de retrait sont obligatoires.';
  }

  return errors;
};