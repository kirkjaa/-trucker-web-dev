import { create } from "zustand";

import { rfqApi } from "../services/rfqApi";
import {
  getAllParams,
  IBaseResponse,
  IBaseResponseData,
  IResponseWithPaginate,
} from "../types/global";
import { ICreateRfq, IRfqById, IRfqOil } from "../types/rfqType";

type rfqStore = {
  // Search
  rfqParams: getAllParams;
  getRfqSearchParams: () => getAllParams;
  setRfqSearchParams: (getAllParams: getAllParams) => void;

  // State
  allRfqList: IRfqById[] | null;
  rfqById: IRfqById | null;
  rfqOil: IRfqOil[] | null;

  // API Get
  getAllRfqList: (
    getAllParams: getAllParams
  ) => Promise<IResponseWithPaginate<IRfqById[]>>;
  getRfqById: (rfqId: string) => Promise<IBaseResponseData<IRfqById>>;
  getRfqOil: () => Promise<IRfqOil[]>;

  // API Post
  createRfq: (data: ICreateRfq) => Promise<IBaseResponseData<IRfqById>>;

  // API Patch
  updateRfqStatusCanceled: (rfqId: string) => Promise<IBaseResponse>;
  updateRfqToggleActive: (rfqId: string) => Promise<IBaseResponse>;
  updateRfqToggleDisabled: (rfqId: string) => Promise<IBaseResponse>;
};

const defaulRfqSearchParams: getAllParams = {
  page: 1,
  limit: 10,
  totalPages: 10,
  total: 0,
  name: [],
  value: "",
  status: "",
  isActive: "",
  bidStatus: "",
};

export const useRfqStore = create<rfqStore>((set, get) => ({
  // Search
  rfqParams: defaulRfqSearchParams,
  getRfqSearchParams: () => get().rfqParams,
  setRfqSearchParams: (getAllParams: getAllParams) => {
    set((state) => ({
      rfqParams: {
        ...state.rfqParams,
        page: getAllParams.page ?? 1,
        limit: getAllParams.limit ?? 10,
        total: getAllParams.total ?? 0,
        totalPages: getAllParams.totalPages ?? 10,
        name: getAllParams.name ?? undefined,
        value: getAllParams.value ?? "",
        status: getAllParams.status ?? "",
        isActive: getAllParams.isActive ?? "",
        bidStatus: getAllParams.bidStatus ?? "",
      },
    }));
  },

  // State
  allRfqList: null,
  rfqById: null,
  rfqOil: null,

  // API Get
  getAllRfqList: async (
    getAllParams: getAllParams
  ): Promise<IResponseWithPaginate<IRfqById[]>> => {
    const currentParams = get().rfqParams;
    const response = await rfqApi.getAllRfqList({
      ...currentParams,
      page: getAllParams.page ?? 1,
      limit: getAllParams.limit ?? 10,
      totalPages: getAllParams.totalPages ?? 10,
      total: getAllParams.total ?? 0,
      name: getAllParams.name ?? [],
      value: getAllParams.value ?? "",
      status: getAllParams.status ?? "",
      isActive: getAllParams.isActive ?? "",
      bidStatus: getAllParams.bidStatus ?? "",
    });

    set({
      allRfqList: response.data,
      rfqParams: {
        ...currentParams,
        page: response.meta.page ?? 1,
        limit: response.meta.limit ?? 10,
        totalPages: response.meta.totalPages,
        total: response.meta.total,
        name: getAllParams.name ?? [],
        value: getAllParams.value ?? "",
        status: getAllParams.status ?? "",
        isActive: getAllParams.isActive ?? "",
        bidStatus: getAllParams.bidStatus ?? "",
      },
    });

    return response;
  },

  getRfqById: async (rfqId: string): Promise<IBaseResponseData<IRfqById>> => {
    const response = await rfqApi.getRfqById(rfqId);

    set({ rfqById: response.data });
    return response;
  },

  getRfqOil: async (): Promise<IRfqOil[]> => {
    const response = await rfqApi.getRfqOil();
    set({ rfqOil: response });
    return response;
  },

  // API Post
  createRfq: async (data: ICreateRfq): Promise<IBaseResponseData<IRfqById>> => {
    const response = await rfqApi.createRfq(data);
    return response;
  },

  // API Patch
  updateRfqStatusCanceled: async (rfqId: string): Promise<IBaseResponse> => {
    const response = await rfqApi.updateRfqStatusCanceled(rfqId);
    return response;
  },

  updateRfqToggleActive: async (rfqId: string): Promise<IBaseResponse> => {
    const response = await rfqApi.updateRfqToggleActive(rfqId);
    return response;
  },

  updateRfqToggleDisabled: async (rfqId: string): Promise<IBaseResponse> => {
    const response = await rfqApi.updateRfqToggleDisabled(rfqId);
    return response;
  },
}));
