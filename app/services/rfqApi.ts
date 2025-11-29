import {
  getAllParams,
  IBaseResponse,
  IBaseResponseData,
  IResponseWithPaginate,
} from "../types/global";
import { ICreateRfq, IRfqById, IRfqOil } from "../types/rfqType";

import { apiGet, apiPatch, apiPost } from "./common";

export const rfqApi = {
  // API Get
  getAllRfqList: async (
    getAllParams: getAllParams
  ): Promise<IResponseWithPaginate<IRfqById[]>> => {
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
      const response = await apiGet("/v1/rfqs/list", params.toString());
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getRfqById: async (rfqId: string): Promise<IBaseResponseData<IRfqById>> => {
    try {
      const response = await apiGet(`/v1/rfqs?id=${rfqId}`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getRfqOil: async (): Promise<IRfqOil[]> => {
    try {
      const response = await apiGet("/v1/rfqs/get/oil");
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // API Post
  createRfq: async (data: ICreateRfq): Promise<IBaseResponseData<IRfqById>> => {
    const response = await apiPost("/v1/rfqs/create", data);
    return response;
  },

  // API Patch
  updateRfqStatusCanceled: async (rfqId: string): Promise<IBaseResponse> => {
    const response = await apiPatch(`/v1/rfqs/status/canceled?id=${rfqId}`);
    return response;
  },

  updateRfqToggleActive: async (rfqId: string): Promise<IBaseResponse> => {
    const response = await apiPatch(`/v1/rfqs/toggle/active?id=${rfqId}`);
    return response;
  },

  updateRfqToggleDisabled: async (rfqId: string): Promise<IBaseResponse> => {
    const response = await apiPatch(`/v1/rfqs/toggle/disabled?id=${rfqId}`);
    return response;
  },
};
