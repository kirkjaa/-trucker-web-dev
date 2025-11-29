import { IFactoryMe } from "../types/factoryType";
import { IBaseResponse, IBaseResponseData } from "../types/global";
import ConvertToformData from "../utils/formData";
import { FactoryMeFormInputs } from "../utils/validate/factory-validate";

import { apiGet, apiPatch } from "./common";

export const factoryApi = {
  getFactoryMe: async (): Promise<IBaseResponseData<IFactoryMe>> => {
    try {
      const response = await apiGet("/v1/factory/me");
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  updateFactoryMe: async (
    data: FactoryMeFormInputs
  ): Promise<IBaseResponse> => {
    const response = await apiPatch("/v1/factory/me", ConvertToformData(data));
    return response;
  },
};
