import { create } from "zustand";

import { uploadTemplateCsvApi } from "../services/uploadTemplateCsvApi";
import { ESearchKey } from "../types/enum";
import {
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "../types/global";
import { IUploadTemplateCsvData } from "../types/uploadTemplateCsvType";
import { IUploadTemplateCsvDetailData } from "../utils/parseCsv";
import { UploadTemplateCsvFormInputs } from "../utils/validate/upload-template-csv-validate";

type uploadTemplateCsvStore = {
  // Params
  uploadTemplateCsvParams: IMeta;
  getUploadTemplateCsvParams: () => IMeta;
  setUploadTemplateCsvParams: (data: IMeta) => void;

  // State
  uploadTemplateCsvDetailData: IUploadTemplateCsvDetailData | null;
  openModalUploadTemplateCsvDetail: boolean;
  openModalUploadTemplateCsv: boolean;
  uploadTemplateCsvList: IUploadTemplateCsvData[];
  uploadTemplateCsvForm: UploadTemplateCsvFormInputs | null;
  uploadTemplateCsvDetailById: IUploadTemplateCsvData | null;
  selectedUploadTemplateCsvListData: IUploadTemplateCsvData[];
  optionSearchUploadTemplateCsv: ESearchKey[];
  templateByFactoryId: IUploadTemplateCsvData | null;

  // Get & Set
  getUploadTemplateCsvDetailData: () => IUploadTemplateCsvDetailData | null;
  setUploadTemplateCsvDetailData: (data: IUploadTemplateCsvDetailData) => void;
  getOpenModalUploadTemplateCsv: () => boolean;
  setOpenModalUploadTemplateCsv: (data: boolean) => void;
  getOpenModalUploadTemplateCsvDetail: () => boolean;
  setOpenModalUploadTemplateCsvDetail: (data: boolean) => void;
  getUploadTemplateCsvList: () => IUploadTemplateCsvData[];
  setUploadTemplateCsvList: (data: IUploadTemplateCsvData[]) => void;
  getUploadTemplateCsvForm: () => UploadTemplateCsvFormInputs | null;
  setUploadTemplateCsvForm: (data: UploadTemplateCsvFormInputs) => void;
  getUploadTemplateCsvDetailById: () => IUploadTemplateCsvData | null;
  setUploadTemplateCsvDetailById: (data: IUploadTemplateCsvData) => void;
  getSelectedUploadTemplateCsvListData: () => IUploadTemplateCsvData[];
  setSelectedUploadTemplateCsvListData: (
    data: IUploadTemplateCsvData[]
  ) => void;
  getOptionSearchUploadTemplateCsv: () => ESearchKey[];

  // API Get
  getAllUploadTemplateCsvList: (
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ) => Promise<IResponseWithPaginate<IUploadTemplateCsvData[]>>;

  getTemplateFactoryById: (
    factoryId: string
  ) => Promise<IBaseResponseData<IUploadTemplateCsvData>>;

  getUploadTemplateCsvById: (
    id: string
  ) => Promise<IBaseResponseData<IUploadTemplateCsvData>>;

  getTemplateByFactoryId: (
    factoryId: string,
    type: string
  ) => Promise<IBaseResponseData<IUploadTemplateCsvData>>;

  // API Post
  createTemplateCsv: (
    data: UploadTemplateCsvFormInputs
  ) => Promise<IBaseResponse>;

  // API Delete
  deleteTemplateCsv: (ids: string[]) => Promise<IBaseResponse>;

  // API Put
  updateTemplateCsv: (
    id: string,
    data: UploadTemplateCsvFormInputs
  ) => Promise<IBaseResponse>;
};

export const useUploadTemplateCsvStore = create<uploadTemplateCsvStore>(
  (set, get) => ({
    // Params
    uploadTemplateCsvParams: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    getUploadTemplateCsvParams: () => get().uploadTemplateCsvParams,
    setUploadTemplateCsvParams: (data: IMeta) => {
      set({ uploadTemplateCsvParams: data });
    },

    // State
    uploadTemplateCsvDetailData: null,
    openModalUploadTemplateCsv: false,
    openModalUploadTemplateCsvDetail: false,
    uploadTemplateCsvList: [],
    uploadTemplateCsvForm: null,
    uploadTemplateCsvDetailById: null,
    selectedUploadTemplateCsvListData: [],
    optionSearchUploadTemplateCsv: Object.values([ESearchKey.COMPANYNAME]),
    templateByFactoryId: null,

    // Get & Set
    getUploadTemplateCsvDetailData: () => get().uploadTemplateCsvDetailData,
    setUploadTemplateCsvDetailData: (data: IUploadTemplateCsvDetailData) => {
      set({ uploadTemplateCsvDetailData: data });
    },
    getOpenModalUploadTemplateCsv: () => get().openModalUploadTemplateCsv,
    setOpenModalUploadTemplateCsv: (data: boolean) => {
      set({ openModalUploadTemplateCsv: data });
    },
    getOpenModalUploadTemplateCsvDetail: () =>
      get().openModalUploadTemplateCsvDetail,
    setOpenModalUploadTemplateCsvDetail: (data: boolean) => {
      set({ openModalUploadTemplateCsvDetail: data });
    },
    getUploadTemplateCsvList: () => get().uploadTemplateCsvList,
    setUploadTemplateCsvList: (data: IUploadTemplateCsvData[]) => {
      set({ uploadTemplateCsvList: data });
    },
    getUploadTemplateCsvForm: () => get().uploadTemplateCsvForm,
    setUploadTemplateCsvForm: (data: UploadTemplateCsvFormInputs) => {
      set({ uploadTemplateCsvForm: data });
    },
    getUploadTemplateCsvDetailById: () => get().uploadTemplateCsvDetailById,
    setUploadTemplateCsvDetailById: (data: IUploadTemplateCsvData) => {
      set({ uploadTemplateCsvDetailById: data });
    },
    getSelectedUploadTemplateCsvListData: () =>
      get().selectedUploadTemplateCsvListData,
    setSelectedUploadTemplateCsvListData: (data: IUploadTemplateCsvData[]) => {
      set({ selectedUploadTemplateCsvListData: data });
    },
    getOptionSearchUploadTemplateCsv: () => get().optionSearchUploadTemplateCsv,

    // API Get
    getAllUploadTemplateCsvList: async (
      queryParams?: IMeta,
      search?: ISearch,
      sort?: ISort
    ) => {
      const response = await uploadTemplateCsvApi.getAllUploadTemplateCsv(
        queryParams,
        search,
        sort
      );
      set({
        uploadTemplateCsvList: response.data,
        uploadTemplateCsvParams: response.meta,
      });
      return response;
    },

    getTemplateFactoryById: async (
      factoryId: string
    ): Promise<IBaseResponseData<IUploadTemplateCsvData>> => {
      const response =
        await uploadTemplateCsvApi.getTemplateFactoryById(factoryId);
      return response;
    },

    getUploadTemplateCsvById: async (id: string) => {
      const response = await uploadTemplateCsvApi.getTemplateById(id);
      set({ uploadTemplateCsvDetailById: response.data });
      return response;
    },

    getTemplateByFactoryId: async (
      factoryId: string,
      type: string
    ): Promise<IBaseResponseData<IUploadTemplateCsvData>> => {
      const response = await uploadTemplateCsvApi.getTemplateByFactoryId(
        factoryId,
        type
      );
      set({ templateByFactoryId: response.data });
      return response;
    },

    // API Post
    createTemplateCsv: async (data: UploadTemplateCsvFormInputs) => {
      const response = await uploadTemplateCsvApi.createTemplateCsv(data);
      return response;
    },

    // API Delete
    deleteTemplateCsv: async (ids: string[]) => {
      const response = await uploadTemplateCsvApi.deleteTemplateCsv(ids);
      return response;
    },

    // API Put
    updateTemplateCsv: async (
      id: string,
      data: UploadTemplateCsvFormInputs
    ) => {
      const response = await uploadTemplateCsvApi.updateTemplateCsv(id, data);
      return response;
    },
  })
);
