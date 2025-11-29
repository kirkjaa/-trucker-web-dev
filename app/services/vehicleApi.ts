import { IVehicleSize, IVehicleType } from "../types/vehicleType";

import { apiGet } from "./common";

export const vehicleApi = {
  // API Get
  getVehicleSizeList: async (): Promise<IVehicleSize[]> => {
    try {
      const response = await apiGet("/v1/Vehicle/quotations/vehicle/Size/list");

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getVehicleTypeList: async (): Promise<IVehicleType[]> => {
    try {
      const response = await apiGet("/v1/Vehicle/quotations/vehicle/type/list");

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
