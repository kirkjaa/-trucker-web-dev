import { create } from "zustand";

import { companyApi } from "../services/companyApi";
import { ICompanyById, ICompanyMe } from "../types/companyType";
import {
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
} from "../types/global";
import { CompanyMeFormInputs } from "../utils/validate/company-validate";

type companyStore = {
  // Search
  companyParams: IMeta;
  getCompanySearchParams: () => IMeta;
  setCompanySearchParams: (getAllParams: IMeta) => void;

  // State
  allCompanyList: ICompanyById[] | null;
  myCompany: ICompanyMe | null;
  getMyCompany: () => ICompanyMe | null;
  setMyCompany: (company: ICompanyMe | null) => void;

  // APi Get
  getAllCompanyList: (
    getAllParams: IMeta
  ) => Promise<IResponseWithPaginate<ICompanyById[]>>;
  getCompanyMe: () => Promise<IBaseResponseData<ICompanyMe>>;

  //ApiPatch
  updateCompanyMe: (data: CompanyMeFormInputs) => Promise<IBaseResponse>;
};

const defaultCompanyParams: IMeta = {
  page: 1,
  limit: 100,
};

export const useCompanyStore = create<companyStore>((set, get) => ({
  // Search
  companyParams: defaultCompanyParams,
  getCompanySearchParams: () => get().companyParams,
  setCompanySearchParams: (getAllParams: IMeta) => {
    set((state) => ({
      companyParams: {
        ...state.companyParams,
        page: getAllParams.page ?? 1,
        limit: getAllParams.limit ?? 100,
      },
    }));
  },

  // State
  allCompanyList: null,
  myCompany: null,

  getMyCompany: () => get().myCompany,
  setMyCompany: (company: ICompanyMe | null) => {
    set({ myCompany: company });
  },

  // APi Get
  getAllCompanyList: async (
    getAllParams: IMeta
  ): Promise<IResponseWithPaginate<ICompanyById[]>> => {
    const currentParams = get().companyParams;
    const response = await companyApi.getAllCompanyList({
      ...currentParams,
      page: getAllParams.page,
      limit: getAllParams.limit,
    });

    set({
      allCompanyList: response.data,
      companyParams: {
        ...currentParams,
        page: response.meta.page ?? 1,
        limit: response.meta.limit ?? 100,
        totalPages: response.meta.totalPages,
        total: response.meta.total,
      },
    });

    return response;
  },
  getCompanyMe: async (): Promise<IBaseResponseData<ICompanyMe>> => {
    const response = await companyApi.getCompanyMe();
    set({ myCompany: response.data });
    return response;
  },

  //ApiPatch
  updateCompanyMe: async (
    data: CompanyMeFormInputs
  ): Promise<IBaseResponse> => {
    const response = await companyApi.updateCompanyMe(data);
    return response;
  },
}));
