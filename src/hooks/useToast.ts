import { useToastStore } from '../store/toast.store';
import type { ToastItem } from '../store/toast.store';

export type { ToastItem };

export function useToast() {
  const toasts = useToastStore((s) => s.toasts);
  const addToast = useToastStore((s) => s.addToast);
  const removeToast = useToastStore((s) => s.removeToast);
  const success = useToastStore((s) => s.success);
  const error = useToastStore((s) => s.error);
  const warning = useToastStore((s) => s.warning);
  const info = useToastStore((s) => s.info);
  const clear = useToastStore((s) => s.clear);

  return { toasts, addToast, removeToast, success, error, warning, info, clear };
}
