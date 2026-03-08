import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, type SafeUser } from '../api';

interface AuthState {
  user: SafeUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;
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
      isLoading: true, // 初始为 true，等待 hydrate + token 验证
      _hasHydrated: false,
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
        const token = localStorage.getItem('auth_token');
        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        set({ isLoading: true });
        const result = await authApi.getMe();

        if (result.success && result.data) {
          set({
            user: result.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // Token 无效，尝试刷新
          const refreshResult = await authApi.refresh();
          if (refreshResult.success) {
            // 刷新成功，重新获取用户信息
            const retryResult = await authApi.getMe();
            if (retryResult.success && retryResult.data) {
              set({
                user: retryResult.data.user,
                isAuthenticated: true,
                isLoading: false,
              });
              return;
            }
          }
          // 刷新也失败，清除认证状态
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
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
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            // hydrate 出错，直接结束 loading
            console.error('Auth storage hydration error:', error);
            useAuthStore.setState({ isLoading: false, _hasHydrated: true });
            return;
          }
          if (state) {
            state._hasHydrated = true;
            if (state.isAuthenticated) {
              // 5秒超时兜底，防止网络问题导致永久加载
              const timeout = setTimeout(() => {
                useAuthStore.setState({ isLoading: false });
              }, 5000);
              state.checkAuth().finally(() => clearTimeout(timeout));
            } else {
              // 没有认证状态，直接结束 loading
              useAuthStore.setState({ isLoading: false });
            }
          } else {
            // 首次访问，localStorage 无存储数据
            useAuthStore.setState({ isLoading: false, _hasHydrated: true });
          }
        };
      },
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
