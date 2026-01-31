import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, type SafeUser } from '../api';

interface AuthState {
  user: SafeUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, displayName: string, email?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username, password) => {
        set({ isLoading: true, error: null });
        const result = await authApi.login({ username, password });

        if (result.success && result.data) {
          set({
            user: result.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }

        set({
          isLoading: false,
          error: result.error || '登录失败',
        });
        return false;
      },

      register: async (username, password, displayName, email) => {
        set({ isLoading: true, error: null });
        const result = await authApi.register({
          username,
          password,
          display_name: displayName,
          email,
        });

        if (result.success && result.data) {
          set({
            user: result.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }

        set({
          isLoading: false,
          error: result.error || '注册失败',
        });
        return false;
      },

      logout: async () => {
        await authApi.logout();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async () => {
        console.log('checkAuth called');
        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.log('No token found');
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        set({ isLoading: true });
        console.log('Getting user info...');
        const result = await authApi.getMe();

        if (result.success && result.data) {
          console.log('User info loaded:', result.data.user);
          set({
            user: result.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          console.log('Token invalid, clearing auth');
          // 简化处理：直接清除状态，不尝试刷新
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          localStorage.removeItem('auth_token');
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// 辅助函数
export function useIsAdmin() {
  return useAuthStore((state) => state.user?.role === 'admin');
}

export function useIsForecaster() {
  return useAuthStore((state) =>
    state.user?.role === 'admin' || state.user?.role === 'forecaster'
  );
}

export function useCanEdit(forecasterId?: number) {
  return useAuthStore((state) => {
    if (!state.user) return false;
    if (state.user.role === 'admin') return true;
    if (state.user.role === 'forecaster' && state.user.id === forecasterId) return true;
    return false;
  });
}
