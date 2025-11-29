import { create } from "zustand";

import { SystemUsersFormInputs } from "../features/admin/system-users/validate/system-users-validate";
import { systemUsersApi } from "../services/systemUsersApi";
import { systemUsersFactoryApi } from "../services/systemUsersFactoryApi";
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

type SystemUsersFactoryStore = {
  systemUsersFactoryList: ISystemUsersData[] | null;
  getSystemUsersFactoryList: () => ISystemUsersData[] | null;
  setSystemUsersFactoryList: (data: ISystemUsersData[]) => void;
  getAllSystemUsersFactoryList(
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ): Promise<IResponseWithPaginate<ISystemUsersData[]>>;
  systemUsersFactoryById: ISystemUsersData | null;
  getSystemUsersFactoryById(id: string): Promise<ISystemUsersData>;
  setSystemUsersFactoryById(data: ISystemUsersData): void;
  createSystemUserFactory(
    data: SystemUsersFormInputs
  ): Promise<IBaseResponseData<ISystemUsersId>>;
  selectedSystemUsersFactoryListId: ISystemUsersData[];
  getSelectedSystemUsersFactoryListId: () => ISystemUsersData[];
  setSelectedSystemUsersFactoryListId(data: ISystemUsersData[]): void;
  deleteSystemUserFactory(ids: string[]): Promise<IBaseResponse>;
  updateSystemUserFactory(
    id: string,
    data: SystemUsersFormInputs
  ): Promise<IBaseResponseData<ISystemUsersId>>;
  systemUserfactoryParams: IMeta;
  getSystemUserFactoryParams: () => IMeta;
  setSystemUserFactoryParams: (IMeta: IMeta) => void;
  optionSearchSystemUsersFactory: ESearchKey[];
  getOptionSearchSystemUsersFactory: () => ESearchKey[];
};

export const useSystemUsersFactoryStore = create<SystemUsersFactoryStore>(
  (set, get) => ({
    systemUserfactoryParams: {
      page: 1,
      limit: 10,
      total: 0,
    },
    getSystemUserFactoryParams: () => get().systemUserfactoryParams,
    setSystemUserFactoryParams: (IMeta: IMeta) => {
      set({
        systemUserfactoryParams: { ...get().systemUserfactoryParams, ...IMeta },
      });
    },
    systemUsersFactoryList: null,
    getSystemUsersFactoryList: () => get().systemUsersFactoryList,
    setSystemUsersFactoryList: (data: ISystemUsersData[]) => {
      set({ systemUsersFactoryList: data });
    },
    getAllSystemUsersFactoryList: async (
      queryParams?: IMeta,
      search?: ISearch,
      sort?: ISort
    ): Promise<IResponseWithPaginate<ISystemUsersData[]>> => {
      const response = await systemUsersFactoryApi.getAllSystemUserFactory(
        queryParams,
        search,
        sort
      );
      set({
        systemUsersFactoryList: response.data,
        systemUserfactoryParams: response.meta,
      });
      return response;
    },
    systemUsersFactoryById: null,
    getSystemUsersFactoryById: async (
      id: string
    ): Promise<ISystemUsersData> => {
      const response = await systemUsersApi.getSystemUserById(id);
      set({ systemUsersFactoryById: response.data });
      return response.data;
    },
    setSystemUsersFactoryById(data) {
      set({ systemUsersFactoryById: data });
    },
    optionSearchSystemUsersFactory: Object.values([
      ESearchKey.DISPLAYCODE,
      ESearchKey.FIRSTNAME,
      ESearchKey.LASTNAME,
    ]),
    getOptionSearchSystemUsersFactory: () =>
      get().optionSearchSystemUsersFactory,
    createSystemUserFactory: async (
      data: SystemUsersFormInputs
    ): Promise<IBaseResponseData<ISystemUsersId>> => {
      const response =
        await systemUsersFactoryApi.createSystemUserFactory(data);
      return response;
    },
    selectedSystemUsersFactoryListId: [],
    getSelectedSystemUsersFactoryListId: () =>
      get().selectedSystemUsersFactoryListId,
    setSelectedSystemUsersFactoryListId: (data: ISystemUsersData[]) => {
      set({ selectedSystemUsersFactoryListId: data });
    },
    deleteSystemUserFactory: async (ids: string[]): Promise<IBaseResponse> => {
      const response = await systemUsersApi.deleteSystemUser(ids);
      return response;
    },
    updateSystemUserFactory: async (
      id: string,
      data: SystemUsersFormInputs
    ): Promise<IBaseResponseData<ISystemUsersId>> => {
      const response = await systemUsersApi.updateSystemUser(id, data);
      return response;
    },
  })
);
