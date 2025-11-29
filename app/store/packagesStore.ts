import { create } from "zustand";

import { packesApi } from "../services/packagesApi";
import { ESearchKey } from "../types/enum";
import {
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "../types/global";
import { IPackagesData, IPackagesId } from "../types/packagesType";
import { PackageFormInputs } from "../utils/validate/package-validate";

type packagesStore = {
  packagesParams: IMeta;
  getPackageParams: () => IMeta;
  setPackageParams: (IMeta: IMeta) => void;
  getAllPackageList: (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ) => Promise<IResponseWithPaginate<IPackagesData[]>>;
  getFactoryCompanyPackesList: (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ) => Promise<IResponseWithPaginate<IPackagesData[]>>;
  updateActiveFactoryCompanyPackes: (id: string) => Promise<IBaseResponse>;
  packagesListData: IPackagesData[];
  setPackagesListData: (data: IPackagesData[]) => void;
  getPackagesListData: () => IPackagesData[];
  openPackageModal: boolean;
  setOpenPackageModal: (data: boolean) => void;
  getOpenPackageModal: () => boolean;
  createPackage: (
    data: PackageFormInputs
  ) => Promise<IBaseResponseData<IPackagesId>>;
  updatePackageStatus: (
    id: string,
    isActive: boolean
  ) => Promise<IBaseResponse>;
  deletePackage: (id: string) => Promise<IBaseResponse>;
  getPackageById: (id: string) => Promise<IBaseResponseData<IPackagesData>>;
  packageByIdData: IPackagesData | null;
  setPackageByIdData: (data: IPackagesData | null) => void;
  getPackagesByIdData: () => IPackagesData | null;
  updatePackage: (
    id: string,
    data: PackageFormInputs
  ) => Promise<IBaseResponseData<IPackagesId>>;
  disabled: boolean;
  setDisabled: (data: boolean) => void;
  getDisabled: () => boolean;
  optionSearchPackage: ESearchKey[];
  getOptionSearchPackage: () => ESearchKey[];
};

export const usePackagesStore = create<packagesStore>((set, get) => ({
  packagesParams: {
    page: 1,
    limit: 10,
    total: 0,
  },
  getPackageParams: () => get().packagesParams,
  setPackageParams: (IMeta: IMeta) => {
    set({ packagesParams: { ...get().packagesParams, ...IMeta } });
  },
  getAllPackageList: async (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ) => {
    const response = await packesApi.getAllPackesList(
      queryParams,
      search,
      sort
    );
    set({ packagesListData: response.data, packagesParams: response.meta });
    return response;
  },
  getFactoryCompanyPackesList: async (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ) => {
    const response = await packesApi.getFactoryCompanyPackesList(
      queryParams,
      search,
      sort
    );
    set({ packagesListData: response.data, packagesParams: response.meta });
    return response;
  },
  updateActiveFactoryCompanyPackes: (id: string): Promise<IBaseResponse> => {
    return packesApi.updatePackageActive(id);
  },
  packagesListData: [],
  setPackagesListData: (data: IPackagesData[]) => {
    set({ packagesListData: data });
  },
  getPackagesListData: () => get().packagesListData,
  openPackageModal: false,
  setOpenPackageModal: (data: boolean) => {
    set({ openPackageModal: data });
  },
  getOpenPackageModal: () => get().openPackageModal,
  createPackage: async (data: PackageFormInputs) => {
    const response = await packesApi.createPackage(data);
    return response;
  },
  updatePackageStatus: async (id: string, isActive: boolean) => {
    const response = await packesApi.updatePackageStatus(id, isActive);
    return response;
  },
  deletePackage: async (id: string) => {
    const response = await packesApi.deletePackage(id);
    return response;
  },
  getPackageById: async (id: string) => {
    const response = await packesApi.getPackageById(id);
    set({ packageByIdData: response.data });
    return response;
  },
  packageByIdData: null,
  setPackageByIdData: (data: IPackagesData | null) => {
    set({ packageByIdData: data });
  },
  getPackagesByIdData: () => get().packageByIdData,
  updatePackage: async (id: string, data: PackageFormInputs) => {
    const response = await packesApi.updatePackageById(id, data);
    return response;
  },
  disabled: false,
  setDisabled: (data: boolean) => {
    set({ disabled: data });
  },
  getDisabled: () => get().disabled,
  optionSearchPackage: Object.values([ESearchKey.NAME]),
  getOptionSearchPackage: () => get().optionSearchPackage,
}));
