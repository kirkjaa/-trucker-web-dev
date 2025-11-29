import { create } from "zustand";

import { bidsApi } from "../services/bidsApi";
import { IBidById, ICreateBid } from "../types/bidsType";
import {
  getAllParams,
  IBaseResponse,
  IBaseResponseData,
  IResponseWithPaginate,
} from "../types/global";

type bidsStore = {
  // Search
  bidsParams: getAllParams;
  getBidsParams: () => getAllParams;
  setBidsParams: (getAllParams: getAllParams) => void;

  // State
  allBidsList: IBidById[] | null;
  bidById: IBidById | null;

  // ManyBids
  bidIds: string[];
  setBidIds: (bidIds: string[]) => void;
  unCheckBidIds: (bidId: string) => void;

  // API Get
  getAllBidsList: (
    getAllParams: getAllParams
  ) => Promise<IResponseWithPaginate<IBidById[]>>;
  getBidById: (bidId: string) => Promise<IBaseResponseData<IBidById>>;

  // API Post
  createBid: (data: ICreateBid) => Promise<IBaseResponseData<IBidById>>;

  // API Patch
  updateBidStatusSubmitted: (bidId: string) => Promise<IBaseResponse>;
  updateBidStatusApproved: (bidId: string) => Promise<IBaseResponse>;
  updateBidStatusRejected: (bidId: string) => Promise<IBaseResponse>;
  updateBidStatusCanceled: (bidId: string) => Promise<IBaseResponse>;
};

const defaultBidsSearchParams: getAllParams = {
  page: 1,
  limit: 10,
  totalPages: 10,
  total: 0,
  name: [],
  value: "",
  status: "",
};

export const useBidsStore = create<bidsStore>((set, get) => ({
  // Search
  bidsParams: defaultBidsSearchParams,
  getBidsParams: () => get().bidsParams,
  setBidsParams: (getAllParams: getAllParams) => {
    set((state) => ({
      bidsParams: {
        ...state.bidsParams,
        page: getAllParams.page ?? 1,
        limit: getAllParams.limit ?? 10,
        total: getAllParams.total ?? 0,
        totalPages: getAllParams.totalPages ?? 10,
        name: getAllParams.name ?? undefined,
        value: getAllParams.value ?? "",
        status: getAllParams.status ?? "",
      },
    }));
  },

  // State
  allBidsList: null,
  bidById: null,

  // Many Bids
  bidIds: [],
  setBidIds: (bidIds: string[]) => {
    set({ bidIds });
  },
  unCheckBidIds: (bidId: string) => {
    set((state) => ({
      bidIds: state.bidIds.filter((id) => id !== bidId),
    }));
  },

  // API Get
  getAllBidsList: async (getAllParams: getAllParams) => {
    // const { globalParams, setGlobalParams } = useGlobalStore.getState();
    // const currentParams = globalParams;
    const currentParams = get().bidsParams;
    const response = await bidsApi.getAllBidsList({
      ...currentParams,
      page: getAllParams.page ?? 1,
      limit: getAllParams.limit ?? 10,
      totalPages: getAllParams.totalPages ?? 10,
      total: getAllParams.total ?? 0,
      name: getAllParams.name ?? undefined,
      value: getAllParams.value ?? "",
      status: getAllParams.status ?? "",
    });

    // setGlobalParams({
    //   ...currentParams,
    //   page: response.meta.page ?? 1,
    //   limit: response.meta.limit ?? 10,
    //   totalPages: response.meta.totalPages,
    //   total: response.meta.total,
    //   name: getAllParams.name ?? undefined,
    //   value: getAllParams.value ?? "",
    //   status: getAllParams.status ?? "",
    // });

    set({
      allBidsList: response.data,
      bidsParams: {
        ...currentParams,
        page: response.meta.page ?? 1,
        limit: response.meta.limit ?? 10,
        totalPages: response.meta.totalPages,
        total: response.meta.total,
        name: getAllParams.name ?? undefined,
        value: getAllParams.value ?? "",
        status: getAllParams.status ?? "",
      },
    });

    return response;
  },

  getBidById: async (bidId: string): Promise<IBaseResponseData<IBidById>> => {
    const response = await bidsApi.getBidById(bidId);
    set({ bidById: response.data });
    return response;
  },

  // API Post
  createBid: async (data: ICreateBid): Promise<IBaseResponseData<IBidById>> => {
    const response = await bidsApi.createBid(data);
    return response;
  },

  // API Patch
  updateBidStatusSubmitted: async (bidId: string): Promise<IBaseResponse> => {
    const response = await bidsApi.updateBidStatusSubmitted(bidId);
    return response;
  },
  updateBidStatusApproved: async (bidId: string): Promise<IBaseResponse> => {
    const response = await bidsApi.updateBidStatusApproved(bidId);
    return response;
  },
  updateBidStatusRejected: async (bidId: string): Promise<IBaseResponse> => {
    const response = await bidsApi.updateBidStatusRejected(bidId);
    return response;
  },

  updateBidStatusCanceled: async (bidId: string): Promise<IBaseResponse> => {
    const response = await bidsApi.updateBidStatusCanceled(bidId);
    return response;
  },
}));
