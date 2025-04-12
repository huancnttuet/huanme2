import { create } from 'zustand';

interface State {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const useCommon = create<State>()((set) => ({
  isLoading: false,
  setIsLoading: (value) => set(() => ({ isLoading: value })),
}));

export default useCommon;
