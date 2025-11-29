import { create } from "zustand";

import { userApi } from "../services/userApi";
import { IBaseResponseData } from "../types/global";
import { ISystemUsersData } from "../types/systemUsersType";

type userStore = {
  // State
  userMe: ISystemUsersData | null;

  // API Get
  getUserMe: () => Promise<IBaseResponseData<ISystemUsersData>>;
};

export const useUserStore = create<userStore>((set) => ({
  // State
  userMe: null,

  // API Get
  getUserMe: async (): Promise<IBaseResponseData<ISystemUsersData>> => {
    try {
      const response = await userApi.getUserMe();
      set({ userMe: response.data });
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));
