// store/authStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

// store/authStore.ts
interface AuthState {
  isAuthenticated: boolean;
  userToken: string | null;
  userId: string | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (token: string, userId: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userToken: null,
  userId: null,
  isLoading: true,

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');

      set({
        isAuthenticated: !!token,
        userToken: token,
        userId,
        isLoading: false,
      });
    } catch (e) {
      set({
        isAuthenticated: false,
        userToken: null,
        userId: null,
        isLoading: false,
      });
    }
  },

  login: async (token, userId) => {
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userId', userId);
    set({ isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['userToken', 'userId']);
    set({ isAuthenticated: false });
  },
}));
