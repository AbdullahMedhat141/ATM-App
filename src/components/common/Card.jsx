/**
 * Card component for displaying content in a card layout
 */
export default function Card({ children, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}

