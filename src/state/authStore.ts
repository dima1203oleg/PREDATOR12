import { create } from 'zustand';

export type UserRole = 'guest' | 'client' | 'pro' | 'admin';

interface AuthState {
  role: UserRole;
  username: string;
  setRole: (role: UserRole) => void;
  setUsername: (username: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: 'guest',
  username: 'Guest',
  setRole: (role) => set({ role }),
  setUsername: (username) => set({ username })
}));
