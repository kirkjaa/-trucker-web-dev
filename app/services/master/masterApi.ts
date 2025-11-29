import {
  IBusinessType,
  IColor,
  IContainerType,
  IFuelPrice,
  IFuelType,
  IMasterRoute,
  IOrganizationType,
  IProvince,
  IProvinceAndDistrict,
  IRole,
  ITemplateField,
  ITruckBrand,
  ITruckSize,
  ITruckType,
  IUnitPriceRoute,
} from "../../types/master/masterType";
import { apiGet } from "../common";

import { IBaseResponseData } from "@/app/types/global";

export const masterApi = {
  // API Get
  getProvinces: async (): Promise<IBaseResponseData<IProvince[]>> => {
    const response = await apiGet("/v1/master/provinces");

    return response;
  },

  getBusinessTypes: async (): Promise<IBaseResponseData<IBusinessType[]>> => {
    const response = await apiGet("/v1/master/business-types");

    return response;
  },

  getRoles: async (): Promise<IBaseResponseData<IRole[]>> => {
    const response = await apiGet("/v1/master/roles");

    return response;
  },

  getOrganizationTypes: async (): Promise<
    IBaseResponseData<IOrganizationType[]>
  > => {
    const response = await apiGet("/v1/master/organizations-types");

    return response;
  },

  getMasterRoutes: async (): Promise<IBaseResponseData<IMasterRoute[]>> => {
    const response = await apiGet("/v1/master/routes");

    return response;
  },

  getTruckSizes: async (): Promise<IBaseResponseData<ITruckSize[]>> => {
    const response = await apiGet("/v1/master/truck-sizes");

    return response;
  },

  getTruckTypes: async (): Promise<IBaseResponseData<ITruckType[]>> => {
    const response = await apiGet("/v1/master/truck-types");

    return response;
  },

  getTruckBrands: async (): Promise<IBaseResponseData<ITruckBrand[]>> => {
    const response = await apiGet("/v1/master/truck-brands");

    return response;
  },

  getColors: async (): Promise<IBaseResponseData<IColor[]>> => {
    const response = await apiGet("/v1/master/colors");

    return response;
  },

  getFuelTypes: async (): Promise<IBaseResponseData<IFuelType[]>> => {
    const response = await apiGet("/v1/master/fuel-types");

    return response;
  },

  getProvincesAndDistricts: async (): Promise<
    IBaseResponseData<IProvinceAndDistrict[]>
  > => {
    const response = await apiGet("/v1/master/provinces-and-districts");

    return response;
  },

  getContainerTypes: async (): Promise<IBaseResponseData<IContainerType[]>> => {
    const response = await apiGet("/v1/master/container-types");

    return response;
  },

  getTemplateFields: async (
    type: string
  ): Promise<IBaseResponseData<ITemplateField[]>> => {
    const response = await apiGet(`/v1/master/template-fields?type=${type}`);

    return response;
  },

  getUnitPriceRoutes: async (): Promise<
    IBaseResponseData<IUnitPriceRoute[]>
  > => {
    const response = await apiGet("/v1/master/unit-price-routes");

    return response;
  },

  getFuelPrices: async (): Promise<IBaseResponseData<IFuelPrice[]>> => {
    const response = await apiGet("/v1/master/fuel-price");

    return response;
  },
};
