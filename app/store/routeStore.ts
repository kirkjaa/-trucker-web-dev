import { create } from "zustand";

import { IRouteFactoryListParams, routeApi } from "../services/routeApi";
import { ERouteShippingType, ERouteStatus, ERouteType } from "../types/enum";
import {
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "../types/global";
import {
  ICheckDuplicateRequest,
  ICheckDuplicateResponse,
  ICheckDuplicateRouteFactory,
  ICreateRouteCode,
  IResponseCheckDupRoute,
  IRouteData,
  IRoutePriceEntryListData,
} from "../types/routesType";
import { RouteFormInputs } from "../utils/validate/route-validate";

type routeStore = {
  // Params
  routeFactoryParams: IRouteFactoryListParams;
  getRouteFactorySearchParams: () => IRouteFactoryListParams;
  setRouteFactorySearchParams: (getAllParams: IRouteFactoryListParams) => void;
  routeParams: IMeta;
  getRouteParams: () => IMeta;
  setRouteParams: (IMeta: IMeta) => void;

  routePriceEntryParams: IMeta;
  getRoutePriceEntryParams: () => IMeta;
  setRoutePriceEntryParams: (IMeta: IMeta) => void;

  // State
  routeFactoryList: IRouteData[] | null;
  routePriceEntryListData: IRoutePriceEntryListData[];
  routeList: IRouteData[];
  openCreateModal: boolean;
  formCreate: RouteFormInputs[];
  duplicateData: ICheckDuplicateResponse[];

  // Get & Set
  getRoutePriceEntryListData: () => IRoutePriceEntryListData[];
  setRoutePriceEntryListData: (data: IRoutePriceEntryListData[]) => void;
  getRouteList: () => IRouteData[];
  setRouteList: (data: IRouteData[]) => void;
  getOpenCreateModal: () => boolean;
  setOpenCreateModal: (openCreateModal: boolean) => void;
  getFormCreate: () => RouteFormInputs[];
  setFormCreate: (data: RouteFormInputs[]) => void;
  getDuplicateData: () => ICheckDuplicateResponse[];
  setDuplicateData: (data: ICheckDuplicateResponse[]) => void;

  // API Get
  getRouteFactoryList: (
    getAllParams: IRouteFactoryListParams
  ) => Promise<IResponseWithPaginate<IRouteData[]>>;
  getRoutePriceEntryList: (
    params?: IMeta,
    byType?: ERouteType
  ) => Promise<IResponseWithPaginate<IRoutePriceEntryListData[]>>;
  getAllRouteList: (
    queryParams?: IMeta,
    byShippingType?: ERouteShippingType,
    byStatus?: ERouteStatus,
    byType?: ERouteType,
    search?: ISearch,
    byFactoryId?: string,
    sort?: ISort
  ) => Promise<IResponseWithPaginate<IRouteData[]>>;

  // API Post
  checkDuplicateRouteFactory: (
    data: ICheckDuplicateRouteFactory
  ) => Promise<IBaseResponseData<IResponseCheckDupRoute[]>>;
  createOneRoute: (data: RouteFormInputs) => Promise<IBaseResponse>;
  createManyRoute: (data: RouteFormInputs[]) => Promise<IBaseResponse>;
  confirmedRoute: (ids: string[]) => Promise<IBaseResponse>;
  rejectedRoute: (ids: string[]) => Promise<IBaseResponse>;
  checkDuplicateRoute: (
    data: ICheckDuplicateRequest
  ) => Promise<IBaseResponseData<ICheckDuplicateResponse[]>>;
  validateBuildDataCreate: (
    data: RouteFormInputs[]
  ) => Promise<RouteFormInputs[]>;
  createOneFactoryRoute: (data: ICreateRouteCode) => Promise<IBaseResponse>;
  createManyFactoryRoute: (data: ICreateRouteCode[]) => Promise<IBaseResponse>;
};

const defaultRouteFactoryParams: IRouteFactoryListParams = {
  page: 1,
  limit: 10,
  totalPages: 10,
  total: 0,
  byFactoryId: "",
};

export const useRouteStore = create<routeStore>((set, get) => ({
  // Params
  routeFactoryParams: defaultRouteFactoryParams,
  getRouteFactorySearchParams: () => get().routeFactoryParams,
  setRouteFactorySearchParams: (getAllParams: IRouteFactoryListParams) => {
    set((state) => ({
      routeFactoryParams: {
        ...state.routeFactoryParams,
        page: getAllParams.page ?? 1,
        limit: getAllParams.limit ?? 10,
        total: getAllParams.total ?? 0,
        totalPages: getAllParams.totalPages ?? 10,
        byFactoryId: getAllParams.byFactoryId ?? "",
      },
    }));
  },
  routeParams: {
    page: 1,
    limit: 10,
    total: 0,
  },
  getRouteParams: () => get().routeParams,
  setRouteParams: (IMeta: IMeta) => {
    set({ routeParams: IMeta });
  },

  routePriceEntryParams: {
    page: 1,
    limit: 10,
    total: 0,
  },
  getRoutePriceEntryParams: () => get().routePriceEntryParams,
  setRoutePriceEntryParams: (IMeta: IMeta) => {
    set({ routePriceEntryParams: IMeta });
  },
  // State
  routeFactoryList: null,
  routePriceEntryListData: [],
  routeList: [],
  openCreateModal: false,
  formCreate: [],
  duplicateData: [],

  // Get & Set
  getRoutePriceEntryListData: () => get().routePriceEntryListData,
  setRoutePriceEntryListData: (data: IRoutePriceEntryListData[]) => {
    set({ routePriceEntryListData: data });
  },
  getRouteList: () => get().routeList,
  setRouteList: (data: IRouteData[]) => {
    set({ routeList: data });
  },
  getOpenCreateModal: () => get().openCreateModal,
  setOpenCreateModal: (openCreateModal: boolean) => {
    set({ openCreateModal });
  },
  getFormCreate: () => get().formCreate,
  setFormCreate: (data: RouteFormInputs[]) => {
    set({ formCreate: data });
  },
  getDuplicateData: () => get().duplicateData,
  setDuplicateData: (data: ICheckDuplicateResponse[]) => {
    set({ duplicateData: data });
  },

  // API Get
  getRouteFactoryList: async (
    getAllParams: IRouteFactoryListParams
  ): Promise<IResponseWithPaginate<IRouteData[]>> => {
    try {
      const currentParams = get().routeFactoryParams;
      const response = await routeApi.getRouteFactoryList({
        ...currentParams,
        page: getAllParams.page ?? 1,
        limit: getAllParams.limit ?? 10,
        total: getAllParams.total ?? 0,
        totalPages: getAllParams.totalPages ?? 10,
        search: getAllParams.search ?? "",
        byId: getAllParams.byId ?? "",
        byShippingType: getAllParams.byShippingType ?? "",
        byStatus: getAllParams.byStatus ?? "",
        byType: getAllParams.byType ?? "",
        byFactoryId: getAllParams.byFactoryId ?? "",
        byOriginDistrict: getAllParams.byOriginDistrict ?? "",
        sortBy: getAllParams.sortBy ?? "",
        sortDirection: getAllParams.sortDirection ?? "",
      });

      set({
        routeFactoryList: response.data,
        routeFactoryParams: response.meta,
      });
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getRoutePriceEntryList: async (
    params?: IMeta,
    byType?: ERouteType
  ): Promise<IResponseWithPaginate<IRoutePriceEntryListData[]>> => {
    try {
      const response = await routeApi.getRoutePriceEntryList(params, byType);
      set({
        routePriceEntryListData: response.data,
        routePriceEntryParams: response.meta,
      });
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getAllRouteList: async (
    queryParams?: IMeta,
    byShippingType?: ERouteShippingType,
    byStatus?: ERouteStatus,
    byType?: ERouteType,
    search?: ISearch,
    byFactoryId?: string,
    sort?: ISort
  ): Promise<IResponseWithPaginate<IRouteData[]>> => {
    const response = await routeApi.getAllRouteList(
      queryParams,
      byShippingType,
      byStatus,
      byType,
      search,
      byFactoryId,
      sort
    );
    set({ routeList: response.data, routeParams: response.meta });
    return response;
  },

  // API Post
  checkDuplicateRouteFactory: async (
    data: ICheckDuplicateRouteFactory
  ): Promise<IBaseResponseData<IResponseCheckDupRoute[]>> => {
    try {
      const response = await routeApi.checkDuplicateRouteFactory(data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  createOneRoute: async (data: RouteFormInputs): Promise<IBaseResponse> => {
    try {
      const response = await routeApi.createOneRoute(data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  createManyRoute: async (data: RouteFormInputs[]): Promise<IBaseResponse> => {
    try {
      const response = await routeApi.createManyRoute(data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  checkDuplicateRoute: async (
    data: ICheckDuplicateRequest
  ): Promise<IBaseResponseData<ICheckDuplicateResponse[]>> => {
    try {
      const response = await routeApi.checkDuplicateRoute(data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  validateBuildDataCreate: async (
    data: RouteFormInputs[]
  ): Promise<RouteFormInputs[]> => {
    const routes = data.map(({ routeFactoryCode, origin, destination }) => ({
      routeFactoryCode: routeFactoryCode!,
      origin: origin!,
      destination: destination!,
    }));

    const validateRequest: ICheckDuplicateRequest = {
      factoryId: data[0].factoryId!,
      type: data[0].type!,
      routes,
    };

    const { data: duplicateResults } =
      await get().checkDuplicateRoute(validateRequest);

    const duplicateCodes = new Set<string>();
    const validCodes = new Set<string>();

    duplicateResults.forEach(({ routeFactoryCode, isDuplicate }) => {
      if (isDuplicate) {
        duplicateCodes.add(routeFactoryCode);
      } else {
        validCodes.add(routeFactoryCode);
      }
    });

    set({
      duplicateData: duplicateResults.filter(({ isDuplicate }) => isDuplicate),
    });

    // กรองเฉพาะรายการที่ไม่ซ้ำ
    return data.filter(({ routeFactoryCode }) =>
      validCodes.has(routeFactoryCode!)
    );
  },

  createOneFactoryRoute: async (
    data: ICreateRouteCode
  ): Promise<IBaseResponse> => {
    try {
      const response = await routeApi.createOneFactoryRoute(data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  createManyFactoryRoute: async (
    data: ICreateRouteCode[]
  ): Promise<IBaseResponse> => {
    try {
      const response = await routeApi.createManyFactoryRoute(data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // API Patch
  confirmedRoute: async (ids: string[]): Promise<IBaseResponse> => {
    try {
      const response = await routeApi.confirmedRoute(ids);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  rejectedRoute: async (ids: string[]): Promise<IBaseResponse> => {
    try {
      const response = await routeApi.rejectedRoute(ids);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));
