import { ERouteShippingType, ERouteStatus, ERouteType } from "../types/enum";
import {
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "../types/global";
import {
  ICheckDuplicateRequest,
  ICheckDuplicateResponse,
  ICheckDuplicateRouteFactory,
  ICreateRouteCode,
  IResponseCheckDupRoute,
  IRouteData,
  IRoutePriceEntryListData,
} from "../types/routesType";
import { RouteFormInputs } from "../utils/validate/route-validate";

import { apiGet, apiPatch, apiPost } from "./common";

export interface IRouteFactoryListParams extends IMeta {
  search?: string;
  byId?: string;
  byShippingType?: string;
  byStatus?: string;
  byType?: string;
  byFactoryId?: string;
  byOriginDistrict?: string;
  sortBy?: string;
  sortDirection?: string;
}

export const routeApi = {
  // API Get
  getRouteFactoryList: async (
    getAllParams: IRouteFactoryListParams
  ): Promise<IResponseWithPaginate<IRouteData[]>> => {
    const params = new URLSearchParams();
    if (getAllParams.search) {
      params.set("search", getAllParams.search.toString());
    }
    if (getAllParams.byId) {
      params.set("byId", getAllParams.byId.toString());
    }
    if (getAllParams.byShippingType) {
      params.set("byShippingType", getAllParams.byShippingType.toString());
    }
    if (getAllParams.byStatus) {
      params.set("byStatus", getAllParams.byStatus.toString());
    }
    if (getAllParams.byType) {
      params.set("byType", getAllParams.byType.toString());
    }
    if (getAllParams.byFactoryId) {
      params.set("byFactoryId", getAllParams.byFactoryId.toString());
    }
    if (getAllParams.byOriginDistrict) {
      params.set("byOriginDistrict", getAllParams.byOriginDistrict.toString());
    }
    if (getAllParams.sortBy) {
      params.set("sortBy", getAllParams.sortBy.toString());
    }
    if (getAllParams.sortDirection) {
      params.set("sortDirection", getAllParams.sortDirection.toString());
    }
    params.set("page", getAllParams.page.toString());
    params.set("limit", getAllParams.limit.toString());

    try {
      const response = await apiGet("/v1/routes/route", params.toString());

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getAllRouteList: async (
    queryParams?: IMeta,
    byShippingType?: ERouteShippingType,
    byStatus?: ERouteStatus,
    byType?: ERouteType,
    search?: ISearch,
    byFactoryId?: string,
    sort?: ISort
  ): Promise<IResponseWithPaginate<IRouteData[]>> => {
    try {
      const params = new URLSearchParams();
      if (search && search.search !== "") {
        params.set("search", search.search!);
        search.searchKey?.forEach((key) => {
          params.append("searchKey", key);
        });
      }
      if (sort && sort.sortBy !== "") {
        params.set("sortDirection", sort.sortDirection!);
        params.set("sortBy", sort.sortBy!);
      }
      if (queryParams) {
        params.set("page", queryParams.page.toString());
        params.set("limit", queryParams.limit.toString());
      }
      if (byShippingType) {
        params.set("byShippingType", byShippingType.toString());
      }
      if (byStatus) {
        params.set("byStatus", byStatus.toString());
      }
      if (byType) {
        params.set("byType", byType.toString());
      }
      if (byFactoryId) {
        params.set("byFactoryId", byFactoryId.toString());
      }
      const response = await apiGet("/v1/admin/route", params.toString());
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getRoutePriceEntryList: async (
    queryParams?: IMeta,
    byType?: ERouteType
  ): Promise<IResponseWithPaginate<IRoutePriceEntryListData[]>> => {
    try {
      const params = new URLSearchParams();
      if (queryParams) {
        params.set("page", queryParams.page.toString());
        params.set("limit", queryParams.limit.toString());
      }
      if (byType) {
        params.set("byType", byType.toString());
      }
      const response = await apiGet(
        "/v1/routes/master-route/price-entry",
        params.toString()
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // API Post
  checkDuplicateRouteFactory: async (
    data: ICheckDuplicateRouteFactory
  ): Promise<IBaseResponseData<IResponseCheckDupRoute[]>> => {
    try {
      const response = await apiPost("/v1/routes/check-duplicate", data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  createOneRoute: async (data: RouteFormInputs): Promise<IBaseResponse> => {
    try {
      const response = await apiPost("/v1/admin/route/create-one", data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  createManyRoute: async (data: RouteFormInputs[]): Promise<IBaseResponse> => {
    try {
      const payload = { createdRoutes: data };
      const response = await apiPost("/v1/admin/route/create-many", payload);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  checkDuplicateRoute: async (
    data: ICheckDuplicateRequest
  ): Promise<IBaseResponseData<ICheckDuplicateResponse[]>> => {
    try {
      const response = await apiPost("/v1/routes/check-duplicate", data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  createOneFactoryRoute: async (
    data: ICreateRouteCode
  ): Promise<IBaseResponse> => {
    try {
      const response = await apiPost("/v1/routes/create-one", data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  createManyFactoryRoute: async (
    data: ICreateRouteCode[]
  ): Promise<IBaseResponse> => {
    try {
      const response = await apiPost("/v1/routes/create-many", {
        createdRoutes: data,
      });
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // API Patch
  confirmedRoute: async (ids: string[]): Promise<IBaseResponse> => {
    const queryParams = new URLSearchParams();
    ids.forEach((id) => {
      queryParams.append("id", id);
    });
    try {
      const response = await apiPatch(
        `/v1/admin/route/confirmed?${queryParams}`
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  rejectedRoute: async (ids: string[]): Promise<IBaseResponse> => {
    const queryParams = new URLSearchParams();
    ids.forEach((id) => {
      queryParams.append("id", id);
    });
    try {
      const response = await apiPatch(
        `/v1/admin/route/rejected?${queryParams}`
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
