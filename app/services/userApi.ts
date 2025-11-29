import { IBaseResponseData } from "../types/global";
import { ISystemUsersData } from "../types/systemUsersType";

import { apiGet } from "./common";

export const userApi = {
  // API Get
  getUserMe: async (): Promise<IBaseResponseData<ISystemUsersData>> => {
    try {
      const response = await apiGet("/v1/users/me");
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
