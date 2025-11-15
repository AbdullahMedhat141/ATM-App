import Toast from './Toast';
import { useToast } from '../../context/ToastContext';
import './ToastContainer.css';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast-item toast-${t.type}`}>
          <Toast message={t.message} type={t.type} show={true} onClose={() => removeToast(t.id)} />
        </div>
      ))}
    </div>
  );
}
