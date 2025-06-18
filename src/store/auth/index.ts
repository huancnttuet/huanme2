import { User } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  user: User | null;
  setUser: (value: User | null) => void;
  logout: () => void;
}

const useAuthStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      setUser: (value) => {
        set(() => ({ user: value }));
      },
      logout: () => {
        set(() => ({ user: null }));
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);

export default useAuthStore;
