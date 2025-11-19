import React from "react";
import "./Input.css";

export default function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  error = '',
  label = '',
  className = '',
  ...props
}) {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`input ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
}


