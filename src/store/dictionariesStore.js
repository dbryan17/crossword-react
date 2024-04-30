import { create } from "zustand";

const useUserEnteredDictsStore = create((set) => ({
  dicts: [],
  addDict: (dict) =>
    set((state) => ({
      dicts: [...state.dicts, dict],
    })),
}));

export { useUserEnteredDictsStore };
