import {
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "../types/global";
import {
  IUsersPositionId,
  IUsersPositionListTable,
} from "../types/usersPositionType";
import { UsersPositionFormInputs } from "../utils/validate/users-position-validate";

import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "./common";

export const usersPositionApi = {
  getAllUsersPositionList: (
    getAllParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ): Promise<IResponseWithPaginate<IUsersPositionListTable[]>> => {
    const params = new URLSearchParams();
    if (getAllParams) {
      params.set("page", getAllParams.page.toString());
      params.set("limit", getAllParams.limit.toString());
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
    const response = apiGet("/v1/user-position", params.toString());
    return response;
  },
  getAllUsersPositionMeList: (
    getAllParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ): Promise<IResponseWithPaginate<IUsersPositionListTable[]>> => {
    const params = new URLSearchParams();
    if (getAllParams && getAllParams.page && getAllParams.limit) {
      params.set("page", getAllParams.page.toString());
      params.set("limit", getAllParams.limit.toString());
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
    const response = apiGet("/v1/user-position/me", params.toString());
    return response;
  },
  getUserPositionById: (
    id: string
  ): Promise<IBaseResponseData<IUsersPositionListTable>> => {
    const response = apiGet(`/v1/user-position/${id}`);
    return response;
  },
  updateStatusUserPosition: (
    id: string,
    isActive: boolean
  ): Promise<IBaseResponse> => {
    const payload = {
      isActive: isActive,
    };
    const response = apiPatch(`/v1/user-position/${id}/status`, payload);
    return response;
  },
  createUsersPosition: (
    data: UsersPositionFormInputs
  ): Promise<IBaseResponseData<IUsersPositionId>> => {
    const response = apiPost("/v1/user-position", data);
    return response;
  },
  deleteUserPosition: (id: string[]): Promise<IBaseResponse> => {
    const queryParams = new URLSearchParams();
    id.forEach((id) => {
      queryParams.append("id", id);
    });
    const response = apiDelete(`/v1/user-position?${queryParams}`);
    return response;
  },
  updateUserPosition: (
    id: string,
    data: UsersPositionFormInputs
  ): Promise<IBaseResponse> => {
    const response = apiPut(`/v1/user-position/${id}`, data);
    return response;
  },
};
