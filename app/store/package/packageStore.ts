import { create } from "zustand";

import { packageApi, packageParams } from "@/app/services/package/packageApi";
import { IBaseResponseData, IResponseWithPaginate } from "@/app/types/global";
import { IPackage } from "@/app/types/package/packageType";

type packageStore = {
  // Params
  packageParams: packageParams;
  getPackageParams: () => packageParams;
  setPackageParams: (getAllParams: packageParams) => void;

  // State
  packages: IPackage[] | null;
  packageById: IPackage | null;
  openPackageModal: boolean;
  disabled: boolean;

  // Function
  getOpenPackageModal: () => boolean;
  setOpenPackageModal: (data: boolean) => void;
  getDisabled: () => boolean;
  setDisabled: (data: boolean) => void;

  // API Get
  getAllPackages: (
    getAllParams: packageParams
  ) => Promise<IResponseWithPaginate<IPackage[]>>;

  getPackageById: (id: number) => Promise<IBaseResponseData<IPackage>>;
};

const defaultPackageParams: packageParams = {
  page: 1,
  limit: 10,
};

export const usePackageStore = create<packageStore>((set, get) => ({
  // Params
  packageParams: defaultPackageParams,
  getPackageParams: () => get().packageParams,
  setPackageParams: (getAllParams: packageParams) => {
    set((state) => ({
      packageParams: {
        ...state.packageParams,
        page: getAllParams.page,
        limit: getAllParams.limit,
        total: getAllParams.total,
        totalPages: getAllParams.totalPages,
      },
    }));
  },

  // State
  packages: null,
  packageById: null,
  openPackageModal: false,
  disabled: false,

  // Function
  getOpenPackageModal: () => get().openPackageModal,
  setOpenPackageModal: (data: boolean) => {
    set({ openPackageModal: data });
  },
  getDisabled: () => get().disabled,
  setDisabled: (data: boolean) => {
    set({ disabled: data });
  },

  // API Get
  getAllPackages: async (
    getAllParams: packageParams
  ): Promise<IResponseWithPaginate<IPackage[]>> => {
    try {
      const currentParams = get().packageParams;
      const response = await packageApi.getAllPackages({
        ...currentParams,
        search: getAllParams.search,
        sort: getAllParams.sort,
        order: getAllParams.order,
      });

      set({
        packages: response.data,
        packageParams: {
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

  getPackageById: async (id: number): Promise<IBaseResponseData<IPackage>> => {
    try {
      const response = await packageApi.getPackageById(id);

      set({ packageById: response.data });

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
}));
