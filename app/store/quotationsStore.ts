import { create } from "zustand";

import { ESearchKey } from "../types/enum";

import { quotationsApi } from "@/app/services/quotationsApi";
import {
  getAllParams,
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "@/app/types/global";
import {
  IQuotationById,
  IQuotationContractCompany,
} from "@/app/types/quotationsType";
type quotationsStore = {
  // Search
  quotationsParams: getAllParams;
  getQuotationSearchParams: () => getAllParams;
  setQuotationSearchParams: (getAllParams: getAllParams) => void;
  optionSearchContractCompany: ESearchKey[];
  getOptionSearchContractCompany: () => ESearchKey[];

  // State
  allQuotationList: IQuotationById[] | null;
  quotationById: IQuotationById | null;
  contractCompanyList: IQuotationContractCompany[];

  // Many Quotations
  quotationIds: string[];
  setQuotationIds: (quotationIds: string[]) => void;
  unCheckQuotationIds: (quotationId: string) => void;

  // API Get
  getAllQuotationList: (
    getAllParams: getAllParams
  ) => Promise<IResponseWithPaginate<IQuotationById[]>>;
  getQuotationById: (
    quotationId: string
  ) => Promise<IBaseResponseData<IQuotationById>>;
  getContractCompanyList: (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ) => Promise<IResponseWithPaginate<IQuotationContractCompany[]>>;

  // API Patch
  updateQuotationStatusCanceled: (
    quotationId: string
  ) => Promise<IBaseResponse>;
  updateQuotationStatusApproved: (
    quotationId: string,
    documentFile: FormData
  ) => Promise<IBaseResponse>;
  updateQuotationToggleActive: (quotationId: string) => Promise<IBaseResponse>;
  updateQuotationToggleDisabled: (
    quotationId: string
  ) => Promise<IBaseResponse>;
};

const defaultListOfRfqSearchParams: getAllParams = {
  page: 1,
  limit: 10,
  totalPages: 10,
  total: 0,
  name: [],
  value: "",
  status: "",
  isActive: "",
  bidStatus: "",
};

export const useQuotationsStore = create<quotationsStore>()((set, get) => ({
  // Search
  quotationsParams: defaultListOfRfqSearchParams,
  getQuotationSearchParams: () => get().quotationsParams,
  setQuotationSearchParams: (getAllParams: getAllParams) => {
    set((state) => ({
      quotationsParams: {
        ...state.quotationsParams,
        page: getAllParams.page ?? 1,
        limit: getAllParams.limit ?? 10,
        total: getAllParams.total ?? 0,
        totalPages: getAllParams.totalPages ?? 10,
        name: getAllParams.name ?? undefined,
        value: getAllParams.value ?? "",
        status: getAllParams.status ?? "",
        isActive: getAllParams.isActive ?? "",
        bidStatus: getAllParams.bidStatus ?? "",
      },
    }));
  },

  optionSearchContractCompany: [
    ESearchKey.CONTRACTCOMPANYDISPLAYCODE,
    ESearchKey.CONTRACTCOMPANYNAME,
  ],
  getOptionSearchContractCompany: () => get().optionSearchContractCompany,

  // State
  allQuotationList: null,
  quotationById: null,
  contractCompanyList: [],
  // Many Quotations
  quotationIds: [],
  setQuotationIds: (quotationIds: string[]) => {
    set({ quotationIds });
  },
  unCheckQuotationIds: (quotationId: string) => {
    set((state) => ({
      quotationIds: state.quotationIds.filter((id) => id !== quotationId),
    }));
  },

  // API Get
  getAllQuotationList: async (
    getAllParams: getAllParams
  ): Promise<IResponseWithPaginate<IQuotationById[]>> => {
    // const { globalParams, setGlobalParams } = useGlobalStore.getState();
    // const currentParams = globalParams;
    const currentParams = get().quotationsParams;
    const response = await quotationsApi.getAllQuotationList({
      ...currentParams,
      page: getAllParams.page ?? 1,
      limit: getAllParams.limit ?? 10,
      totalPages: getAllParams.totalPages ?? 10,
      total: getAllParams.total ?? 0,
      name: getAllParams.name ?? undefined,
      value: getAllParams.value ?? "",
      status: getAllParams.status ?? "",
      isActive: getAllParams.isActive ?? "",
      bidStatus: getAllParams.bidStatus ?? "",
    });
    // setGlobalParams({
    //   ...currentParams,
    //   page: response.meta.page ?? 1,
    //   limit: response.meta.limit ?? 10,
    //   totalPages: response.meta.totalPages,
    //   total: response.meta.total,
    //   name: getAllParams.name ?? undefined,
    //   value: getAllParams.value ?? "",
    //   status: getAllParams.status ?? "",
    // });

    set({
      allQuotationList: response.data,
      quotationsParams: {
        ...currentParams,
        page: response.meta.page ?? 1,
        limit: response.meta.limit ?? 10,
        totalPages: response.meta.totalPages,
        total: response.meta.total,
        name: getAllParams.name ?? undefined,
        value: getAllParams.value ?? "",
        status: getAllParams.status ?? "",
        isActive: getAllParams.isActive ?? "",
        bidStatus: getAllParams.bidStatus ?? "",
      },
    });

    return response;
  },

  getQuotationById: async (
    quotationId: string
  ): Promise<IBaseResponseData<IQuotationById>> => {
    const response = await quotationsApi.getQuotationById(quotationId);

    set({
      quotationById: response.data,
    });
    return response;
  },

  getContractCompanyList: async (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ): Promise<IResponseWithPaginate<IQuotationContractCompany[]>> => {
    const response = await quotationsApi.getContractCompany(
      queryParams,
      search,
      sort
    );
    set({
      contractCompanyList: response.data,
      quotationsParams: { ...get().quotationsParams, ...response.meta },
    });
    return response;
  },

  // API Patch
  updateQuotationStatusCanceled: async (
    quotationId: string
  ): Promise<IBaseResponse> => {
    const response =
      await quotationsApi.updateQuotationStatusCanceled(quotationId);
    return response;
  },

  updateQuotationStatusApproved: async (
    quotationId: string,
    documentFile: FormData
  ): Promise<IBaseResponse> => {
    const response = await quotationsApi.updateQuotationStatusApproved(
      quotationId,
      documentFile
    );
    return response;
  },

  updateQuotationToggleActive: async (
    quotationId: string
  ): Promise<IBaseResponse> => {
    const response =
      await quotationsApi.updateQuotationToggleActive(quotationId);
    return response;
  },

  updateQuotationToggleDisabled: async (
    quotationId: string
  ): Promise<IBaseResponse> => {
    const response =
      await quotationsApi.updateQuotationToggleDisabled(quotationId);
    return response;
  },
}));
