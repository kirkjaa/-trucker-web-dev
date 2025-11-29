import { apiDelete, apiGet, apiPatch, apiPost } from "../common";

import { PackageForm } from "@/app/features/admin/packages/validate/package";
import {
  IBaseParams,
  IBaseResponse,
  IBaseResponseData,
  IResponseWithPaginate,
} from "@/app/types/global";
import { IPackage } from "@/app/types/package/packageType";

export interface packageParams extends IBaseParams {}

export const packageApi = {
  // API Get
  getAllPackages: async (
    getAllParams: packageParams
  ): Promise<IResponseWithPaginate<IPackage[]>> => {
    const params = new URLSearchParams();
    params.set("page", getAllParams.page.toString());
    params.set("limit", getAllParams.limit.toString());

    if (getAllParams.search)
      params.set("search", getAllParams.search.toString());

    if (getAllParams.sort) params.set("sort", getAllParams.sort);
    if (getAllParams.order) params.set("order", getAllParams.order);

    const response = await apiGet("/v1/package", params.toString());

    return response;
  },

  getPackageById: async (id: number): Promise<IBaseResponseData<IPackage>> => {
    const response = await apiGet(`/v1/package/byId?id=${id}`);

    return response;
  },

  // API Post
  createPackage: async (data: PackageForm): Promise<IBaseResponse> => {
    const response = await apiPost("/v1/package", data);

    return response;
  },

  // API Patch
  updatePackage: async (
    id: number,
    data: PackageForm
  ): Promise<IBaseResponse> => {
    const response = await apiPatch(`/v1/package?id=${id}`, data);

    return response;
  },

  updatePackageStatus: async (
    id: number,
    status: boolean
  ): Promise<IBaseResponse> => {
    const response = await apiPatch(`/v1/package/active?id=${id}`, {
      is_active: status,
    });

    return response;
  },

  // API Delete
  deletePackage: async (id: number): Promise<IBaseResponse> => {
    const response = await apiDelete(`/v1/package?id=${id}`);

    return response;
  },
};
