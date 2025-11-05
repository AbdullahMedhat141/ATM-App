import React from "react";
import "./Button.css";

export default function Button({ children, onClick, className = "", type = "button" }) {
  return (
    <button type={type} onClick={onClick} className={`btn ${className}`}>
      {children}
    </button>
  );
}
