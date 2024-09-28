import { create } from 'zustand';

import useLocalStorage from '../hooks/useLocalStorage';

interface StoreType {
  settings: { showRatings: boolean };
  toggleShowRatings: () => void;
}

export const useSettingsStore = create<StoreType>((set) => {
  const { item, set: setItem } = useLocalStorage('showRatings');

  return {
    // null (first visit, item not in storage) defaults to true (will show ratings)
    settings: { showRatings: item === 'true' ? true : item === null },
    toggleShowRatings: () => set(({ settings }) => {
      setItem('showRatings', settings.showRatings ? 'false' : 'true');

      return { settings: { showRatings: !settings.showRatings } };
    }),
  };
});
