import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

/**
 * Reusable Confirmation Dialog component
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether dialog is open
 * @param {function} props.onConfirm - Function to call on confirm
 * @param {function} props.onCancel - Function to call on cancel
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Confirmation message
 * @param {string} props.confirmText - Confirm button text (default: "Confirm")
 * @param {string} props.cancelText - Cancel button text (default: "Cancel")
 * @param {string} props.variant - Button variant: 'danger', 'warning', 'primary' (default: 'danger')
 */
const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${
            variant === 'danger' ? 'bg-red-600/20' :
            variant === 'warning' ? 'bg-yellow-600/20' :
            'bg-emerald-600/20'
          }`}>
            <AlertTriangle className={`w-6 h-6 ${
              variant === 'danger' ? 'text-red-400' :
              variant === 'warning' ? 'text-yellow-400' :
              'text-emerald-400'
            }`} />
          </div>
          <div className="flex-1">
            <p className="text-slate-300 text-sm leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
