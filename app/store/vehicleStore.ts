import { create } from "zustand";

import { vehicleApi } from "../services/vehicleApi";
import { IVehicleSize, IVehicleType } from "../types/vehicleType";

type vehicleStore = {
  // State
  vehicleSizeList: IVehicleSize[] | null;
  vehicleTypeList: IVehicleType[] | null;

  // API Get
  getVehicleSizeList: () => Promise<IVehicleSize[]>;
  getVehicleTypeList: () => Promise<IVehicleType[]>;
};

export const useVehicleStore = create<vehicleStore>((set) => ({
  // State
  vehicleSizeList: null,
  vehicleTypeList: null,

  // API Get
  getVehicleSizeList: async (): Promise<IVehicleSize[]> => {
    try {
      const response = await vehicleApi.getVehicleSizeList();

      set({ vehicleSizeList: response });
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getVehicleTypeList: async (): Promise<IVehicleType[]> => {
    try {
      const response = await vehicleApi.getVehicleTypeList();

      set({ vehicleTypeList: response });
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));
