import Modal from '../common/Modal';
import Button from '../common/Button';
import './ConfirmationDialog.css';

export default function ConfirmationDialog({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) {
  return (
    <Modal isOpen={true} onClose={onCancel} className="confirmation-dialog">
      <div className="confirmation-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="confirmation-buttons">
          <Button onClick={onCancel} className="cancel-btn">
            {cancelText}
          </Button>
          <Button onClick={onConfirm} className="confirm-btn">
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
