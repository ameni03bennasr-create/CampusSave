import React from 'react';

const OfferFormFields = ({ formData, errors, onChange }) => {
  return (
    <div className="offer-form-fields">
      <div className="form-group">
        <label htmlFor="title">Titre de l'offre *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title || ''}
          onChange={onChange}
          placeholder="Ex: Sandwich Poulet + Jus"
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={onChange}
          placeholder="Décrivez l'offre..."
          rows={3}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="initialPrice">Prix initial (DT) *</label>
          <input
            type="number"
            id="initialPrice"
            name="initialPrice"
            step="0.001"
            min="0"
            value={formData.initialPrice || ''}
            onChange={onChange}
          />
          {errors.initialPrice && <span className="error-message">{errors.initialPrice}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="discountedPrice">Prix réduit (DT) *</label>
          <input
            type="number"
            id="discountedPrice"
            name="discountedPrice"
            step="0.001"
            min="0"
            value={formData.discountedPrice || ''}
            onChange={onChange}
          />
          {errors.discountedPrice && <span className="error-message">{errors.discountedPrice}</span>}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="category">Catégorie *</label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category || ''}
          onChange={onChange}
          placeholder="Ex: Sandwichs, Pâtisseries..."
        />
        {errors.category && <span className="error-message">{errors.category}</span>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="quantity">Quantité *</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="0"
            value={formData.quantity || ''}
            onChange={onChange}
          />
          {errors.quantity && <span className="error-message">{errors.quantity}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="pickupTime">Horaires de retrait *</label>
          <input
            type="text"
            id="pickupTime"
            name="pickupTime"
            value={formData.pickupTime || ''}
            onChange={onChange}
            placeholder="Ex: 12:00 - 14:00"
          />
          {errors.pickupTime && <span className="error-message">{errors.pickupTime}</span>}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="imageUrl">URL de l'image</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl || ''}
          onChange={onChange}
          placeholder="https://..."
        />
      </div>
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            name="isAvailable"
            checked={formData.isAvailable || false}
            onChange={onChange}
          />
          Offre disponible
        </label>
      </div>
    </div>
  );
};

export default OfferFormFields;