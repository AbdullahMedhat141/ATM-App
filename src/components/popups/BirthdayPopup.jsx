import Modal from '../common/Modal';
import './BirthdayPopup.css';

export default function BirthdayPopup({ userName, onClose }) {
  return (
    <Modal isOpen={true} onClose={onClose} className="birthday-popup">
      <div className="birthday-content">
        <h2>🎉 Happy Birthday, {userName}! 🎂</h2>
        <p>Wishing you a day full of happiness and joy! 💖</p>
        <button onClick={onClose} className="birthday-close-btn">
          Celebrate 🎊
        </button>
      </div>
    </Modal>
  );
}
