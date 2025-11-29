import { IBaseResponse } from "../types/global";
import {
  PriceEntryFormInputs,
  PriceEntryFormListInputs,
} from "../utils/validate/price-entry-validate";

import { apiPost, apiPut } from "./common";

export const priceEntryApi = {
  createPriceEntry: async (
    data: PriceEntryFormInputs
  ): Promise<IBaseResponse> => {
    const response = await apiPost("/v1/price-entry", data);
    return response;
  },

  updatePriceEntry: async (
    data: PriceEntryFormListInputs
  ): Promise<IBaseResponse> => {
    const response = await apiPut("/v1/price-entry", data);
    return response;
  },
};
