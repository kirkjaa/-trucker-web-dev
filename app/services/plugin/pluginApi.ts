import { apiDelete, apiGet, apiPost, apiPut } from "../common";

import {
  IBaseParams,
  IBaseResponse,
  IBaseResponseData,
  IResponseWithPaginate,
} from "@/app/types/global";
import { IPlugin, IPluginPayload } from "@/app/types/plugin/pluginType";

export interface PluginParams extends IBaseParams {}

export const pluginApi = {
  getAllPlugins: async (
    params: PluginParams
  ): Promise<IResponseWithPaginate<IPlugin[]>> => {
    const query = new URLSearchParams();
    query.set("page", params.page.toString());
    query.set("limit", params.limit.toString());
    if (params.search) query.set("search", params.search);
    if (params.sort) query.set("sort", params.sort);
    if (params.order) query.set("order", params.order);

    const response = await apiGet("/v1/plugin", query.toString());
    return response;
  },

  getPluginById: async (id: number): Promise<IBaseResponseData<IPlugin>> => {
    const response = await apiGet(`/v1/plugin/byId?id=${id}`);
    return response;
  },

  createPlugin: async (
    payload: IPluginPayload
  ): Promise<IBaseResponseData<{ id: number }>> => {
    const response = await apiPost("/v1/plugin", payload);
    return response;
  },

  updatePlugin: async (
    id: number,
    payload: IPluginPayload
  ): Promise<IBaseResponseData<{ id: number }>> => {
    const response = await apiPut(`/v1/plugin?id=${id}`, payload);
    return response;
  },

  deletePlugin: async (id: number): Promise<IBaseResponse> => {
    const response = await apiDelete(`/v1/plugin?id=${id}`);
    return response;
  },
};
