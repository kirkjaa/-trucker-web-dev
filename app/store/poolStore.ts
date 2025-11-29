import { create } from "zustand";

import { poolApi } from "../services/poolApi";
import { IBaseResponse, IMeta, IResponseWithPaginate } from "../types/global";
import { IPoolData, IPoolOfferData } from "../types/poolType";
import {
  PoolFormInputs,
  PoolOfferFormInputs,
} from "../utils/validate/pool-validate";

type PoolStore = {
  poolListData: IPoolData[];
  setPoolListData: (data: IPoolData[]) => void;
  getPoolListData: () => IPoolData[];
  poolOfferListData: IPoolOfferData[];
  setPoolOfferListData: (data: IPoolOfferData[]) => void;
  getPoolOfferListData: () => IPoolOfferData[];
  poolParams: IMeta;
  getPoolParams: () => IMeta;
  setPoolParams: (IMeta: IMeta) => void;
  offerPoolParams: IMeta;
  getOfferPoolParams: () => IMeta;
  setOfferPoolParams: (IMeta: IMeta) => void;
  createPool: (data: PoolFormInputs) => Promise<IBaseResponse>;
  offerPool: (data: PoolOfferFormInputs) => Promise<IBaseResponse>;
  getPoolList: (
    queryParams?: IMeta,
    byType?: string[],
    byOriginProvinces?: string[],
    byTruckSizes?: string[]
  ) => Promise<IResponseWithPaginate<IPoolData[]>>;
  getPoolOfferList: (
    byPostId?: string,
    queryParams?: IMeta
  ) => Promise<IResponseWithPaginate<IPoolOfferData[]>>;
  getPoolMeList: (
    queryParams?: IMeta,
    byType?: string[],
    byOriginProvinces?: string[],
    byTruckSizes?: string[]
  ) => Promise<IResponseWithPaginate<IPoolData[]>>;
  selectedPool: IPoolData | null;
  setSelectedPool: (data: IPoolData | null) => void;
  getSelectedPool: () => IPoolData | null;
  acceptOfferPool: (id: string, postId: string) => Promise<IBaseResponse>;
  rejectOfferPool: (id: string) => Promise<IBaseResponse>;
  selectedProvice: string[];
  setSelectedProvice: (data: string[]) => void;
  getSelectedProvice: () => string[];
  selectedPoolType: string[];
  setSelectedPoolType: (data: string[]) => void;
  getSelectedPoolType: () => string[];
  selectedTruckSize: string[];
  setSelectedTruckSize: (data: string[]) => void;
  getSelectedTruckSize: () => string[];
};

export const usePoolStore = create<PoolStore>((set, get) => ({
  selectedPool: null,
  setSelectedPool: (data: IPoolData | null) => {
    set({ selectedPool: data });
  },
  getSelectedPool: () => get().selectedPool,
  poolListData: [],
  poolOfferListData: [],
  setPoolOfferListData: (data: IPoolOfferData[]) => {
    set({ poolOfferListData: data });
  },
  getPoolOfferListData: () => get().poolOfferListData,
  setPoolListData: (data: IPoolData[]) => {
    set({ poolListData: data });
  },
  getPoolListData: () => get().poolListData,
  poolParams: {
    limit: 10,
    page: 1,
    total: 0,
  },
  getPoolParams: () => get().poolParams,
  setPoolParams: (IMeta: IMeta) => {
    set({ poolParams: IMeta });
  },
  offerPoolParams: {
    limit: 10,
    page: 1,
    total: 0,
  },
  getOfferPoolParams: () => get().offerPoolParams,
  setOfferPoolParams: (IMeta: IMeta) => {
    set({ offerPoolParams: IMeta });
  },
  createPool: async (data: PoolFormInputs) => {
    const response = await poolApi.createPoolPost(data);
    return response;
  },
  offerPool: async (data: PoolOfferFormInputs) => {
    const response = await poolApi.offerPoolPost(data);
    return response;
  },
  getPoolList: async (
    queryParams?: IMeta,
    byType?: string[],
    byOriginProvinces?: string[],
    byTruckSizes?: string[]
  ): Promise<IResponseWithPaginate<IPoolData[]>> => {
    const response = await poolApi.getPoolListData(
      queryParams,
      byType,
      byOriginProvinces,
      byTruckSizes
    );
    set({ poolListData: response.data, poolParams: response.meta });
    return response;
  },
  getPoolMeList: async (
    queryParams?: IMeta,
    byType?: string[],
    byOriginProvinces?: string[],
    byTruckSizes?: string[]
  ): Promise<IResponseWithPaginate<IPoolData[]>> => {
    const response = await poolApi.getPoolMeListData(
      queryParams,
      byType,
      byOriginProvinces,
      byTruckSizes
    );
    set({ poolListData: response.data, poolParams: response.meta });
    return response;
  },
  getPoolOfferList: async (
    byPostId?: string,
    queryParams?: IMeta
  ): Promise<IResponseWithPaginate<IPoolOfferData[]>> => {
    const response = await poolApi.getPoolOfferListData(byPostId, queryParams);
    set({ poolOfferListData: response.data, offerPoolParams: response.meta });
    return response;
  },
  acceptOfferPool: async (
    id: string,
    postId: string
  ): Promise<IBaseResponse> => {
    const response = poolApi.acceptOfferPoolPost(id, postId);
    return response;
  },
  rejectOfferPool: async (id: string): Promise<IBaseResponse> => {
    const response = poolApi.rejectOfferPoolPost(id);
    return response;
  },
  selectedProvice: [],
  setSelectedProvice: (data: string[]) => {
    set({ selectedProvice: data });
  },
  getSelectedProvice: () => get().selectedProvice,
  selectedPoolType: [],
  setSelectedPoolType: (data: string[]) => {
    set({ selectedPoolType: data });
  },
  getSelectedPoolType: () => get().selectedPoolType,
  selectedTruckSize: [],
  setSelectedTruckSize: (data: string[]) => {
    set({ selectedTruckSize: data });
  },
  getSelectedTruckSize: () => get().selectedTruckSize,
}));
