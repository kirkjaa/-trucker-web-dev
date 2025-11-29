import { ICoinsByTruckerId, ICoinsData } from "../types/coinsType";
import { CoinsType } from "../types/enum";
import {
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
} from "../types/global";

import { apiGet } from "./common";

export const coinsApi = {
  getAllCoinsList: async (
    queryParams?: IMeta,
    byType?: CoinsType,
    search?: string
  ): Promise<IResponseWithPaginate<ICoinsData[]>> => {
    const params = new URLSearchParams();
    if (byType) {
      params.set("byType", byType.toString());
    }
    if (search) {
      params.set("search", search);
    }
    if (queryParams) {
      params.set("page", queryParams.page.toString());
      params.set("limit", queryParams.limit.toString());
    }
    const response = await apiGet(
      "/v1/admin/balance/transaction",
      params.toString()
    );
    return response;
  },
  getCoinsByTruckerId: async (
    truckerId: string
  ): Promise<IBaseResponseData<ICoinsByTruckerId>> => {
    const response = await apiGet(`/v1/admin/balance/${truckerId}`);
    return response;
  },
};
