import { create } from "zustand";

import { offerApi, offerParams } from "@/app/services/offer/offerApi";
import { IResponseWithPaginate } from "@/app/types/global";
import { IOffer, IOfferById } from "@/app/types/offer/offerType";

type offerStore = {
  // Params
  offerParams: offerParams;
  getOfferParams: () => offerParams;
  setOfferParams: (getAllParams: offerParams) => void;

  // State
  offers: Omit<IOffer, "signature" | "price_column" | "routes">[] | null;
  offerById: IOfferById | null;

  // Function
  setOfferById: (data: IOfferById | null) => void;

  // API Get
  getOfferByStatus: (
    getAllParams: offerParams
  ) => Promise<
    IResponseWithPaginate<
      Omit<IOffer, "signature" | "price_column" | "routes">[]
    >
  >;
};

const defaultOfferParams: offerParams = {
  page: 1,
  limit: 10,
  type: "",
  status: "",
};

export const useOfferStore = create<offerStore>((set, get) => ({
  // Params
  offerParams: defaultOfferParams,
  getOfferParams: () => get().offerParams,
  setOfferParams: (getAllParams: offerParams) => {
    set((state) => ({
      offerParams: {
        ...state.offerParams,
        page: getAllParams.page ?? 1,
        limit: getAllParams.limit ?? 10,
        total: getAllParams.total ?? 0,
        totalPages: getAllParams.totalPages ?? 10,
        type: getAllParams.type ?? "",
        status: getAllParams.status ?? "",
      },
    }));
  },

  // State
  offers: null,
  offerById: null,

  // Function
  setOfferById: (data) => set({ offerById: data }),

  // API Get
  getOfferByStatus: async (
    getAllParams: offerParams
  ): Promise<
    IResponseWithPaginate<
      Omit<IOffer, "signature" | "price_column" | "routes">[]
    >
  > => {
    try {
      const currentParams = get().offerParams;
      const response = await offerApi.getOfferByStatus({
        ...currentParams,
        search: getAllParams.search ?? "",
        sort: getAllParams.sort,
        order: getAllParams.order,
        type: getAllParams.type,
        status: getAllParams.status,
      });

      set({
        offers: response.data,
        offerParams: {
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
