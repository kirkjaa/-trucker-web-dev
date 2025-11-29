import { IBidById, ICreateBid } from "../types/bidsType";
import {
  getAllParams,
  IBaseResponse,
  IBaseResponseData,
  IResponseWithPaginate,
} from "../types/global";

import { apiGet, apiPatch, apiPost } from "./common";

export const bidsApi = {
  // API Get
  getAllBidsList: async (
    getAllParams: getAllParams
  ): Promise<IResponseWithPaginate<IBidById[]>> => {
    const params = new URLSearchParams();

    params.set("name", getAllParams.name ? getAllParams.name.join(",") : "");

    if (getAllParams.value) {
      params.set("value", getAllParams.value);
    }
    if (getAllParams.status) {
      params.set("status", getAllParams.status);
    }

    params.set("page", getAllParams.page.toString());
    params.set("limit", getAllParams.limit.toString());

    try {
      const response = await apiGet("/v1/bids/list", params.toString());
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getBidById: async (bidId: string): Promise<IBaseResponseData<IBidById>> => {
    try {
      const response = await apiGet(`/v1/bids?id=${bidId}`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // API Post
  createBid: async (data: ICreateBid): Promise<IBaseResponseData<IBidById>> => {
    const response = await apiPost("/v1/bids/create", data);
    return response;
  },

  // API Patch
  updateBidStatusSubmitted: async (bidId: string): Promise<IBaseResponse> => {
    const response = await apiPatch(`/v1/bids/status/submitted?id=${bidId}`);
    return response;
  },

  updateBidStatusApproved: async (bidId: string): Promise<IBaseResponse> => {
    const response = await apiPatch(`/v1/bids/status/approved?id=${bidId}`);
    return response;
  },

  updateBidStatusRejected: async (bidId: string): Promise<IBaseResponse> => {
    const response = await apiPatch(`/v1/bids/status/rejected?id=${bidId}`);
    return response;
  },

  updateBidStatusCanceled: async (bidId: string): Promise<IBaseResponse> => {
    const response = await apiPatch(`/v1/bids/status/canceled?id=${bidId}`);
    return response;
  },
};
