import { apiDelete, apiGet, apiPost } from "../common";

import {
  IBaseParams,
  IBaseResponse,
  IBaseResponseData,
  IResponseWithPaginate,
} from "@/app/types/global";
import { EQuotationStatus } from "@/app/types/quotation/quotationEnum";
import {
  IQuotationById,
  IQuotationList,
} from "@/app/types/quotation/quotationType";

export interface quotationParams extends IBaseParams {
  status?: EQuotationStatus;
}

export const quotationApi = {
  // API Get
  getQuotationsByStatus: async (
    getAllParams: quotationParams
  ): Promise<IResponseWithPaginate<IQuotationList[]>> => {
    const params = new URLSearchParams();
    params.set("page", getAllParams.page.toString());
    params.set("limit", getAllParams.limit.toString());

    if (getAllParams.status)
      params.set("status", getAllParams.status.toString());

    if (getAllParams.search)
      params.set("search", getAllParams.search.toString());

    if (getAllParams.sort) params.set("sort", getAllParams.sort);
    if (getAllParams.order) params.set("order", getAllParams.order);

    try {
      const response = await apiGet(
        "/v1/quotation/byStatus",
        params.toString()
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getQuotationById: async (
    id: number
  ): Promise<IBaseResponseData<IQuotationById>> => {
    const response = await apiGet(`/v1/quotation/byId?id=${id}`);

    return response;
  },

  // API Post
  createQuotation: async (
    rfqId: number,
    offerId: number
  ): Promise<IBaseResponse> => {
    const response = await apiPost("/v1/quotation", {
      rfq_id: rfqId,
      offer_id: offerId,
    });

    return response;
  },

  attachFile: async (data: FormData): Promise<IBaseResponse> => {
    const response = await apiPost("/v1/quotation/attach-file", data);

    return response;
  },

  // API Delete
  deleteQuotation: async (id: number): Promise<IBaseResponse> => {
    const response = await apiDelete(`/v1/quotation?id=${id}`);

    return response;
  },
};
