import { create } from "zustand";

type DisbursementStore = {
  openDowloadModal: boolean;
  getOpenDowloadModal: () => boolean;
  setOpenDowloadModal: (data: boolean) => void;
};

export const useDisbursementStore = create<DisbursementStore>((set, get) => ({
  openDowloadModal: false,
  getOpenDowloadModal: () => get().openDowloadModal,
  setOpenDowloadModal: (data: boolean) => set({ openDowloadModal: data }),
}));
