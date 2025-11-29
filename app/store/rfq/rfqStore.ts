import { create } from "zustand";

import { rfqApi, rfqParams } from "@/app/services/rfq/rfqApi";
import { IResponseWithPaginate } from "@/app/types/global";
import { IRfqList } from "@/app/types/rfq/rfqType";

type rfqStore = {
  // Params
  rfqParams: rfqParams;
  getRfqParams: () => rfqParams;
  setRfqParams: (getAllParams: rfqParams) => void;

  // State
  rfqs: IRfqList[] | null;
  rfqsReceived: Omit<IRfqList, "offers">[] | null;
  rfqReceivedById: IRfqList | null;

  // Function
  setRfqReceivedById: (data: IRfqList) => void;

  // API Get
  getRfqs: (
    getAllParams: rfqParams
  ) => Promise<IResponseWithPaginate<IRfqList[]>>;
  getRfqsReceived: (
    getAllParams: rfqParams
  ) => Promise<IResponseWithPaginate<Omit<IRfqList, "offers">[]>>;
};

const defaultRfqParams: rfqParams = {
  page: 1,
  limit: 10,
  type: "",
};

export const useRfqStore = create<rfqStore>((set, get) => ({
  // Params
  rfqParams: defaultRfqParams,
  getRfqParams: () => get().rfqParams,
  setRfqParams: (getAllParams: rfqParams) => {
    set((state) => ({
      rfqParams: {
        ...state.rfqParams,
        page: getAllParams.page ?? 1,
        limit: getAllParams.limit ?? 10,
        total: getAllParams.total ?? 0,
        totalPages: getAllParams.totalPages ?? 10,
        type: getAllParams.type ?? "",
      },
    }));
  },

  // State
  rfqs: null,
  rfqsReceived: null,
  rfqReceivedById: null,

  // Function
  setRfqReceivedById: (data) => set({ rfqReceivedById: data }),

  // API Get
  getRfqs: async (
    getAllParams: rfqParams
  ): Promise<IResponseWithPaginate<IRfqList[]>> => {
    try {
      const currentParams = get().rfqParams;
      const response = await rfqApi.getRfqs({
        ...currentParams,
        search: getAllParams.search ?? "",
        sort: getAllParams.sort,
        order: getAllParams.order,
      });

      set({
        rfqs: response.data,
        rfqParams: {
          ...currentParams,
          page: response.meta.page ?? 1,
          limit: response.meta.limit ?? 10,
          totalPages: response.meta.totalPages,
          total: response.meta.total ?? 0,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getRfqsReceived: async (
    getAllParams: rfqParams
  ): Promise<IResponseWithPaginate<Omit<IRfqList, "offers">[]>> => {
    try {
      const currentParams = get().rfqParams;
      const response = await rfqApi.getRfqsReceived({
        ...currentParams,
        search: getAllParams.search ?? "",
        sort: getAllParams.sort,
        order: getAllParams.order,
        type: getAllParams.type,
      });

      set({
        rfqsReceived: response.data,
        rfqParams: {
          ...currentParams,
          page: response.meta.page ?? 1,
          limit: response.meta.limit ?? 10,
          totalPages: response.meta.totalPages,
          total: response.meta.total ?? 0,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));
