import { create } from "zustand";

import { routeApi, routeParams } from "@/app/services/route/routeApi";
import { IResponseWithPaginate } from "@/app/types/global";
import { IRoute } from "@/app/types/route/routeType";

type routeStore = {
  // Params
  routeParams: routeParams;
  getRouteParams: () => routeParams;
  setRouteParams: (getAllParams: routeParams) => void;

  // State
  routes: IRoute[] | null;
  openCreateModal: boolean;

  // Function
  getOpenCreateModal: () => boolean;
  setOpenCreateModal: (openCreateModal: boolean) => void;

  // API Get
  getAllRoutes: (
    getAllParams: routeParams
  ) => Promise<IResponseWithPaginate<IRoute[]>>;

  getAllRoutesByStatus: (
    getAllParams: routeParams
  ) => Promise<IResponseWithPaginate<IRoute[]>>;
};

const defaultRouteParams: routeParams = {
  page: 1,
  limit: 10,
};

export const useRouteStore = create<routeStore>((set, get) => ({
  // Params
  routeParams: defaultRouteParams,
  getRouteParams: () => get().routeParams,
  setRouteParams: (getAllParams: routeParams) => {
    set((state) => ({
      routeParams: {
        ...state.routeParams,
        page: getAllParams.page,
        limit: getAllParams.limit,
        total: getAllParams.total,
        totalPages: getAllParams.totalPages,
      },
    }));
  },

  // State
  routes: null,
  openCreateModal: false,

  // Function
  getOpenCreateModal: () => get().openCreateModal,
  setOpenCreateModal: (openCreateModal: boolean) => {
    set({ openCreateModal });
  },

  // API Get
  getAllRoutes: async (
    getAllParams: routeParams
  ): Promise<IResponseWithPaginate<IRoute[]>> => {
    try {
      const currentParams = get().routeParams;
      const response = await routeApi.getAllRoutes({
        ...currentParams,
        search: getAllParams.search,
        sort: getAllParams.sort,
        order: getAllParams.order,
        freight_type: getAllParams.freight_type,
      });

      set({
        routes: response.data,
        routeParams: {
          ...currentParams,
          page: response.meta.page,
          limit: response.meta.limit,
          totalPages: response.meta.totalPages,
          total: response.meta.total,
        },
      });
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getAllRoutesByStatus: async (
    getAllParams: routeParams
  ): Promise<IResponseWithPaginate<IRoute[]>> => {
    try {
      const currentParams = get().routeParams;
      const response = await routeApi.getAllRoutesByStatus({
        ...currentParams,
        search: getAllParams.search,
        sort: getAllParams.sort,
        order: getAllParams.order,
        freight_type: getAllParams.freight_type,
        status: getAllParams.status,
      });

      set({
        routes: response.data,
        routeParams: {
          ...currentParams,
          page: response.meta.page,
          limit: response.meta.limit,
          totalPages: response.meta.totalPages,
          total: response.meta.total,
        },
      });
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
}));
