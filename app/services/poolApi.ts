import { IBaseResponse, IMeta, IResponseWithPaginate } from "../types/global";
import { IPoolData, IPoolOfferData } from "../types/poolType";
import ConvertToformData from "../utils/formData";
import {
  PoolFormInputs,
  PoolOfferFormInputs,
} from "../utils/validate/pool-validate";

import { apiGet, apiPatch, apiPost } from "./common";

export const poolApi = {
  createPoolPost: async (data: PoolFormInputs): Promise<IBaseResponse> => {
    const response = await apiPost("/v1/pool/post", ConvertToformData(data));
    return response;
  },
  offerPoolPost: async (data: PoolOfferFormInputs): Promise<IBaseResponse> => {
    const response = await apiPost("/v1/pool/post-offer", data);
    return response;
  },
  acceptOfferPoolPost: async (
    id: string,
    postId: string
  ): Promise<IBaseResponse> => {
    const payload = {
      id,
      postId,
    };
    const response = await apiPatch("/v1/pool/post-offer/accept", payload);
    return response;
  },
  rejectOfferPoolPost: async (id: string): Promise<IBaseResponse> => {
    const payload = {
      id,
    };
    const response = await apiPatch("/v1/pool/post-offer/reject", payload);
    return response;
  },
  getPoolOfferListData: async (
    byPostId?: string,
    queryParams?: IMeta
  ): Promise<IResponseWithPaginate<IPoolOfferData[]>> => {
    const params = new URLSearchParams();
    if (queryParams) {
      params.set("page", queryParams.page.toString());
      params.set("limit", queryParams.limit.toString());
    }
    if (byPostId) {
      params.set("byPostId", byPostId);
    }
    const response = await apiGet("/v1/pool/post-offer", params.toString());
    return response;
  },
  getPoolListData: async (
    queryParams?: IMeta,
    byType?: string[],
    byOriginProvinces?: string[],
    byTruckSizes?: string[]
  ): Promise<IResponseWithPaginate<IPoolData[]>> => {
    const params = new URLSearchParams();
    if (queryParams) {
      params.set("page", queryParams.page.toString());
      params.set("limit", queryParams.limit.toString());
    }
    if (byType) {
      byType?.forEach((key) => {
        params.append("byTypes", key);
      });
    }
    if (byOriginProvinces) {
      byOriginProvinces?.forEach((key) => {
        params.append("byOriginProvinces", key);
      });
    }
    if (byTruckSizes) {
      byTruckSizes?.forEach((key) => {
        params.append("byTruckSizes", key);
      });
    }
    const response = await apiGet("/v1/pool/post", params.toString());
    return response;
  },
  getPoolMeListData: async (
    queryParams?: IMeta,
    byType?: string[],
    byOriginProvinces?: string[],
    byTruckSizes?: string[]
  ): Promise<IResponseWithPaginate<IPoolData[]>> => {
    const params = new URLSearchParams();
    if (queryParams) {
      params.set("page", queryParams.page.toString());
      params.set("limit", queryParams.limit.toString());
    }
    if (byType) {
      byType?.forEach((key) => {
        params.append("byTypes", key);
      });
    }
    if (byOriginProvinces) {
      byOriginProvinces?.forEach((key) => {
        params.append("byOriginProvinces", key);
      });
    }
    if (byTruckSizes) {
      byTruckSizes?.forEach((key) => {
        params.append("byTruckSizes", key);
      });
    }
    const response = await apiGet("/v1/pool/post/me", params.toString());
    return response;
  },
};
