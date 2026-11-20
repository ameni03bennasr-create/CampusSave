import React from 'react';

const FormInput = ({ label, name, type = 'text', value, onChange, error, placeholder, required = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-stone-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
          error ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-stone-200 focus:border-terracotta'
        }`}
      />
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;