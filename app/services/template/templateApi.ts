import { apiDelete, apiGet, apiPost, apiPut } from "../common";

import {
  IBaseParams,
  IBaseResponse,
  IBaseResponseData,
  IResponseWithPaginate,
} from "@/app/types/global";
import { ITemplate, ITemplateRequest } from "@/app/types/template/templateType";

export interface templateParams extends IBaseParams {}

export const templateApi = {
  // API Get
  getAllTemplates: async (
    getAllParams: templateParams
  ): Promise<IResponseWithPaginate<ITemplate[]>> => {
    const params = new URLSearchParams();
    params.set("page", getAllParams.page.toString());
    params.set("limit", getAllParams.limit.toString());

    if (getAllParams.search)
      params.set("search", getAllParams.search.toString());

    if (getAllParams.sort) params.set("sort", getAllParams.sort);
    if (getAllParams.order) params.set("order", getAllParams.order);

    const response = await apiGet("/v1/template", params.toString());

    return response;
  },

  getTemplateById: async (
    id: number
  ): Promise<IBaseResponseData<ITemplate>> => {
    const response = await apiGet(`/v1/template/byId?id=${id}`);

    return response;
  },

  getTemplateByOrganization: async (
    type: string,
    id?: number
  ): Promise<IBaseResponseData<ITemplate>> => {
    const params = new URLSearchParams();
    params.set("type", type);

    if (id) params.set("organization_id", id.toString());

    const response = await apiGet(
      "/v1/template/byOrganization",
      params.toString()
    );

    return response;
  },

  // API Post
  createTemplate: async (data: ITemplateRequest): Promise<IBaseResponse> => {
    const response = await apiPost("/v1/template", data);

    return response;
  },

  // API Patch
  updateTemplate: async (
    id: number,
    data: ITemplateRequest
  ): Promise<IBaseResponse> => {
    const response = await apiPut(`/v1/template?id=${id}`, data);

    return response;
  },

  // API Delete
  deleteTemplate: async (id: number): Promise<IBaseResponse> => {
    const response = await apiDelete(`/v1/template?id=${id}`);

    return response;
  },
};
