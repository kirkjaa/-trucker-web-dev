import { IUser } from "../../types/user/userType";

import { apiDelete, apiGet, apiPatch, apiPost } from "@/app/services/common";
import {
  IBaseParams,
  IBaseResponse,
  IBaseResponseData,
  IResponseWithPaginate,
} from "@/app/types/global";

export interface userParams extends IBaseParams {
  organizationTypeId?: number;
}

export const userApi = {
  // API Get
  getAllUserByTypeId: async (
    getAllParams: userParams
  ): Promise<IResponseWithPaginate<IUser[]>> => {
    const params = new URLSearchParams();
    params.set("page", getAllParams.page.toString());
    params.set("limit", getAllParams.limit.toString());

    if (getAllParams.organizationTypeId)
      params.set(
        "organization_type_id",
        getAllParams.organizationTypeId.toString()
      );

    if (getAllParams.search)
      params.set("search", getAllParams.search.toString());

    if (getAllParams.sort) params.set("sort", getAllParams.sort);
    if (getAllParams.order) params.set("order", getAllParams.order);

    const response = await apiGet("/v1/user", params.toString());

    return response;
  },

  getUserById: async (id: number): Promise<IBaseResponseData<IUser>> => {
    const response = await apiGet(`/v1/user/byId?id=${id}`);

    return response;
  },

  getUserMe: async (): Promise<IBaseResponseData<IUser>> => {
    const response = await apiGet("/v1/user/me");

    return response;
  },

  // API Post
  createUser: async (data: FormData): Promise<IBaseResponse> => {
    const response = await apiPost("/v1/user", data);

    return response;
  },

  // API Patch
  editUser: async (id: number, data: FormData): Promise<IBaseResponse> => {
    const response = await apiPatch(`/v1/user?id=${id}`, data);

    return response;
  },

  // API Delete
  deleteUser: async (id: number): Promise<IBaseResponse> => {
    const response = await apiDelete(`/v1/user?id=${id}`);

    return response;
  },
};
