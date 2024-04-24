import { create } from "zustand";

const useUserEnteredDictsStore = create((set) => ({
  dictionaries: [],
  addDict: (dict) =>
    set((state) => ({
      dictionaries: [...state.dictionaries, dict],
    })),
}));

export { useUserEnteredDictsStore };
