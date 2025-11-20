import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { SessionUser } from '@/domain/interfaces/session-user.interface';
import { AuthToken } from '@/infrastructure/services/auth.service';

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
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    set => ({
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
        })
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
