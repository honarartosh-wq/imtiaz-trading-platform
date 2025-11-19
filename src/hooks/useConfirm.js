import { useState, useCallback } from 'react';

/**
 * Custom hook for confirmation dialogs
 * @returns {object} Confirmation state and handlers
 */
export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [resolveCallback, setResolveCallback] = useState(null);

  const confirm = useCallback((confirmMessage) => {
    setMessage(confirmMessage);
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolveCallback(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (resolveCallback) {
      resolveCallback(true);
    }
    setIsOpen(false);
    setMessage('');
    setResolveCallback(null);
  }, [resolveCallback]);

  const handleCancel = useCallback(() => {
    if (resolveCallback) {
      resolveCallback(false);
    }
    setIsOpen(false);
    setMessage('');
    setResolveCallback(null);
  }, [resolveCallback]);

  return {
    isOpen,
    message,
    confirm,
    handleConfirm,
    handleCancel
  };
};
