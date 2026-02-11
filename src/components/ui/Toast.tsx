import { useEffect, useState } from 'react';
import { useToastStore, type ToastItem } from '../../store/toast.store';
import './Toast.css';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export function Toast({
  id,
  message,
  type = 'info',
  duration = 3000,
}: ToastItem) {
  const [isVisible, setIsVisible] = useState(true);
  const removeToast = useToastStore((s) => s.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        removeToast(id);
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, removeToast]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      removeToast(id);
    }, 300);
  };

  return (
    <div className={`toast toast-${type} ${isVisible ? 'toast-show' : 'toast-hide'}`}>
      <div className="toast-icon">
        {type === 'success' && '\u2713'}
        {type === 'error' && '\u2715'}
        {type === 'warning' && '\u26A0'}
        {type === 'info' && '\u2139'}
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={handleClose}>
        \u00D7
      </button>
    </div>
  );
}

// Toast container reads directly from the store
export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}
