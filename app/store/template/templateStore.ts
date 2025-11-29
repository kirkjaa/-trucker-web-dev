import { create } from "zustand";

import {
  templateApi,
  templateParams,
} from "@/app/services/template/templateApi";
import { IResponseWithPaginate } from "@/app/types/global";
import { ITemplate } from "@/app/types/template/templateType";
import { IUploadTemplateCsvDetailData } from "@/app/utils/parseCsv";

type templateStore = {
  // Params
  templateParams: templateParams;
  getTemplateParams: () => templateParams;
  setTemplateParams: (getAllParams: templateParams) => void;

  // State
  templates: ITemplate[] | null;
  uploadTemplateCsvDetailData: IUploadTemplateCsvDetailData | null;

  // Function
  getUploadTemplateCsvDetailData: () => IUploadTemplateCsvDetailData | null;
  setUploadTemplateCsvDetailData: (data: IUploadTemplateCsvDetailData) => void;

  // API Get
  getAllTemplates: (
    getAllParams: templateParams
  ) => Promise<IResponseWithPaginate<ITemplate[]>>;
};

const defaultTemplateParams: templateParams = {
  page: 1,
  limit: 10,
};

export const useTemplateStore = create<templateStore>((set, get) => ({
  // Params
  templateParams: defaultTemplateParams,
  getTemplateParams: () => get().templateParams,
  setTemplateParams: (getAllParams: templateParams) => {
    set((state) => ({
      templateParams: {
        ...state.templateParams,
        page: getAllParams.page,
        limit: getAllParams.limit,
        total: getAllParams.total,
        totalPages: getAllParams.totalPages,
      },
    }));
  },

  // State
  templates: null,
  uploadTemplateCsvDetailData: null,

  // Function
  getUploadTemplateCsvDetailData: () => get().uploadTemplateCsvDetailData,
  setUploadTemplateCsvDetailData: (data: IUploadTemplateCsvDetailData) => {
    set({ uploadTemplateCsvDetailData: data });
  },

  // API Get
  getAllTemplates: async (
    getAllParams: templateParams
  ): Promise<IResponseWithPaginate<ITemplate[]>> => {
    try {
      const currentParams = get().templateParams;
      const response = await templateApi.getAllTemplates({
        ...currentParams,
        search: getAllParams.search,
        sort: getAllParams.sort,
        order: getAllParams.order,
      });

      set({
        templates: response.data,
        templateParams: {
          ...currentParams,
          page: response.meta.page,
          limit: response.meta.limit,
          totalPages: response.meta.totalPages,
          total: response.meta.total,
        },
      });
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
}));
