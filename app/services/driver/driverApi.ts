import { apiDelete, apiGet, apiPatch, apiPost } from "../common";

import { IDriver } from "@/app/types/driver/driverType";
import {
  IBaseParams,
  IBaseResponse,
  IBaseResponseData,
  IResponseWithPaginate,
} from "@/app/types/global";

export interface driverParams extends IBaseParams {
  organizationId?: number;
  status?: string;
}

export const driverApi = {
  // API Get
  getDriversInternal: async (
    getAllParams: driverParams
  ): Promise<IResponseWithPaginate<IDriver[]>> => {
    const params = new URLSearchParams();
    params.set("page", getAllParams.page.toString());
    params.set("limit", getAllParams.limit.toString());

    if (getAllParams.organizationId)
      params.set("organization_id", getAllParams.organizationId.toString());

    if (getAllParams.search)
      params.set("search", getAllParams.search.toString());

    if (getAllParams.sort) params.set("sort", getAllParams.sort);
    if (getAllParams.order) params.set("order", getAllParams.order);

    const response = await apiGet("/v1/driver/internal", params.toString());

    return response;
  },

  getDriversFreelance: async (
    getAllParams: driverParams
  ): Promise<IResponseWithPaginate<IDriver[]>> => {
    const params = new URLSearchParams();
    params.set("page", getAllParams.page.toString());
    params.set("limit", getAllParams.limit.toString());

    if (getAllParams.status)
      params.set("status", getAllParams.status.toString());

    if (getAllParams.search)
      params.set("search", getAllParams.search.toString());

    if (getAllParams.sort) params.set("sort", getAllParams.sort);
    if (getAllParams.order) params.set("order", getAllParams.order);

    const response = await apiGet("/v1/driver/freelance", params.toString());

    return response;
  },

  getDriverById: async (id: number): Promise<IBaseResponseData<IDriver>> => {
    const response = await apiGet(`/v1/driver/byId?id=${id}`);

    return response;
  },

  // API Post
  createDriverInternal: async (data: FormData): Promise<IBaseResponse> => {
    const response = await apiPost("/v1/driver/internal", data);

    return response;
  },

  createDriverFreelance: async (data: FormData): Promise<IBaseResponse> => {
    const response = await apiPost("/v1/driver/freelance", data);

    return response;
  },

  // API Patch
  updateDriverInternal: async (
    id: number,
    data: FormData
  ): Promise<IBaseResponse> => {
    const response = await apiPatch(`/v1/driver/internal?id=${id}`, data);

    return response;
  },

  updateDriverFreelance: async (
    id: number,
    data: FormData
  ): Promise<IBaseResponse> => {
    const response = await apiPatch(`/v1/driver/freelance?id=${id}`, data);

    return response;
  },

  // API Delete
  deleteDriverInternal: async (id: number): Promise<IBaseResponse> => {
    const response = await apiDelete(`/v1/driver/internal?id=${id}`);

    return response;
  },

  deleteDriverFreelance: async (id: number): Promise<IBaseResponse> => {
    const response = await apiDelete(`/v1/driver/freelance?id=${id}`);

    return response;
  },
};
