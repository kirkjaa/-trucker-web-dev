import {
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "../types/global";
import { IUploadTemplateCsvData } from "../types/uploadTemplateCsvType";
import { UploadTemplateCsvFormInputs } from "../utils/validate/upload-template-csv-validate";

import { apiDelete, apiGet, apiPost, apiPut } from "./common";

export const uploadTemplateCsvApi = {
  // API Get
  getAllUploadTemplateCsv: async (
    getAllParams?: IMeta,
    search?: ISearch,
    sort?: ISort
  ): Promise<IResponseWithPaginate<IUploadTemplateCsvData[]>> => {
    const params = new URLSearchParams();
    if (getAllParams) {
      params.set("page", getAllParams.page.toString());
      params.set("limit", getAllParams.limit.toString());
    }
    if (search && search.search !== "") {
      params.set("search", search.search!);
    }
    if (sort && sort.sortBy !== "") {
      params.set("sortDirection", sort.sortDirection!);
    }
    const response = await apiGet("/v1/admin/template", params.toString());
    return response;
  },

  getTemplateFactoryById: async (
    factoryId: string
  ): Promise<IBaseResponseData<IUploadTemplateCsvData>> => {
    const response = await apiGet(`/v1/admin/template/factory/${factoryId}`);
    return response;
  },

  getTemplateById: async (
    id: string
  ): Promise<IBaseResponseData<IUploadTemplateCsvData>> => {
    const response = await apiGet(`/v1/admin/template/${id}`);
    return response;
  },

  getTemplateByFactoryId: async (
    factoryId: string,
    type: string
  ): Promise<IBaseResponseData<IUploadTemplateCsvData>> => {
    const params = new URLSearchParams();
    params.set("type", type!);
    const response = await apiGet(
      `/v1/template/factory/${factoryId}`,
      params.toString()
    );
    return response;
  },

  // API Post
  createTemplateCsv: async (
    data: UploadTemplateCsvFormInputs
  ): Promise<IBaseResponse> => {
    const response = await apiPost("/v1/admin/template", data);
    return response;
  },

  // API Delete
  deleteTemplateCsv: async (ids: string[]): Promise<IBaseResponse> => {
    try {
      const queryParams = new URLSearchParams();
      ids.forEach((id) => {
        queryParams.append("id", id);
      });
      const response = await apiDelete(`/v1/admin/template?${queryParams}`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // API Put
  updateTemplateCsv: async (
    id: string,
    data: UploadTemplateCsvFormInputs
  ): Promise<IBaseResponse> => {
    const response = await apiPut(`/v1/admin/template/${id}`, data);
    return response;
  },
};
