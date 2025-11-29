import { create } from "zustand";

import { usersPositionApi } from "../services/usersPositionApi";
import { ESearchKey } from "../types/enum";
import {
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "../types/global";
import {
  IUsersPositionId,
  IUsersPositionListTable,
} from "../types/usersPositionType";
import { UsersPositionFormInputs } from "../utils/validate/users-position-validate";

type usersPositionStore = {
  usersPositionList: IUsersPositionListTable[];
  getUsersPositionList: () => IUsersPositionListTable[];
  setUsersPositionList: (data: IUsersPositionListTable[]) => void;
  selectedUsersPosition: IUsersPositionListTable[];
  setSelectedUsersPosition: (data: IUsersPositionListTable[]) => void;
  getSelectedUsersPosition: () => IUsersPositionListTable[];
  usersPositionParams: IMeta;
  getUsersPositionParams: () => IMeta;
  setUsersPositionParams: (IMeta: IMeta) => void;
  getListUsersPosition: (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ) => Promise<IResponseWithPaginate<IUsersPositionListTable[]>>;
  getListUsersPositionMe: (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ) => Promise<IResponseWithPaginate<IUsersPositionListTable[]>>;
  changeStatusUsersPosition: (
    id: string,
    isActive: boolean
  ) => Promise<IBaseResponse>;
  createUsersPosition: (
    data: UsersPositionFormInputs
  ) => Promise<IBaseResponseData<IUsersPositionId>>;
  getUserPositionById: (
    id: string
  ) => Promise<IBaseResponseData<IUsersPositionListTable>>;
  deleteUserPosition: (id: string[]) => Promise<IBaseResponse>;
  optionSearchUsersPosition: ESearchKey[];
  getOptionSearchUsersPosition: () => ESearchKey[];
  updateUserPosition: (
    id: string,
    data: UsersPositionFormInputs
  ) => Promise<IBaseResponse>;
};

export const useUsersPositionStore = create<usersPositionStore>((set, get) => ({
  usersPositionList: [],
  getUsersPositionList: () => get().usersPositionList,
  setUsersPositionList: (data) => set({ usersPositionList: data }),
  usersPositionParams: {
    page: 1,
    limit: 10,
    total: 0,
  },
  selectedUsersPosition: [],
  setSelectedUsersPosition: (data) => set({ selectedUsersPosition: data }),
  getSelectedUsersPosition: () => get().selectedUsersPosition,
  getUsersPositionParams: () => get().usersPositionParams,
  setUsersPositionParams: (IMeta) => set({ usersPositionParams: IMeta }),
  getListUsersPosition: async (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ) => {
    const response = await usersPositionApi.getAllUsersPositionList(
      queryParams,
      search,
      sort
    );
    set({
      usersPositionList: response.data,
      usersPositionParams: response.meta,
    });
    return response;
  },
  getListUsersPositionMe: async (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ) => {
    const response = await usersPositionApi.getAllUsersPositionMeList(
      queryParams,
      search,
      sort
    );
    set({
      usersPositionList: response.data,
      usersPositionParams: response.meta,
    });
    return response;
  },
  changeStatusUsersPosition: async (id: string, isActive: boolean) => {
    const response = await usersPositionApi.updateStatusUserPosition(
      id,
      isActive
    );
    return response;
  },
  createUsersPosition: async (data: UsersPositionFormInputs) => {
    const response = await usersPositionApi.createUsersPosition(data);
    return response;
  },
  getUserPositionById: async (id: string) => {
    const response = await usersPositionApi.getUserPositionById(id);
    return response;
  },
  deleteUserPosition: async (id: string[]) => {
    const response = await usersPositionApi.deleteUserPosition(id);
    return response;
  },
  optionSearchUsersPosition: Object.values([ESearchKey.NAME]),
  getOptionSearchUsersPosition: () => get().optionSearchUsersPosition,
  updateUserPosition: async (id: string, data: UsersPositionFormInputs) => {
    const response = await usersPositionApi.updateUserPosition(id, data);
    return response;
  },
}));
