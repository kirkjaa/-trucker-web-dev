import { IOrganization } from "../../types/organization/organizationType";

import { apiDelete, apiGet, apiPatch, apiPost } from "@/app/services/common";
import {
  IBaseParams,
  IBaseResponse,
  IBaseResponseData,
  IResponseWithPaginate,
} from "@/app/types/global";

export interface organizationParams extends IBaseParams {
  typeId?: number;
}

export const organizationApi = {
  // API Get
  getOrganizationsByTypeId: async (
    getAllParams: organizationParams
  ): Promise<IResponseWithPaginate<IOrganization[]>> => {
    const params = new URLSearchParams();
    params.set("page", getAllParams.page.toString());
    params.set("limit", getAllParams.limit.toString());

    if (getAllParams.typeId)
      params.set("typeId", getAllParams.typeId.toString());

    if (getAllParams.search)
      params.set("search", getAllParams.search.toString());

    if (getAllParams.sort) params.set("sort", getAllParams.sort);
    if (getAllParams.order) params.set("order", getAllParams.order);

    try {
      const response = await apiGet("/v1/organization", params.toString());
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getOrganizationById: async (
    id: number
  ): Promise<IBaseResponseData<IOrganization>> => {
    const response = await apiGet(`/v1/organization/byId?id=${id}`);

    return response;
  },

  // API Post
  createOrganization: async (data: FormData) => {
    const response = await apiPost("/v1/organization", data);

    return response;
  },

  // API Patch
  updateOrganization: async (
    id: number,
    data: FormData
  ): Promise<IBaseResponseData<IOrganization>> => {
    const response = await apiPatch(`/v1/organization?id=${id}`, data);

    return response;
  },

  // API Delete
  deleteOrganizationById: async (id: number): Promise<IBaseResponse> => {
    const response = await apiDelete(`/v1/organization?id=${id}`);

    return response;
  },
};
