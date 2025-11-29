import { create } from "zustand";

import { SystemUsersFormInputs } from "../features/admin/system-users/validate/system-users-validate";
import { systemUsersCompanyApi } from "../services/systemUserCompanyApi";
import { systemUsersApi } from "../services/systemUsersApi";
import { ESearchKey } from "../types/enum";
import {
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "../types/global";
import { ISystemUsersData, ISystemUsersId } from "../types/systemUsersType";

type SystemUsersCompanyStore = {
  systemUsersCompanyList: ISystemUsersData[] | null;
  getSystemUsersCompanyList(): ISystemUsersData[] | null;
  setSystemUsersCompanyList(data: ISystemUsersData[]): void;
  getAllSystemUsersCompanyList(
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ): Promise<IResponseWithPaginate<ISystemUsersData[]>>;
  systemUsersCompanyById: ISystemUsersData | null;
  getSystemUsersCompanyById(id: string): Promise<ISystemUsersData>;
  setSystemUsersCompanyById(data: ISystemUsersData): void;
  createSystemUserCompany(
    data: SystemUsersFormInputs
  ): Promise<IBaseResponseData<ISystemUsersId>>;
  selectedSystemUsersCompanyListId: ISystemUsersData[];
  getSelectedSystemUsersCompanyListId(): ISystemUsersData[];
  setSelectedSystemUsersCompanyListId(data: ISystemUsersData[]): void;
  deleteSystemUserCompany(ids: string[]): Promise<IBaseResponse>;
  updateSystemUserCompany(
    id: string,
    data: SystemUsersFormInputs
  ): Promise<IBaseResponseData<ISystemUsersId>>;
  systemUsercompanyParams: IMeta;
  getSystemUserCompanyParams: () => IMeta;
  setSystemUserCompanyParams: (IMeta: IMeta) => void;
  optionSearchSystemUsersCompany: ESearchKey[];
  getOptionSearchSystemUsersCompany: () => ESearchKey[];
};

export const useSystemUsersCompanyStore = create<SystemUsersCompanyStore>(
  (set, get) => ({
    systemUsercompanyParams: {
      page: 1,
      limit: 10,
      total: 0,
    },
    getSystemUserCompanyParams: () => get().systemUsercompanyParams,
    setSystemUserCompanyParams: (IMeta: IMeta) => {
      set({
        systemUsercompanyParams: { ...get().systemUsercompanyParams, ...IMeta },
      });
    },
    systemUsersCompanyList: null,
    getSystemUsersCompanyList: () => get().systemUsersCompanyList,
    setSystemUsersCompanyList: (data: ISystemUsersData[]) => {
      set({ systemUsersCompanyList: data });
    },
    getAllSystemUsersCompanyList: async (
      queryParams?: IMeta,
      search?: ISearch,
      sort?: ISort
    ): Promise<IResponseWithPaginate<ISystemUsersData[]>> => {
      const response = await systemUsersCompanyApi.getAllSystemUserCompany(
        queryParams,
        search,
        sort
      );
      set({
        systemUsersCompanyList: response.data,
        systemUsercompanyParams: response.meta,
      });
      return response;
    },
    systemUsersCompanyById: null,
    getSystemUsersCompanyById: async (
      id: string
    ): Promise<ISystemUsersData> => {
      const response = await systemUsersApi.getSystemUserById(id);
      set({ systemUsersCompanyById: response.data });
      return response.data;
    },
    setSystemUsersCompanyById(data) {
      set({ systemUsersCompanyById: data });
    },
    createSystemUserCompany: async (
      data: SystemUsersFormInputs
    ): Promise<IBaseResponseData<ISystemUsersId>> => {
      const response =
        await systemUsersCompanyApi.createSystemUserCompany(data);
      return response;
    },
    selectedSystemUsersCompanyListId: [],
    getSelectedSystemUsersCompanyListId: () =>
      get().selectedSystemUsersCompanyListId,
    setSelectedSystemUsersCompanyListId: (data: ISystemUsersData[]) => {
      set({ selectedSystemUsersCompanyListId: data });
    },
    optionSearchSystemUsersCompany: Object.values([
      ESearchKey.DISPLAYCODE,
      ESearchKey.FIRSTNAME,
      ESearchKey.LASTNAME,
    ]),
    getOptionSearchSystemUsersCompany: () =>
      get().optionSearchSystemUsersCompany,

    deleteSystemUserCompany: async (ids: string[]): Promise<IBaseResponse> => {
      const response = await systemUsersApi.deleteSystemUser(ids);
      return response;
    },
    updateSystemUserCompany: async (
      id: string,
      data: SystemUsersFormInputs
    ): Promise<IBaseResponseData<ISystemUsersId>> => {
      const response = await systemUsersApi.updateSystemUser(id, data);
      return response;
    },
  })
);
