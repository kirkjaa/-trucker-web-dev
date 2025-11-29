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

export const companiesApi = {
  getAllCompanysList: async (
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
        "/v1/admin/company",
        params.toString()
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getCompanyById: async (
    id: string
  ): Promise<IBaseResponseData<IFactoriesAndCompaniesData>> => {
    try {
      const response = await apiGet(`/v1/admin/company/${id}`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  deleteCompany: async (ids: string[]): Promise<IBaseResponse> => {
    try {
      const queryParams = new URLSearchParams();
      ids.forEach((id) => {
        queryParams.append("id", id);
      });
      const response = await apiDelete(`/v1/admin/company?${queryParams}`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  createCompany: async (
    data: FactoriesAndCompaniesFormInputs
  ): Promise<IBaseResponseData<IFactoriesAndCompaniesId>> => {
    const response = await apiPost(
      "/v1/admin/company",
      ConvertToformData(data)
    );
    return response;
  },
  updateCompany: async (
    data: FactoriesAndCompaniesFormInputs,
    id: string
  ): Promise<IBaseResponse> => {
    const response = await apiPut(
      `/v1/admin/company/${id}`,
      ConvertToformData(data)
    );
    return response;
  },
  userCompanyById: async (
    id: string
  ): Promise<IBaseResponseData<IUserFactoriesAndCompanies[]>> => {
    try {
      const response = await apiGet(`/v1/admin/user-company/${id}`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
