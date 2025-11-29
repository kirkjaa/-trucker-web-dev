import { apiGet, apiPatch, apiPost } from "../common";

import {
  IBaseParams,
  IBaseResponse,
  IBaseResponseData,
  IResponseWithPaginate,
} from "@/app/types/global";
import { EOfferStatus } from "@/app/types/offer/offerEnum";
import { ICreateOffer, IOffer, IOfferById } from "@/app/types/offer/offerType";

export interface offerParams extends IBaseParams {
  type: string;
  status: string;
}

export const offerApi = {
  // API Get
  getOfferByStatus: async (
    getAllParams: offerParams
  ): Promise<
    IResponseWithPaginate<
      Omit<IOffer, "signature" | "price_column" | "routes">[]
    >
  > => {
    const params = new URLSearchParams();
    params.set("page", getAllParams.page.toString());
    params.set("limit", getAllParams.limit.toString());
    params.set("type", getAllParams.type.toString());
    params.set("status", getAllParams.status.toString());

    if (getAllParams.search)
      params.set("search", getAllParams.search.toString());

    if (getAllParams.sort) params.set("sort", getAllParams.sort);
    if (getAllParams.order) params.set("order", getAllParams.order);

    try {
      const response = await apiGet("/v1/offer/ByStatus", params.toString());
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getOfferById: async (id: number): Promise<IBaseResponseData<IOfferById>> => {
    const response = await apiGet(`/v1/offer/ById?id=${id}`);

    return response;
  },

  // API Post
  createOffer: async (data: ICreateOffer): Promise<IBaseResponse> => {
    const response = await apiPost("/v1/offer", data);

    return response;
  },

  // API Patch
  updateOfferStatus: async (
    id: number,
    status: EOfferStatus
  ): Promise<IBaseResponse> => {
    const response = await apiPatch(`/v1/offer/updateStatus?id=${id}`, {
      status,
    });

    return response;
  },
};
