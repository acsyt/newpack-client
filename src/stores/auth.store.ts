import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { AuthToken } from '@/features/auth/auth.service';
import { SessionUser } from '@/features/auth/session-user.interface';
import { Permission } from '@/features/role/role.interface';

export interface AuthState {
  user: SessionUser | null;
  isAuthenticated: boolean;
  authToken: AuthToken | null;
}

export interface AuthActions {
  setUser: (user: SessionUser | null) => void;
  setToken: (token: AuthToken | null) => void;
  setAuth: (user: SessionUser, token: AuthToken) => void;
  clearAuth: () => void;
  can: (permission: Permission) => boolean;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      authToken: null,
      setUser: user =>
        set({
          user,
          isAuthenticated: !!user
        }),
      setToken: token => set({ authToken: token }),
      setAuth: (user, token) =>
        set({
          user,
          authToken: token,
          isAuthenticated: true
        }),
      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
          authToken: null
        }),
      can: (permission: Permission) => {
        const { user } = get();

        if (!user || !user.permissions) return false;

        return user.permissions.includes(permission);
      }
    }),
    {
      name: 'auth-storage',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        authToken: state.authToken
      })
    }
  )
);
