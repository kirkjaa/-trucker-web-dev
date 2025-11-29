import {
  IFactoriesAndCompaniesData,
  IFactoriesAndCompaniesId,
  IUserFactoriesAndCompanies,
} from "../types/factoriesAndCompaniesType";
import {
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "../types/global";
import ConvertToformData from "../utils/formData";
import { FactoriesAndCompaniesFormInputs } from "../utils/validate/factoriesandcompanies-validate";

import { apiDelete, apiGet, apiGetNoLoading, apiPost, apiPut } from "./common";

export const factoriesApi = {
  getAllFactorysList: async (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ): Promise<IResponseWithPaginate<IFactoriesAndCompaniesData[]>> => {
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

    try {
      const response = await apiGetNoLoading(
        "/v1/admin/factory",
        params.toString()
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getFactoryById: async (
    id: string
  ): Promise<IBaseResponseData<IFactoriesAndCompaniesData>> => {
    try {
      const response = await apiGet(`/v1/admin/factory/${id}`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  updateFactory: async (
    data: FactoriesAndCompaniesFormInputs,
    id: string
  ): Promise<IBaseResponse> => {
    const response = await apiPut(
      `/v1/admin/factory/${id}`,
      ConvertToformData(data)
    );
    return response;
  },
  createFactory: async (
    data: FactoriesAndCompaniesFormInputs
  ): Promise<IBaseResponseData<IFactoriesAndCompaniesId>> => {
    const response = await apiPost(
      "/v1/admin/factory",
      ConvertToformData(data)
    );
    return response;
  },
  deleteFactory: async (ids: string[]): Promise<IBaseResponse> => {
    const queryParams = new URLSearchParams();
    ids.forEach((id) => {
      queryParams.append("id", id);
    });
    const response = await apiDelete(`/v1/admin/factory?${queryParams}`);
    return response;
  },
  userFactoryById: async (
    id: string
  ): Promise<IBaseResponseData<IUserFactoriesAndCompanies[]>> => {
    try {
      const response = await apiGet(`/v1/admin/user-factory/${id}`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
