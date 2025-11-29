/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";

import { companiesApi } from "../services/companiesApi";
import { ESearchKey, ESortDirection as _ESortDirection } from "../types/enum";
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

type companiesStore = {
  selectedCompanyListId: IFactoriesAndCompaniesData[];
  getSelectedCompanyListId: () => IFactoriesAndCompaniesData[];
  setSelectedCompanyListId: (id: IFactoriesAndCompaniesData[]) => void;
  companiesList: IFactoriesAndCompaniesData[] | null;
  companiesParams: IMeta;
  getCompaniesParams: () => IMeta;
  setCompaniesParams: (IMeta: IMeta) => void;
  getAllCompanysList: (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ) => Promise<IResponseWithPaginate<IFactoriesAndCompaniesData[]>>;
  getCompaniesData: IFactoriesAndCompaniesData | null;
  setCompaniesData: (data: IFactoriesAndCompaniesData) => void;
  getCompaniesById: (
    id: string
  ) => Promise<IBaseResponseData<IFactoriesAndCompaniesData>>;
  deleteCompany: (id: string[]) => Promise<IBaseResponse>;
  createCompany: (
    data: FactoriesAndCompaniesFormInputs
  ) => Promise<IBaseResponseData<IFactoriesAndCompaniesId>>;

  updateCompany: (
    data: FactoriesAndCompaniesFormInputs,
    id: string
  ) => Promise<IBaseResponse>;
  optionSearchCompany: ESearchKey[];
  getOptionSearchCompany: () => ESearchKey[];
  getUserCompanyById: (
    id: string
  ) => Promise<IBaseResponseData<IUserFactoriesAndCompanies[]>>;
};

export const useCompaniesStore = create<companiesStore>((set, get) => ({
  companiesParams: {
    page: 1,
    limit: 10,
    total: 0,
  },
  getCompaniesParams: () => get().companiesParams,
  setCompaniesParams: (IMeta: IMeta) => {
    set({ companiesParams: { ...get().companiesParams, ...IMeta } });
  },
  getAllCompanysList: async (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ): Promise<IResponseWithPaginate<IFactoriesAndCompaniesData[]>> => {
    const response = await companiesApi.getAllCompanysList(
      queryParams,
      search,
      sort
    );
    set({ companiesParams: response.meta, companiesList: response.data });
    return response;
  },
  companiesList: null,
  getCompaniesData: null,
  optionSearchCompany: Object.values([ESearchKey.DISPLAYCODE, ESearchKey.NAME]),
  getOptionSearchCompany: () => get().optionSearchCompany,
  setCompaniesData: (data: IFactoriesAndCompaniesData) => {
    set({ getCompaniesData: data });
  },
  getCompaniesById: async (id: string) => {
    const response = await companiesApi.getCompanyById(id);
    set({ getCompaniesData: response.data });
    return response;
  },
  deleteCompany: async (id: string[]) => {
    const response = await companiesApi.deleteCompany(id);
    return response;
  },
  selectedCompanyListId: [],
  getSelectedCompanyListId: () => get().selectedCompanyListId,

  setSelectedCompanyListId: (data: IFactoriesAndCompaniesData[]) => {
    set({ selectedCompanyListId: data });
  },
  createCompany: async (
    data: FactoriesAndCompaniesFormInputs
  ): Promise<IBaseResponseData<IFactoriesAndCompaniesId>> => {
    const response = await companiesApi.createCompany(data);
    return response;
  },
  updateCompany: async (
    data: FactoriesAndCompaniesFormInputs,
    id: string
  ): Promise<IBaseResponse> => {
    const response = await companiesApi.updateCompany(data, id);
    return response;
  },
  getUserCompanyById: async (id: string) => {
    const response = await companiesApi.userCompanyById(id);

    return response;
  },
}));
