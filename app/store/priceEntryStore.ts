/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";

import { priceEntryApi } from "../services/priceEntryApi";
import { IBaseResponse } from "../types/global";
import {
  PriceEntryFormInputs,
  PriceEntryFormListInputs,
} from "../utils/validate/price-entry-validate";

type PriceEntryStore = {
  createPriceEntry: (data: PriceEntryFormInputs) => Promise<IBaseResponse>;
  updatePriceEntry: (data: PriceEntryFormListInputs) => Promise<IBaseResponse>;
};

export const usePriceEntryStore = create<PriceEntryStore>((_set, _get) => ({
  createPriceEntry: async (data: PriceEntryFormInputs) => {
    const response = await priceEntryApi.createPriceEntry(data);
    return response;
  },
  updatePriceEntry: async (data: PriceEntryFormListInputs) => {
    const response = await priceEntryApi.updatePriceEntry(data);
    return response;
  },
}));
