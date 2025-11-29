import { create } from "zustand";

import { usersApi } from "../services/usersApi";
import { ERoles, ESearchKey } from "../types/enum";
import {
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "../types/global";
import { IUsersDetail, IUsersListTable } from "../types/usersType";
import { UsersFormInputs } from "../utils/validate/users-validate";

type usersStore = {
  usersDataList: IUsersListTable[];
  getUsersDataList: () => IUsersListTable[];
  setUsersDataList: (data: IUsersListTable[]) => void;
  selectedUsers: IUsersListTable[];
  getSelectedUsers: () => IUsersListTable[];
  setSelectedUsers: (data: IUsersListTable[]) => void;
  usersParams: IMeta;
  setUsersParams: (data: IMeta) => void;
  getUsersParams: () => IMeta;
  getAllUsersList: (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ) => Promise<IResponseWithPaginate<IUsersListTable[]>>;
  getAllUsersFactoryList: (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort,
    byRole?: ERoles
  ) => Promise<IResponseWithPaginate<IUsersListTable[]>>;
  getAllUsersCompanyList: (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort,
    byRole?: ERoles
  ) => Promise<IResponseWithPaginate<IUsersListTable[]>>;
  createUsersFactory: (
    data: UsersFormInputs
  ) => Promise<IBaseResponseData<IUsersListTable>>;
  createUsersCompany: (
    data: UsersFormInputs
  ) => Promise<IBaseResponseData<IUsersListTable>>;
  updateUsers: (data: UsersFormInputs, id: string) => Promise<IBaseResponse>;
  getUsersById: (id: string) => Promise<IBaseResponseData<IUsersDetail>>;
  deleteUsers: (id: string[]) => Promise<IBaseResponse>;
  optionSearchUsers: ESearchKey[];
  getOptionSearchUsers: () => ESearchKey[];
};

export const useUsersStore = create<usersStore>((set, get) => ({
  usersDataList: [],
  getUsersDataList: () => get().usersDataList,
  setUsersDataList: (data: IUsersListTable[]) => set({ usersDataList: data }),
  selectedUsers: [],
  getSelectedUsers: () => get().selectedUsers,
  setSelectedUsers: (data: IUsersListTable[]) => set({ selectedUsers: data }),
  optionSearchUsers: [
    ESearchKey.FIRSTNAME,
    ESearchKey.LASTNAME,
    ESearchKey.DISPLAYCODE,
  ],
  getOptionSearchUsers: () => get().optionSearchUsers,
  usersParams: {
    page: 1,
    limit: 10,
    total: 0,
  },
  setUsersParams: (data: IMeta) => set({ usersParams: data }),
  getUsersParams: () => get().usersParams,
  getAllUsersList: async (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ): Promise<IResponseWithPaginate<IUsersListTable[]>> => {
    const data = await usersApi.getUsersList(queryParams, search, sort);
    set({ usersDataList: data.data, usersParams: data.meta });
    return data;
  },
  getAllUsersFactoryList: async (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort,
    byRole?: ERoles
  ): Promise<IResponseWithPaginate<IUsersListTable[]>> => {
    const data = await usersApi.getUsersFactoryList(
      queryParams,
      search,
      sort,
      byRole
    );
    set({ usersDataList: data.data, usersParams: data.meta });
    return data;
  },
  getAllUsersCompanyList: async (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort,
    byRole?: ERoles
  ): Promise<IResponseWithPaginate<IUsersListTable[]>> => {
    const data = await usersApi.getUsersCompanyList(
      queryParams,
      search,
      sort,
      byRole
    );
    set({ usersDataList: data.data, usersParams: data.meta });
    return data;
  },
  createUsersFactory: async (
    data: UsersFormInputs
  ): Promise<IBaseResponseData<IUsersListTable>> => {
    const response = await usersApi.createUsersFactory(data);
    return response;
  },
  createUsersCompany: async (
    data: UsersFormInputs
  ): Promise<IBaseResponseData<IUsersListTable>> => {
    const response = await usersApi.createUsersCompany(data);
    return response;
  },
  updateUsers: async (
    data: UsersFormInputs,
    id: string
  ): Promise<IBaseResponse> => {
    const response = await usersApi.updateUsers(data, id);
    return response;
  },
  getUsersById: async (
    id: string
  ): Promise<IBaseResponseData<IUsersDetail>> => {
    const response = await usersApi.getUsersById(id);
    return response;
  },
  deleteUsers: async (id: string[]): Promise<IBaseResponse> => {
    const response = await usersApi.deleteUsersByListId(id);
    return response;
  },
}));
