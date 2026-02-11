import { create } from 'zustand';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (props: { message: string; type?: ToastItem['type']; duration?: number }) => string;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
  clear: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: ({ message, type = 'info', duration = 3000 }) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));
    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  success: (message, duration) => {
    return useToastStore.getState().addToast({ message, type: 'success', duration });
  },

  error: (message, duration) => {
    return useToastStore.getState().addToast({ message, type: 'error', duration });
  },

  warning: (message, duration) => {
    return useToastStore.getState().addToast({ message, type: 'warning', duration });
  },

  info: (message, duration) => {
    return useToastStore.getState().addToast({ message, type: 'info', duration });
  },

  clear: () => {
    set({ toasts: [] });
  },
}));
