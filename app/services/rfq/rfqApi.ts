import { apiDelete, apiGet, apiPatch, apiPost } from "../common";

import {
  IBaseParams,
  IBaseResponse,
  IBaseResponseData,
  IResponseWithPaginate,
} from "@/app/types/global";
import { ICreateRfq, IRfqById, IRfqList } from "@/app/types/rfq/rfqType";

export interface rfqParams extends IBaseParams {
  type?: string;
}

export const rfqApi = {
  // API Get
  getRfqs: async (
    getAllParams: rfqParams
  ): Promise<IResponseWithPaginate<IRfqList[]>> => {
    const params = new URLSearchParams();
    params.set("page", getAllParams.page.toString());
    params.set("limit", getAllParams.limit.toString());

    if (getAllParams.search)
      params.set("search", getAllParams.search.toString());

    if (getAllParams.sort) params.set("sort", getAllParams.sort);
    if (getAllParams.order) params.set("order", getAllParams.order);

    try {
      const response = await apiGet("/v1/rfq", params.toString());
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getRfqsReceived: async (
    getAllParams: rfqParams
  ): Promise<IResponseWithPaginate<IRfqList[]>> => {
    const params = new URLSearchParams();
    params.set("page", getAllParams.page.toString());
    params.set("limit", getAllParams.limit.toString());

    if (getAllParams.type) params.set("type", getAllParams.type.toString());

    if (getAllParams.search)
      params.set("search", getAllParams.search.toString());

    if (getAllParams.sort) params.set("sort", getAllParams.sort);
    if (getAllParams.order) params.set("order", getAllParams.order);

    try {
      const response = await apiGet("/v1/rfq/received", params.toString());
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getRfqById: async (id: number): Promise<IBaseResponseData<IRfqById>> => {
    const response = await apiGet(`/v1/rfq/postById?id=${id}`);

    return response;
  },

  getRfqReceivedById: async (
    id: number
  ): Promise<IBaseResponseData<IRfqList>> => {
    const response = await apiGet(`/v1/rfq/receivedById?id=${id}`);

    return response;
  },

  // API Post
  createRfq: async (data: ICreateRfq): Promise<IBaseResponseData<IRfqById>> => {
    const response = await apiPost("/v1/rfq", data);

    return response;
  },

  // API Patch
  isActiveRfq: async (
    id: number,
    isActive: boolean
  ): Promise<IBaseResponse> => {
    const response = await apiPatch("/v1/rfq/active", {
      id,
      is_active: isActive,
    });

    return response;
  },

  // API Delete
  deleteRfq: async (id: number): Promise<IBaseResponse> => {
    const response = await apiDelete(`/v1/rfq?id=${id}`);

    return response;
  },
};
