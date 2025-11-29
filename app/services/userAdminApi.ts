import { IBaseResponseData } from "../types/global";
import { IUserAdmin } from "../types/userAdminType";

import { apiGet } from "./common";

export const userAdminApi = {
  getAllUserAdminList: async (paramsObj?: {
    [key: string]: string | number;
  }): Promise<IBaseResponseData<IUserAdmin[]>> => {
    const params = new URLSearchParams();
    if (paramsObj) {
      Object.entries(paramsObj).forEach(([key, value]) => {
        params.set(key, value.toString());
      });
    }

    try {
      const response = await apiGet("/v1/admin/user-admin", params.toString());
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
