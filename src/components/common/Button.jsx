/**
 * Button component
 */
export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  className = '',
  ...props 
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
import React from "react";
import "./Button.css";

export default function Button({ children, onClick, className = "", type = "button" }) {
  return (
    <button type={type} onClick={onClick} className={`btn ${className}`}>
      {children}
    </button>
  );
}

