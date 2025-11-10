import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Role, Permission } from '../types';

type AuthState = {
  user: User | null;
  roles: Role[];
  permissions: Permission[];
  setAuth: (payload: { user: User; roles: Role[]; permissions: Permission[] }) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      roles: [],
      permissions: [],
      setAuth: ({ user, roles, permissions }) => set({ user, roles, permissions }),
      clear: () => set({ user: null, roles: [], permissions: [] })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);