import { create } from "zustand";

import {
  quotationApi,
  quotationParams,
} from "@/app/services/quotation/quotationApi";
import { IResponseWithPaginate } from "@/app/types/global";
import { EQuotationStatus } from "@/app/types/quotation/quotationEnum";
import {
  IQuotationById,
  IQuotationList,
} from "@/app/types/quotation/quotationType";

type quotationStore = {
  // Params
  quotationParams: quotationParams;
  getQuotationParams: () => quotationParams;
  setQuotationParams: (getAllParams: quotationParams) => void;

  // State
  quotations: IQuotationList[] | null;
  quotationById: IQuotationById | null;

  // Function
  setQuotationById: (data: IQuotationById) => void;

  // API Get
  getQuotationsByStatus: (
    getAllParams: quotationParams
  ) => Promise<IResponseWithPaginate<IQuotationList[]>>;
};

const defaultQuotationParams: quotationParams = {
  page: 1,
  limit: 10,
  status: EQuotationStatus.PENDING,
};

export const useQuotationStore = create<quotationStore>((set, get) => ({
  // Params
  quotationParams: defaultQuotationParams,
  getQuotationParams: () => get().quotationParams,
  setQuotationParams: (getAllParams: quotationParams) => {
    set((state) => ({
      quotationParams: {
        ...state.quotationParams,
        page: getAllParams.page,
        limit: getAllParams.limit,
        total: getAllParams.total,
        totalPages: getAllParams.totalPages,
        status: getAllParams.status,
      },
    }));
  },

  // State
  quotations: null,
  quotationById: null,

  // Function
  setQuotationById: (data: IQuotationById) => set({ quotationById: data }),

  // API Get
  getQuotationsByStatus: async (
    getAllParams: quotationParams
  ): Promise<IResponseWithPaginate<IQuotationList[]>> => {
    try {
      const currentParams = get().quotationParams;
      const response = await quotationApi.getQuotationsByStatus({
        ...currentParams,
        search: getAllParams.search ?? "",
        sort: getAllParams.sort,
        order: getAllParams.order,
        status: getAllParams.status,
      });

      set({
        quotations: response.data,
        quotationParams: {
          ...currentParams,
          page: response.meta.page ?? 1,
          limit: response.meta.limit ?? 10,
          totalPages: response.meta.totalPages,
          total: response.meta.total,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));
