import { create } from "zustand";

import { coinsApi } from "../services/coinsApi";
import { ICoinsByTruckerId, ICoinsData } from "../types/coinsType";
import { CoinsType } from "../types/enum";
import {
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
} from "../types/global";

type coinsStore = {
  getAllCoinsList: (
    queryParams?: IMeta,
    byType?: CoinsType,
    search?: string
  ) => Promise<IResponseWithPaginate<ICoinsData[]>>;
  coinsList: ICoinsData[];
  coinsParams: IMeta;
  getCoinsParams: () => IMeta;
  setCoinsParams: (IMeta: IMeta) => void;
  getCoinsByTruckerId: (
    truckerId: string
  ) => Promise<IBaseResponseData<ICoinsByTruckerId>>;
  coinsByTruckerData: ICoinsByTruckerId | null;
  setCoinsByTruckerData: (data: ICoinsByTruckerId) => void;
  getCoinsByTruckerData: () => ICoinsByTruckerId | null;
};

export const useCoinsStore = create<coinsStore>((set, get) => ({
  coinsList: [],
  coinsParams: {
    page: 1,
    limit: 10,
    total: 0,
  },
  getCoinsParams: () => get().coinsParams,
  setCoinsParams: (IMeta: IMeta) => {
    set({ coinsParams: { ...get().coinsParams, ...IMeta } });
  },
  getAllCoinsList: async (
    queryParams?: IMeta,
    byType?: CoinsType,
    search?: string
  ): Promise<IResponseWithPaginate<ICoinsData[]>> => {
    const response = await coinsApi.getAllCoinsList(
      queryParams,
      byType,
      search
    );
    set({ coinsList: response.data, coinsParams: response.meta });
    return response;
  },
  coinsByTruckerData: null,
  setCoinsByTruckerData: (data: ICoinsByTruckerId) => {
    set({ coinsByTruckerData: data });
  },
  getCoinsByTruckerData: () => get().coinsByTruckerData,
  getCoinsByTruckerId: async (
    truckerId: string
  ): Promise<IBaseResponseData<ICoinsByTruckerId>> => {
    const response = await coinsApi.getCoinsByTruckerId(truckerId);
    set({ coinsByTruckerData: response.data });
    return response;
  },
}));
