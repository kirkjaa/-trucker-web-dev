import { create } from "zustand";

import { userAdminApi } from "../services/userAdminApi";
import { IBaseResponseData } from "../types/global";
import { IUserAdmin } from "../types/userAdminType";

type userAdminStore = {
  allUserAdminList: IUserAdmin[] | null;
  getAllUserAdminList: (paramsObj?: {
    [key: string]: string | number;
  }) => Promise<IBaseResponseData<IUserAdmin[]>>;
};

export const useUserAdminStore = create<userAdminStore>((set) => ({
  allUserAdminList: null,
  getAllUserAdminList: async (paramsObj?: {
    [key: string]: string | number;
  }): Promise<IBaseResponseData<IUserAdmin[]>> => {
    try {
      const response = await userAdminApi.getAllUserAdminList(paramsObj);
      set({ allUserAdminList: response.data });
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));
