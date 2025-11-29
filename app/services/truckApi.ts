import { ETruckDepartmentType } from "../types/enum";
import {
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "../types/global";
import {
  ITruckMeTotal,
  IUpdateLocationTruckRequest,
  TrucksListTable,
} from "../types/truckType";
import ConvertToformData from "../utils/formData";
import { TruckFormInputs } from "../utils/validate/truck-validate";

import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "./common";

export const truckApi = {
  // API Get
  getAllTruckList: async (
    getAllParams?: IMeta,
    byId?: string,
    search?: ISearch,
    sort?: ISort
  ): Promise<IResponseWithPaginate<TrucksListTable[]>> => {
    const params = new URLSearchParams();
    if (byId) {
      params.set("byId", byId);
    }
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
    if (getAllParams) {
      params.set("page", getAllParams.page.toString());
      params.set("limit", getAllParams.limit.toString());
    }
    const data = await apiGet("/v1/truck", params.toString());
    return data;
  },

  getAllFactoryTruckList: async (
    getAllParams?: IMeta,
    byId?: string,
    search?: ISearch,
    sort?: ISort,
    byDepartmentType?: ETruckDepartmentType
  ): Promise<IResponseWithPaginate<TrucksListTable[]>> => {
    const params = new URLSearchParams();
    if (byId) {
      params.set("byId", byId);
    }
    if (search && search.search !== "") {
      params.set("search", search.search!);
      search.searchKey?.forEach((key) => {
        params.append("searchKey", key);
      });
    }
    if (byDepartmentType) {
      params.set("byDepartmentType", byDepartmentType);
    }
    if (sort && sort.sortBy !== "") {
      params.set("sortDirection", sort.sortDirection!);
      params.set("sortBy", sort.sortBy!);
    }
    if (getAllParams) {
      params.set("page", getAllParams.page.toString());
      params.set("limit", getAllParams.limit.toString());
    }
    const data = await apiGet("/v1/truck/factory/me", params.toString());
    return data;
  },

  getAllCompanyTruckList: async (
    getAllParams?: IMeta,
    byId?: string,
    search?: ISearch,
    sort?: ISort,
    byDepartmentType?: ETruckDepartmentType,
    isAvailable?: boolean
  ): Promise<IResponseWithPaginate<TrucksListTable[]>> => {
    const params = new URLSearchParams();
    if (byId) {
      params.set("byId", byId);
    }
    if (byDepartmentType) {
      params.set("byDepartmentType", byDepartmentType);
    }
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
    if (getAllParams) {
      params.set("page", getAllParams.page.toString());
      params.set("limit", getAllParams.limit.toString());
    }
    if (isAvailable) {
      params.set("isAvailable", isAvailable.toString());
    }
    const data = await apiGet("/v1/truck/company/me", params.toString());
    return data;
  },

  getTruckById: async (
    id: string
  ): Promise<IBaseResponseData<TrucksListTable>> => {
    const data = await apiGet(`/v1/truck/${id}`);
    return data;
  },

  getTruckType: async (): Promise<IBaseResponseData<string[]>> => {
    const res = await apiGet("/v1/truck/type");
    return res;
  },

  getTruckSize: async (): Promise<IBaseResponseData<string[]>> => {
    const res = await apiGet("/v1/truck/size");
    return res;
  },

  // API Post
  createTruck: async (
    data: TruckFormInputs
  ): Promise<IBaseResponseData<TrucksListTable>> => {
    const response = await apiPost("/v1/truck", ConvertToformData(data));
    return response;
  },

  // API Patch
  changeTruckStatus: async (id: string, status: boolean) => {
    const data = await apiPatch(`/v1/truck/${id}/status`, { isActive: status });
    return data;
  },

  updateTruck: async (
    data: TruckFormInputs,
    id: string
  ): Promise<IBaseResponseData<TrucksListTable>> => {
    const response = await apiPut(`/v1/truck/${id}`, ConvertToformData(data));
    return response;
  },

  updateLocationTruck: async (
    data: IUpdateLocationTruckRequest,
    id: string
  ): Promise<IBaseResponseData<TrucksListTable>> => {
    const response = await apiPatch(`/v1/truck/${id}/location`, data);
    return response;
  },

  // API Delete
  deleteTruck: async (id: string[]) => {
    const queryParams = new URLSearchParams();
    id.forEach((id) => {
      queryParams.append("id", id);
    });
    const data = await apiDelete(`/v1/truck?${queryParams}`);
    return data;
  },
  getTruckMeTotal: async (): Promise<IBaseResponseData<ITruckMeTotal>> => {
    const data = await apiGet("/v1/truck/me/total");
    return data;
  },
};
