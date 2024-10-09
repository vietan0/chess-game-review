import { create } from 'zustand';

export interface StageStore {
  stage: 'home' | 'select-month' | 'select-game' | 'loaded' | 'review-overview' | 'review-moves';
  setStage: (stage: StageStore['stage']) => void;
  computed: {
    isLoaded: boolean;
  };
}
export const useStageStore = create<StageStore>((set, get) => ({
  stage: 'home',
  setStage: (stage: StageStore['stage']) => set({ stage }),
  computed: {
    get isLoaded() {
      return ['loaded', 'review-overview', 'review-moves'].includes(get().stage);
    },
  },
}));
