import { create } from "zustand";
import { persist } from "zustand/middleware";

import { userApi, userParams } from "@/app/services/user/userApi";
import { IResponseWithPaginate } from "@/app/types/global";
import { IUser } from "@/app/types/user/userType";

type userStore = {
  // Params
  userParams: userParams;
  getUserParams: () => userParams;
  setUserParams: (getAllParams: userParams) => void;

  // State
  allUserByTypeId: IUser[] | null;
  userMe: Partial<IUser> | null;

  // Function
  setUser: (user: Partial<IUser>) => void;

  // API Get
  getAllUserByTypeId: (
    getAllParams: userParams
  ) => Promise<IResponseWithPaginate<IUser[]>>;
};

const defaultUserParams: userParams = {
  page: 1,
  limit: 10,
  organizationTypeId: 1,
};

export const useUserStore = create<userStore>()(
  persist(
    (set, get) => ({
      // Params
      userParams: defaultUserParams,
      getUserParams: () => get().userParams,
      setUserParams: (getAllParams: userParams) => {
        set((state) => ({
          userParams: {
            ...state.userParams,
            page: getAllParams.page,
            limit: getAllParams.limit,
            total: getAllParams.total,
            totalPages: getAllParams.totalPages,
            organizationTypeId: getAllParams.organizationTypeId,
          },
        }));
      },

      // State
      allUserByTypeId: null,
      userMe: null,

      // Function
      setUser: (user) => set({ userMe: user }),

      // API Get
      getAllUserByTypeId: async (
        getAllParams: userParams
      ): Promise<IResponseWithPaginate<IUser[]>> => {
        try {
          const currentParams = get().userParams;
          const response = await userApi.getAllUserByTypeId({
            ...currentParams,
            search: getAllParams.search ?? "",
            organizationTypeId: getAllParams.organizationTypeId,
            sort: getAllParams.sort,
            order: getAllParams.order,
          });

          set({
            allUserByTypeId: response.data,
            userParams: {
              ...currentParams,
              page: response.meta.page,
              limit: response.meta.limit,
              totalPages: response.meta.totalPages,
              total: response.meta.total,
            },
          });
          return response;
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    }),
    {
      name: "user",
      partialize: (state) => ({
        userMe: state.userMe,
      }),
    }
  )
);
