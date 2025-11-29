import { IBaseType } from "../global";

export interface ISubdistrict extends IBaseType {
  zip_code: string;
}

export interface IDistrict extends IBaseType {
  subdistricts: ISubdistrict[];
}

export interface IProvince extends IBaseType {
  geography_id: number;
  districts: IDistrict[];
}

export interface IBusinessType extends IBaseType {}

export interface IRole extends IBaseType {
  role_code: string;
}

export interface IOrganizationType extends IBaseType {
  type_code: string;
}

export interface IMasterRoute {
  id: number;
  code: string;
  origin_province: Omit<IProvince, "districts">;
  origin_district: Omit<IDistrict, "subdistricts">;
  origin_latitude: string;
  origin_longitude: string;
  destination_province: Omit<IProvince, "districts">;
  destination_district: Omit<IDistrict, "subdistricts">;
  destination_latitude: string;
  destination_longitude: string;
  return_point_province: Omit<IProvince, "districts">;
  return_point_district: Omit<IDistrict, "subdistricts">;
  return_point_latitude: string;
  return_point_longitude: string;
}
export interface ITruckSize extends IBaseType {}

export interface ITruckType extends IBaseType {}

export interface ITruckBrand extends IBaseType {
  code: string;
}

export interface IColor extends IBaseType {
  code: string;
}

export interface IFuelType extends IBaseType {
  code: string;
}

export interface IProvinceAndDistrict extends IBaseType {
  geography_id: number;
  districts: IDistrict[];
}

export interface IContainerType extends IBaseType {
  code: string;
}

export interface ITemplateField {
  id: number;
  type: string;
  field_name: string;
}

export interface IUnitPriceRoute extends IBaseType {
  code: string;
}

export interface IFuelPrice {
  OilName: string;
  PriceYesterday: number;
  PriceToday: number;
  PriceTomorrow: number;
  PriceDifYesterday: number;
  PriceDifTomorrow: number;
  Icon: string;
  IconWeb: string;
  IconWeb2: string;
  IconWeb3: string;
  IconWeb4: string;
  IconWeb5: string;
}
