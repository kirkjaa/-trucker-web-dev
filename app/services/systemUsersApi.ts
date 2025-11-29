import { SystemUsersFormInputs } from "../features/admin/system-users/validate/system-users-validate";
import { IBaseResponse, IBaseResponseData } from "../types/global";
import { ISystemUsersData } from "../types/systemUsersType";
import ConvertToformData from "../utils/formData";

import { apiDelete, apiGet, apiPut } from "./common";

export const systemUsersApi = {
  getSystemUserById: async (
    id: string
  ): Promise<IBaseResponseData<ISystemUsersData>> => {
    const response = await apiGet(`/v1/admin/user/${id}`);
    return response;
  },
  deleteSystemUser: async (ids: string[]): Promise<IBaseResponse> => {
    const queryParams = new URLSearchParams();
    ids.forEach((id) => {
      queryParams.append("id", id);
    });
    const response = await apiDelete(`/v1/admin/user?${queryParams}`);
    return response;
  },
  updateSystemUser: async (
    id: string,
    data: SystemUsersFormInputs
  ): Promise<IBaseResponseData<ISystemUsersData>> => {
    console.log(data);
    const response = await apiPut(
      `/v1/admin/user/${id}`,
      ConvertToformData(data)
    );
    return response;
  },
};
