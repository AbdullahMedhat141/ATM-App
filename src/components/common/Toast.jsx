/**
 * Toast notification component
 * This is a simple implementation - you may want to enhance it with animations
 */
export default function Toast({ message, type = 'success', onClose, show = false }) {
  if (!show) return null;

  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="toast-close">×</button>
      )}
    </div>
  );
}

