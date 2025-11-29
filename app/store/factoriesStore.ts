/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";

import { factoriesApi } from "../services/factoriesApi";
// @ts-expect-error: _ESortDirection will be used later
import { _ESortDirection } from "../types/enum";
import { ESearchKey } from "../types/enum";
import {
  IFactoriesAndCompaniesData,
  IFactoriesAndCompaniesId,
  IUserFactoriesAndCompanies,
} from "../types/factoriesAndCompaniesType";
import {
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "../types/global";
import { FactoriesAndCompaniesFormInputs } from "../utils/validate/factoriesandcompanies-validate";

type factoriesStore = {
  selectedFactoryListId: IFactoriesAndCompaniesData[];
  getSelectedFactoryListId: () => IFactoriesAndCompaniesData[];
  setSelectedFactoryListId: (id: IFactoriesAndCompaniesData[]) => void;
  factoriesParams: IMeta;
  getFactoriesParams: () => IMeta;
  setFactoriesParams: (IMeta: IMeta) => void;
  getAllFactorysList: (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ) => Promise<IResponseWithPaginate<IFactoriesAndCompaniesData[]>>;
  getFactoriesById: (
    id: string
  ) => Promise<IBaseResponseData<IFactoriesAndCompaniesData>>;
  createFactory: (
    data: FactoriesAndCompaniesFormInputs
  ) => Promise<IBaseResponseData<IFactoriesAndCompaniesId>>;
  updateFactory: (
    data: FactoriesAndCompaniesFormInputs,
    id: string
  ) => Promise<IBaseResponse>;
  deleteFactory: (ids: string[]) => Promise<IBaseResponse>;
  factorysList: IFactoriesAndCompaniesData[] | null;
  setFactorysList: (data: IFactoriesAndCompaniesData[]) => void;
  getFactoriesData: IFactoriesAndCompaniesData | null;
  setFactoriesData: (data: IFactoriesAndCompaniesData) => void;
  optionSearchFactory: ESearchKey[];
  getOptionSearchFactory: () => ESearchKey[];
  getUserFactoryById: (
    id: string
  ) => Promise<IBaseResponseData<IUserFactoriesAndCompanies[]>>;
};

export const useFactoriesStore = create<factoriesStore>((set, get) => ({
  //#region State
  getFactoriesData: null,
  setFactoriesData: (data: IFactoriesAndCompaniesData) => {
    set({ getFactoriesData: data });
  },
  selectedFactoryListId: [],
  getSelectedFactoryListId: () => get().selectedFactoryListId,
  setSelectedFactoryListId: (data: IFactoriesAndCompaniesData[]) => {
    set({ selectedFactoryListId: data });
  },
  factorysList: null,
  setFactorysList: (data: IFactoriesAndCompaniesData[]) => {
    set({ factorysList: data });
  },
  factoriesParams: {
    page: 1,
    limit: 10,
    total: 0,
  },
  getFactoriesParams: () => get().factoriesParams,
  setFactoriesParams: (IMeta: IMeta) => {
    set((state) => ({
      factoriesParams: { ...state.factoriesParams, ...IMeta },
    }));
  },
  optionSearchFactory: Object.values([ESearchKey.DISPLAYCODE, ESearchKey.NAME]),
  getOptionSearchFactory: () => get().optionSearchFactory,

  //#endregion State

  //#region API
  getAllFactorysList: async (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ): Promise<IResponseWithPaginate<IFactoriesAndCompaniesData[]>> => {
    const response = await factoriesApi.getAllFactorysList(
      queryParams,
      search,
      sort
    );
    set({ factorysList: response.data, factoriesParams: response.meta });
    return response;
  },
  getFactoriesById: async (
    id: string
  ): Promise<IBaseResponseData<IFactoriesAndCompaniesData>> => {
    const response = await factoriesApi.getFactoryById(id);
    return response;
  },
  updateFactory: async (
    data: FactoriesAndCompaniesFormInputs,
    id: string
  ): Promise<IBaseResponse> => {
    const response = await factoriesApi.updateFactory(data, id);
    return response;
  },
  createFactory: async (
    data: FactoriesAndCompaniesFormInputs
  ): Promise<IBaseResponseData<IFactoriesAndCompaniesId>> => {
    const response = await factoriesApi.createFactory(data);
    return response;
  },

  deleteFactory: async (ids: string[]): Promise<IBaseResponse> => {
    const response = await factoriesApi.deleteFactory(ids);
    return response;
  },
  getUserFactoryById: async (
    id: string
  ): Promise<IBaseResponseData<IUserFactoriesAndCompanies[]>> => {
    const response = await factoriesApi.userFactoryById(id);

    return response;
  },

  //#endregion API
}));
