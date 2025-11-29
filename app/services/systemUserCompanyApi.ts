import { SystemUsersFormInputs } from "../features/admin/system-users/validate/system-users-validate";
import {
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "../types/global";
import { ISystemUsersData, ISystemUsersId } from "../types/systemUsersType";
import ConvertToformData from "../utils/formData";

import { apiGet, apiPost } from "./common";

export const systemUsersCompanyApi = {
  getAllSystemUserCompany: async (
    getAllParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ): Promise<IResponseWithPaginate<ISystemUsersData[]>> => {
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
    if (getAllParams) {
      params.set("page", getAllParams.page.toString());
      params.set("limit", getAllParams.limit.toString());
    }
    const response = await apiGet("/v1/admin/user-company", params.toString());
    return response;
  },
  createSystemUserCompany: async (
    data: SystemUsersFormInputs
  ): Promise<IBaseResponseData<ISystemUsersId>> => {
    const response = await apiPost(
      "/v1/admin/user-company",
      ConvertToformData(data)
    );
    return response;
  },
};
