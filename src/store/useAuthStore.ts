import { create } from 'zustand';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthState {
  user: FirebaseAuthTypes.User | null;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
