import { create } from "zustand";

import { driverApi, driverParams } from "@/app/services/driver/driverApi";
import { IDriver } from "@/app/types/driver/driverType";
import { IResponseWithPaginate } from "@/app/types/global";

type driverStore = {
  // Params
  driverParams: driverParams;
  getDriverParams: () => driverParams;
  setDriverParams: (getAllParams: driverParams) => void;

  // State
  drivers: IDriver[] | null;

  // API Get
  getDriversInternal: (
    getAllParams: driverParams
  ) => Promise<IResponseWithPaginate<IDriver[]>>;

  getDriversFreelance: (
    getAllParams: driverParams
  ) => Promise<IResponseWithPaginate<IDriver[]>>;
};

const defaultDriverParams: driverParams = {
  page: 1,
  limit: 10,
  organizationId: 1,
  status: "",
};

export const useDriverStore = create<driverStore>((set, get) => ({
  // Params
  driverParams: defaultDriverParams,
  getDriverParams: () => get().driverParams,
  setDriverParams: (getAllParams: driverParams) => {
    set((state) => ({
      driverParams: {
        ...state.driverParams,
        page: getAllParams.page,
        limit: getAllParams.limit,
        total: getAllParams.total,
        totalPages: getAllParams.totalPages,
        organizationId: getAllParams.organizationId,
        status: getAllParams.status,
      },
    }));
  },

  // State
  drivers: null,

  // API Get
  getDriversInternal: async (
    getAllParams: driverParams
  ): Promise<IResponseWithPaginate<IDriver[]>> => {
    try {
      const currentParams = get().driverParams;
      const response = await driverApi.getDriversInternal({
        ...currentParams,
        search: getAllParams.search ?? "",
        organizationId: getAllParams.organizationId,
        sort: getAllParams.sort,
        order: getAllParams.order,
      });

      set({
        drivers: response.data,
        driverParams: {
          ...currentParams,
          page: response.meta.page ?? 1,
          limit: response.meta.limit ?? 10,
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

  getDriversFreelance: async (
    getAllParams: driverParams
  ): Promise<IResponseWithPaginate<IDriver[]>> => {
    try {
      const currentParams = get().driverParams;
      const response = await driverApi.getDriversFreelance({
        ...currentParams,
        search: getAllParams.search ?? "",
        sort: getAllParams.sort,
        order: getAllParams.order,
        status: getAllParams.status,
      });

      set({
        drivers: response.data,
        driverParams: {
          ...currentParams,
          page: response.meta.page ?? 1,
          limit: response.meta.limit ?? 10,
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
}));
