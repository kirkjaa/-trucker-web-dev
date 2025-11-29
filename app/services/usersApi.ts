import { ERoles } from "../types/enum";
import {
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "../types/global";
import { IUsersDetail, IUsersListTable } from "../types/usersType";
import ConvertToformData from "../utils/formData";
import { UsersFormInputs } from "../utils/validate/users-validate";

import { apiDelete, apiGet, apiPost, apiPut } from "./common";

export const usersApi = {
  getUsersList: async (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ): Promise<IResponseWithPaginate<IUsersListTable[]>> => {
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

      const response = await apiGet("/v1/users/list", params.toString());
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getUsersFactoryList: async (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort,
    byRole?: ERoles
  ): Promise<IResponseWithPaginate<IUsersListTable[]>> => {
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
      if (byRole) {
        params.set("byRole", byRole);
      }

      const response = await apiGet("/v1/users/factory/me", params.toString());
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getUsersCompanyList: async (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort,
    byRole?: ERoles
  ): Promise<IResponseWithPaginate<IUsersListTable[]>> => {
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
      if (byRole) {
        params.set("byRole", byRole);
      }

      const response = await apiGet("/v1/users/company/me", params.toString());
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  createUsersFactory: async (
    data: UsersFormInputs
  ): Promise<IBaseResponseData<IUsersListTable>> => {
    try {
      const response = await apiPost(
        "/v1/users/factory",
        ConvertToformData(data)
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  createUsersCompany: async (
    data: UsersFormInputs
  ): Promise<IBaseResponseData<IUsersListTable>> => {
    try {
      const response = await apiPost(
        "/v1/users/company",
        ConvertToformData(data)
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  updateUsers: async (data: UsersFormInputs, id: string) => {
    try {
      const response = await apiPut(`/v1/users/${id}`, ConvertToformData(data));
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getUsersById: async (
    id: string
  ): Promise<IBaseResponseData<IUsersDetail>> => {
    try {
      const response = await apiGet(`/v1/users/${id}`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  deleteUsersByListId: async (ids: string[]): Promise<IBaseResponse> => {
    try {
      const queryParams = new URLSearchParams();
      ids.forEach((id) => {
        queryParams.append("id", id);
      });
      const response = await apiDelete(`/v1/users?${queryParams}`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
