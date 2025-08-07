import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ open, message, onConfirm, onCancel, confirmText = 'Delete', cancelText = 'Cancel' }) => {
  if (!open) return null;
  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <div className="confirm-modal-message">{message}</div>
        <div className="confirm-modal-actions">
          <button className="confirm-modal-cancel" onClick={onCancel}>{cancelText}</button>
          <button className="confirm-modal-confirm" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 