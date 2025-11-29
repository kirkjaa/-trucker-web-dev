import { create } from "zustand";

import { ordersApi } from "../services/ordersApi";
import { truckApi } from "../services/truckApi";
import { ESearchKey, ETruckDepartmentType } from "../types/enum";
import {
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "../types/global";
import { IOrderTruck } from "../types/orderType";
import {
  ITruckMeTotal,
  IUpdateLocationTruckRequest,
  TrucksListTable,
} from "../types/truckType";
import { TruckFormInputs } from "../utils/validate/truck-validate";

type truckStore = {
  // Params
  truckParams: IMeta;
  getTruckParams: () => IMeta;
  setTruckParams: (data: IMeta) => void;

  // State
  openModal: boolean;
  selectedTruck: TrucksListTable[];
  truckDataList: TrucksListTable[];
  truckData: TrucksListTable | null;
  optionSearchTruck: ESearchKey[];
  allTruckType: string[];
  allTruckSize: string[];

  // Get & Set
  getOpenModal: () => boolean;
  setOpenModal: (data: boolean) => void;
  getSelectedTruck: () => TrucksListTable[];
  setSelectedTruck: (data: TrucksListTable[]) => void;
  getTruckDataList: () => TrucksListTable[];
  setTruckDataList: (data: TrucksListTable[]) => void;
  getTruckData: () => TrucksListTable | null;
  setTruckData: (data: TrucksListTable) => void;
  getOptionSearchTruck: () => ESearchKey[];

  // API Get
  getAllTruckList: (
    queryParams?: IMeta,
    byId?: string,
    search?: ISearch,
    sort?: ISort
  ) => Promise<IResponseWithPaginate<TrucksListTable[]>>;
  getAllCompanyTruckList: (
    queryParams?: IMeta,
    byId?: string,
    search?: ISearch,
    sort?: ISort,
    byDepartmentType?: ETruckDepartmentType,
    isAvailable?: boolean
  ) => Promise<IResponseWithPaginate<TrucksListTable[]>>;
  getAllFactoryTruckList: (
    queryParams?: IMeta,
    byId?: string,
    search?: ISearch,
    sort?: ISort,
    byDepartmentType?: ETruckDepartmentType
  ) => Promise<IResponseWithPaginate<TrucksListTable[]>>;
  getTruckMeTotal: () => Promise<IBaseResponseData<ITruckMeTotal>>;
  getTruckById: (id: string) => Promise<IBaseResponseData<TrucksListTable>>;
  getTruckType: () => Promise<IBaseResponseData<string[]>>;
  getTruckSize: () => Promise<IBaseResponseData<string[]>>;
  getTruckOrder: (id: string) => Promise<IResponseWithPaginate<IOrderTruck[]>>;

  // API Post
  createTruck: (
    data: TruckFormInputs
  ) => Promise<IBaseResponseData<TrucksListTable>>;

  // API Patch
  updateTruckStatus: (id: string, status: boolean) => Promise<IBaseResponse>;
  updateTruck: (
    data: TruckFormInputs,
    id: string
  ) => Promise<IBaseResponseData<TrucksListTable>>;
  updateLocationTruck: (
    data: IUpdateLocationTruckRequest,
    id: string
  ) => Promise<IBaseResponseData<TrucksListTable>>;

  // API Delete
  deleteTruck: (id: string[]) => Promise<IBaseResponse>;
};

export const useTruckStore = create<truckStore>((set, get) => ({
  // Params
  truckParams: {
    page: 1,
    limit: 10,
    total: 0,
  },
  getTruckParams: () => get().truckParams,
  setTruckParams: (data: IMeta) => {
    set({ truckParams: data });
  },

  // State
  openModal: false,
  selectedTruck: [],
  truckDataList: [],
  truckData: null,
  optionSearchTruck: Object.values([
    ESearchKey.TRUCKCODE,
    ESearchKey.BRAND,
    ESearchKey.LICENSEPLATE,
  ]),
  allTruckType: [],
  allTruckSize: [],

  // Get & Set
  getOpenModal: () => get().openModal,
  setOpenModal: (data: boolean) => {
    set({ openModal: data });
  },
  getSelectedTruck: () => get().selectedTruck,
  setSelectedTruck: (data: TrucksListTable[]) => {
    set({ selectedTruck: data });
  },
  getTruckDataList: () => get().truckDataList,
  setTruckDataList: (data: TrucksListTable[]) => {
    set({ truckDataList: data });
  },
  getTruckData: () => get().truckData,
  setTruckData: (data: TrucksListTable) => {
    set({ truckData: data });
  },
  getOptionSearchTruck: () => get().optionSearchTruck,

  // API Get
  getAllTruckList: async (
    queryParams?: IMeta,
    byId?: string,
    search?: ISearch,
    sort?: ISort
  ): Promise<IResponseWithPaginate<TrucksListTable[]>> => {
    const data = await truckApi.getAllTruckList(
      queryParams,
      byId,
      search,
      sort
    );
    set({ truckDataList: data.data, truckParams: data.meta });
    return data;
  },

  getAllFactoryTruckList: async (
    queryParams?: IMeta,
    byId?: string,
    search?: ISearch,
    sort?: ISort,
    byDepartmentType?: ETruckDepartmentType
  ): Promise<IResponseWithPaginate<TrucksListTable[]>> => {
    const data = await truckApi.getAllFactoryTruckList(
      queryParams,
      byId,
      search,
      sort,
      byDepartmentType
    );
    set({ truckDataList: data.data, truckParams: data.meta });
    return data;
  },

  getAllCompanyTruckList: async (
    queryParams?: IMeta,
    byId?: string,
    search?: ISearch,
    sort?: ISort,
    byDepartmentType?: ETruckDepartmentType,
    isAvailable?: boolean
  ): Promise<IResponseWithPaginate<TrucksListTable[]>> => {
    const data = await truckApi.getAllCompanyTruckList(
      queryParams,
      byId,
      search,
      sort,
      byDepartmentType,
      isAvailable
    );
    set({ truckDataList: data.data, truckParams: data.meta });
    return data;
  },

  getTruckById: async (id: string) => {
    const data = await truckApi.getTruckById(id);
    set({ truckData: data.data });
    return data;
  },

  getTruckType: async () => {
    const res = await truckApi.getTruckType();
    set({ allTruckType: res.data });
    return res;
  },

  getTruckSize: async () => {
    const res = await truckApi.getTruckSize();
    set({ allTruckSize: res.data });
    return res;
  },

  getTruckMeTotal: async () => {
    const res = await truckApi.getTruckMeTotal();
    return res;
  },

  getTruckOrder: async (
    id: string
  ): Promise<IResponseWithPaginate<IOrderTruck[]>> => {
    const res = await ordersApi.getTrucksOrderByTruckId(id);
    return res;
  },

  // API Post
  createTruck: async (data: TruckFormInputs) => {
    const dataTruck = await truckApi.createTruck(data);
    return dataTruck;
  },

  // API Patch

  updateTruckStatus: async (id: string, status: boolean) => {
    const data = await truckApi.changeTruckStatus(id, status);
    return data;
  },

  updateTruck: async (data: TruckFormInputs, id: string) => {
    const dataTruck = await truckApi.updateTruck(data, id);
    return dataTruck;
  },
  updateLocationTruck: async (
    data: IUpdateLocationTruckRequest,
    id: string
  ) => {
    const dataTruck = await truckApi.updateLocationTruck(data, id);
    return dataTruck;
  },

  // API Delete
  deleteTruck: async (id: string[]) => {
    const data = await truckApi.deleteTruck(id);
    return data;
  },
}));
