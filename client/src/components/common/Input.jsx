import React from 'react';

const Input = ({ 
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`input ${error ? 'border-error' : ''}`}
        {...props}
      />
      {error && (
        <div className="text-error text-sm mt-1">
          {error}
        </div>
      )}
    </div>
  );
};

export default Input; 