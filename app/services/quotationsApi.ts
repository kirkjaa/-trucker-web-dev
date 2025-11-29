import { apiGet, apiPatch } from "./common";

import {
  getAllParams,
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "@/app/types/global";
import {
  IQuotationById,
  IQuotationContractCompany,
} from "@/app/types/quotationsType";

export const quotationsApi = {
  // API Get
  getAllQuotationList: async (
    getAllParams: getAllParams
  ): Promise<IResponseWithPaginate<IQuotationById[]>> => {
    const params = new URLSearchParams();

    params.set("name", getAllParams.name ? getAllParams.name.join(",") : "");

    if (getAllParams.value) {
      params.set("value", getAllParams.value);
    }
    if (getAllParams.status) {
      params.set("status", getAllParams.status);
    }
    if (getAllParams.isActive) {
      params.set("isActive", getAllParams.isActive.toString());
    }
    if (getAllParams.bidStatus) {
      params.set("bidStatus", getAllParams.bidStatus);
    }

    params.set("page", getAllParams.page.toString());
    params.set("limit", getAllParams.limit.toString());

    try {
      const response = await apiGet("/v1/quotations/list", params.toString());
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getQuotationById: async (
    quotationId: string
  ): Promise<IBaseResponseData<IQuotationById>> => {
    try {
      const response = await apiGet(`/v1/quotations?id=${quotationId}`);

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getContractCompany: async (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ): Promise<IResponseWithPaginate<IQuotationContractCompany[]>> => {
    const params = new URLSearchParams();
    if (search && search.search !== "") {
      params.set("search", search.search!);
      search.searchKey?.forEach((key) => {
        params.append("searchKey", key);
      });
    }
    if (sort && sort.sortBy !== "") {
      params.set("sortDirection", sort.sortDirection!);
      params.set("sortBy", sort.sortBy!);
    }
    if (queryParams) {
      params.set("page", queryParams.page.toString());
      params.set("limit", queryParams.limit.toString());
    }
    const response = await apiGet(
      "/v1/quotations/contract-company/me",
      params.toString()
    );
    return response;
  },

  // API Patch
  updateQuotationStatusCanceled: async (
    quotationId: string
  ): Promise<IBaseResponse> => {
    const response = await apiPatch(
      `/v1/quotations/status/Canceled?id=${quotationId}`
    );
    return response;
  },

  updateQuotationStatusApproved: async (
    quotationId: string,
    file: FormData
  ): Promise<IBaseResponse> => {
    const response = await apiPatch(
      `/v1/quotations/status/approved?id=${quotationId}`,
      file
    );
    return response;
  },

  updateQuotationToggleActive: async (
    quotationId: string
  ): Promise<IBaseResponse> => {
    const response = await apiPatch(
      `/v1/quotations/toggle/active?id=${quotationId}`
    );
    return response;
  },

  updateQuotationToggleDisabled: async (
    quotationId: string
  ): Promise<IBaseResponse> => {
    const response = await apiPatch(
      `/v1/quotations/toggle/disabled?id=${quotationId}`
    );
    return response;
  },
};
