import { create } from "zustand";

import { ISignature } from "@/app/types/signature/signatureType";

type signatureStore = {
  // State
  signatures: ISignature[] | null;

  // Function
  setSignatures: (data: ISignature[]) => void;
};

export const useSignatureStore = create<signatureStore>((set) => ({
  // State
  signatures: null,

  // Function
  setSignatures: (data: ISignature[]) => set({ signatures: data }),
}));
