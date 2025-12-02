import { create } from "zustand";

import {
  pluginApi,
  PluginParams,
} from "@/app/services/plugin/pluginApi";
import { IResponseWithPaginate } from "@/app/types/global";
import {
  IPlugin,
  IPluginPayload,
} from "@/app/types/plugin/pluginType";

type PluginStore = {
  pluginParams: PluginParams;
  getPluginParams: () => PluginParams;
  setPluginParams: (params: PluginParams) => void;

  plugins: IPlugin[];
  setPlugins: (plugins: IPlugin[]) => void;

  getAllPlugins: (
    params: PluginParams
  ) => Promise<IResponseWithPaginate<IPlugin[]>>;
  getPluginById: (id: number) => Promise<IPlugin | null>;
  createPlugin: (payload: IPluginPayload) => Promise<number | null>;
  updatePlugin: (id: number, payload: IPluginPayload) => Promise<number | null>;
  deletePlugin: (id: number) => Promise<boolean>;
};

const defaultParams: PluginParams = {
  page: 1,
  limit: 10,
};

export const usePluginStore = create<PluginStore>((set, get) => ({
  pluginParams: defaultParams,
  plugins: [],

  getPluginParams: () => get().pluginParams,
  setPluginParams: (params: PluginParams) => {
    set((state) => ({
      pluginParams: {
        ...state.pluginParams,
        page: params.page ?? state.pluginParams.page,
        limit: params.limit ?? state.pluginParams.limit,
        total: params.total ?? state.pluginParams.total,
        totalPages: params.totalPages ?? state.pluginParams.totalPages,
        search: params.search ?? state.pluginParams.search,
        sort: params.sort ?? state.pluginParams.sort,
        order: params.order ?? state.pluginParams.order,
      },
    }));
  },

  setPlugins: (plugins: IPlugin[]) => set({ plugins }),

  getAllPlugins: async (
    params: PluginParams
  ): Promise<IResponseWithPaginate<IPlugin[]>> => {
    const currentParams = get().pluginParams;
    const response = await pluginApi.getAllPlugins({
      ...currentParams,
      search: params.search ?? currentParams.search,
      sort: params.sort ?? currentParams.sort,
      order: params.order ?? currentParams.order,
    });

    set({
      plugins: response.data,
      pluginParams: {
        ...currentParams,
        page: response.meta.page,
        limit: response.meta.limit,
        totalPages: response.meta.totalPages,
        total: response.meta.total,
        search: params.search ?? currentParams.search,
      },
    });

    return response;
  },

  getPluginById: async (id: number) => {
    const response = await pluginApi.getPluginById(id);
    return response.data ?? null;
  },

  createPlugin: async (payload: IPluginPayload) => {
    const response = await pluginApi.createPlugin(payload);
    return response.data?.id ?? null;
  },

  updatePlugin: async (id: number, payload: IPluginPayload) => {
    const response = await pluginApi.updatePlugin(id, payload);
    return response.data?.id ?? null;
  },

  deletePlugin: async (id: number) => {
    const response = await pluginApi.deletePlugin(id);
    return response.statusCode === 200;
  },
}));






