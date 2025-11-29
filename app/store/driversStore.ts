import { create } from "zustand";

import { driversApi } from "../services/driversApi";
import { IDriversData, IDriversId } from "../types/driversType";
import { DriversStatus, DriversType, ESearchKey } from "../types/enum";
import {
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "../types/global";
import {
  DriverAddTruckFormInputs,
  DriverCompanyInternalFormInputs,
  DriversFormInputs,
} from "../utils/validate/drivers-validate";

type DriversStore = {
  driversParams: IMeta;
  getDriversParams: () => IMeta;
  setDriversParams: (params: IMeta) => void;
  resetDriversParams: () => void;
  createDriver: (
    data: DriversFormInputs
  ) => Promise<IBaseResponseData<IDriversId>>;
  createDriverCompanyInternal: (
    data: DriverCompanyInternalFormInputs
  ) => Promise<IBaseResponseData<IDriversId>>;
  updateDriver: (
    id: string,
    data: DriversFormInputs
  ) => Promise<IBaseResponseData<IDriversId>>;
  getDriverById: (id: string) => Promise<IBaseResponseData<IDriversData>>;
  getAllDriversList: (
    byType?: DriversType,
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort,
    byStatus?: DriversStatus
  ) => Promise<IResponseWithPaginate<IDriversData[]>>;
  getDriverCompanyMeList: () => Promise<IResponseWithPaginate<IDriversData[]>>;
  driversData: IDriversData[];
  getDriversData: () => IDriversData[];
  setDriversData: (data: IDriversData[]) => void;
  driverInfo: IDriversData | null;
  getDriverInfo: () => IDriversData | null;
  setDriverInfo: (data: IDriversData | null) => void;
  selectedList: IDriversData[];
  getSelectedList: () => IDriversData[];
  setSelectedList: (data: IDriversData[]) => void;
  deleteDriver: (ids: string[]) => Promise<IBaseResponse>;
  driverStatusById: (
    id: string,
    status: DriversStatus,
    reason?: string,
    remark?: string
  ) => Promise<IBaseResponseData<IDriversId>>;
  optionSearchSystemUsersDriver: ESearchKey[];
  getOptionSearchSystemUsersDriver: () => ESearchKey[];
  addTruckDriver: (data: DriverAddTruckFormInputs) => Promise<IBaseResponse>;

  // Added for company drivers
  companyDriversList: IDriversData[];
  fetchCompanyDrivers: (params: IMeta) => Promise<void>;
};

export const useDriversStore = create<DriversStore>((set, get) => ({
  selectedList: [],
  getSelectedList: () => get().selectedList,
  setSelectedList: (data: IDriversData[]) => set({ selectedList: data }),
  driversData: [],
  driversParams: {
    page: 1,
    limit: 10,
    total: 0,
  },
  getDriversParams: () => get().driversParams,
  setDriversParams: (params: IMeta) => {
    set((state) => ({
      driversParams: { ...state.driversParams, ...params },
    }));
  },
  resetDriversParams: () => {
    set({
      driversParams: {
        page: 1,
        limit: 10,
        total: 0,
      },
    });
  },
  createDriver: async (data: DriversFormInputs) => {
    try {
      const response = await driversApi.createDriver(data);
      return response;
    } catch (error) {
      console.error("Error creating driver:", error);
      throw error;
    }
  },
  createDriverCompanyInternal: async (
    data: DriverCompanyInternalFormInputs
  ) => {
    const response = await driversApi.createDriverCompanyInternal(data);
    return response;
  },
  updateDriver: async (id: string, data: DriversFormInputs) => {
    try {
      const response = await driversApi.updateDriver(id, data);
      return response;
    } catch (error) {
      console.error("Error updating driver:", error);
      throw error;
    }
  },
  driverInfo: null,
  getDriverInfo: () => get().driverInfo,
  setDriverInfo: (data: IDriversData | null) => {
    set({ driverInfo: data });
  },
  optionSearchSystemUsersDriver: Object.values([
    ESearchKey.DISPLAYCODE,
    ESearchKey.COMPANYNAME,
  ]),
  getOptionSearchSystemUsersDriver: () => get().optionSearchSystemUsersDriver,
  getDriverById: async (id: string) => {
    try {
      const response = await driversApi.getDriverById(id);
      set({ driverInfo: response.data });
      return response;
    } catch (error) {
      console.error("Error fetching driver by ID:", error);
      throw error;
    }
  },
  getDriversData: () => get().driversData,
  setDriversData: (data: IDriversData[]) => {
    set({ driversData: data });
  },
  getAllDriversList: async (
    byType?: DriversType,
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort,
    byStatus?: DriversStatus
  ) => {
    try {
      const response = await driversApi.getAllDriversList(
        byType,
        queryParams,
        search,
        sort,
        byStatus
      );
      set({ driversData: response.data, driversParams: response.meta });
      return response;
    } catch (error) {
      console.error("Error fetching drivers list:", error);
      throw error;
    }
  },
  getDriverCompanyMeList: async () => {
    try {
      const response = await driversApi.getDriverCompanyMeList();
      return response;
    } catch (error) {
      console.error("Error fetching driver list:", error);
      throw error;
    }
  },
  deleteDriver: async (ids: string[]) => {
    try {
      const response = await driversApi.deleteDriver(ids);
      return response;
    } catch (error) {
      console.error("Error deleting driver:", error);
      throw error;
    }
  },
  driverStatusById: async (
    id: string,
    status: DriversStatus,
    reason?: string,
    remark?: string
  ): Promise<IBaseResponseData<IDriversId>> => {
    const response = driversApi.driverStatusById(id, status, reason, remark);
    return response;
  },
  addTruckDriver: async (data: DriverAddTruckFormInputs) => {
    const response = await driversApi.addTruckByDriverId(data.id, data.truckId);
    return response;
  },

  // Added for company drivers
  companyDriversList: [],
  fetchCompanyDrivers: async (params: IMeta) => {
    try {
      const response = await driversApi.getCompanyDrivers(params);
      set({ companyDriversList: response.data, driversParams: response.meta });
    } catch (error) {
      console.error("Error fetching company drivers in store:", error);
      set({ companyDriversList: [] });
    }
  },
}));
