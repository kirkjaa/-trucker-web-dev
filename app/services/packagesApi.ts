import {
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "../types/global";
import { IPackagesData, IPackagesId } from "../types/packagesType";
import { PackageFormInputs } from "../utils/validate/package-validate";

import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "./common";

export const packesApi = {
  //#region Admin
  getAllPackesList: async (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ): Promise<IResponseWithPaginate<IPackagesData[]>> => {
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
    const response = await apiGet("/v1/admin/package", params.toString());
    return response;
  },
  getPackageById: async (
    id: string
  ): Promise<IBaseResponseData<IPackagesData>> => {
    const response = await apiGet(`/v1/admin/package/${id}`);
    return response;
  },
  createPackage: async (
    data: PackageFormInputs
  ): Promise<IBaseResponseData<IPackagesId>> => {
    const response = await apiPost("/v1/admin/package", data);
    return response;
  },
  deletePackage: async (id: string): Promise<IBaseResponse> => {
    const response = await apiDelete(`/v1/admin/package/${id}`);
    return response;
  },
  updatePackageStatus: async (
    id: string,
    isActive: boolean
  ): Promise<IBaseResponse> => {
    const response = await apiPatch(`/v1/admin/package/${id}/status`, {
      isActive,
    });
    return response;
  },
  updatePackageById: async (
    id: string,
    data: PackageFormInputs
  ): Promise<IBaseResponseData<IPackagesId>> => {
    const response = await apiPut(`/v1/admin/package/${id}`, data);
    return response;
  },

  //#endregion Admin

  //#region Factory Company
  getFactoryCompanyPackesList: async (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ): Promise<IResponseWithPaginate<IPackagesData[]>> => {
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
    const response = await apiGet("/v1/package", params.toString());
    return response;
  },
  updatePackageActive: async (id: string): Promise<IBaseResponse> => {
    const payload = {
      packageId: id,
    };
    const response = await apiPost("/v1/package/active", payload);
    return response;
  },
  //#endregion Factory Company
};
