import React from 'react';

const MerchantFormFields = ({ formData, errors, onChange }) => {
  return (
    <div className="merchant-form-fields">
      <div className="form-group">
        <label htmlFor="name">Nom du commerce *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={onChange}
          placeholder="Ex: Cafétéria ESSECT"
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="speciality">Spécialité *</label>
        <input
          type="text"
          id="speciality"
          name="speciality"
          value={formData.speciality || ''}
          onChange={onChange}
          placeholder="Ex: Sandwichs, Pâtisseries..."
        />
        {errors.speciality && <span className="error-message">{errors.speciality}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={onChange}
          placeholder="Décrivez votre établissement..."
          rows={3}
        />
      </div>
      <div className="form-group">
        <label htmlFor="logoUrl">URL du logo</label>
        <input
          type="text"
          id="logoUrl"
          name="logoUrl"
          value={formData.logoUrl || ''}
          onChange={onChange}
          placeholder="https://..."
        />
      </div>
    </div>
  );
};

export default MerchantFormFields;