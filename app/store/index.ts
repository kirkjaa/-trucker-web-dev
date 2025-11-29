import { create } from "zustand";

interface StoreState {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  sortConfig: {
    key: string;
    direction: "ascending" | "descending";
  };
  setSortConfig: (config: {
    key: string;
    direction: "ascending" | "descending";
  }) => void;
  data: any[];
  setData: (data: any[]) => void;
}

export const useStore = create<StoreState>((set) => ({
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
  sortConfig: {
    key: "",
    direction: "ascending",
  },
  setSortConfig: (config) => set({ sortConfig: config }),
  data: [],
  setData: (data) => set({ data }),
}));
