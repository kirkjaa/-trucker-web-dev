import { ICompanyById, ICompanyMe } from "../types/companyType";
import {
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
} from "../types/global";
import ConvertToformData from "../utils/formData";
import { CompanyMeFormInputs } from "../utils/validate/company-validate";

import { apiGet, apiPatch } from "./common";

export const companyApi = {
  // API Get
  getAllCompanyList: async (
    getAllParams: IMeta
  ): Promise<IResponseWithPaginate<ICompanyById[]>> => {
    const params = new URLSearchParams();

    params.set("page", getAllParams.page.toString());
    params.set("limit", getAllParams.limit.toString());

    try {
      const response = await apiGet("/v1/Company/list", params.toString());
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getCompanyMe: async (): Promise<IBaseResponseData<ICompanyMe>> => {
    try {
      const response = await apiGet("/v1/company/me");
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  updateCompanyMe: async (
    data: CompanyMeFormInputs
  ): Promise<IBaseResponse> => {
    const response = await apiPatch("/v1/company/me", ConvertToformData(data));
    return response;
  },
};
