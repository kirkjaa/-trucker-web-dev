import { create } from "zustand";

import {
  organizationApi,
  organizationParams,
} from "../../services/organization/organizationApi";
import { IOrganization } from "../../types/organization/organizationType";

import { IResponseWithPaginate } from "@/app/types/global";

type organizationStore = {
  // Params
  organizationParams: organizationParams;
  getOrganizationParams: () => organizationParams;
  setOrganizationParams: (getAllParams: organizationParams) => void;

  // State
  organizations: IOrganization[] | null;

  // API Get
  getOrganizationsByTypeId: (
    getAllParams: organizationParams
  ) => Promise<IResponseWithPaginate<IOrganization[]>>;
};

const defaultOrganizationParams: organizationParams = {
  page: 1,
  limit: 10,
  typeId: 1,
};

export const useOrganizationStore = create<organizationStore>((set, get) => ({
  // Params
  organizationParams: defaultOrganizationParams,
  getOrganizationParams: () => get().organizationParams,
  setOrganizationParams: (getAllParams: organizationParams) => {
    set((state) => ({
      organizationParams: {
        ...state.organizationParams,
        page: getAllParams.page ?? 1,
        limit: getAllParams.limit ?? 10,
        total: getAllParams.total ?? 0,
        totalPages: getAllParams.totalPages ?? 10,
        typeId: getAllParams.typeId ?? 1,
      },
    }));
  },

  // State
  organizations: null,

  // API Get
  getOrganizationsByTypeId: async (
    getAllParams: organizationParams
  ): Promise<IResponseWithPaginate<IOrganization[]>> => {
    try {
      const currentParams = get().organizationParams;
      const response = await organizationApi.getOrganizationsByTypeId({
        ...currentParams,
        search: getAllParams.search ?? "",
        typeId: getAllParams.typeId,
        sort: getAllParams.sort,
        order: getAllParams.order,
      });

      set({
        organizations: response.data,
        organizationParams: {
          ...currentParams,
          page: response.meta.page ?? 1,
          limit: response.meta.limit ?? 10,
          totalPages: response.meta.totalPages,
          total: response.meta.total ?? 0,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));
