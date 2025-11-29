import { ICompanyMe } from "./companyType";
import {
  ETruckContainers,
  ETruckDepartmentType,
  ETruckFuelType,
  ETruckType,
} from "./enum";
import { IFactoryMe } from "./factoryType";

export interface TrucksListTable {
  id: string;
  truckCode: string;
  licensePlate: ILicensePlate;
  brand: string;
  year: string;
  vin: string;
  color: string;
  type: ETruckType;
  fuelType: ETruckFuelType;
  driverId: string;
  capacity: ICapacity;
  departmentType: ETruckDepartmentType;
  isActive: boolean;
  frontImageUrl: string;
  backImageUrl: string;
  sideImageUrl: string;
  licensePlateImageUrl: string;
  documentUrls: string[];
  remark: string;
  factoryId: any;
  companyId: any;
  company: ICompanyMe;
  drivers: ITruckDriver[];
  factory: IFactoryMe;
  location: ITruckLocation;
}
export interface ITruckLocation {
  currentLocation: string;
  latitude: number;
  longitude: number;
}
export interface ITruckDriver {
  id: string;
  displayCode: string;
  type: string;
  idCardImageUrl: any;
  vehicleRegistrationImageUrl: any;
  vehicleLicenseImageUrl: any;
  driverStatus: string;
  truckerId: string;
  user: ITruckDriverUser;
}

export interface ITruckDriverUser {
  id: string;
  displayCode: string;
  username: string;
  firstName: string;
  lastName: string;
  dialCode: string;
  phone: string;
  email: string;
  imageUrl?: string;
  userStatus: string;
  roles: string;
  userTruckerPackage: any;
  position: any;
  companyData: any;
  factoryData: any;
  idCard: any;
  driverData: any;
}

export interface ILicensePlate {
  value: string;
  province: string;
}

export interface ICapacity {
  weight: number;
  weightUnit: string;
  size: ISize;
  containers: ETruckContainers[];
}

export interface ISize {
  width: number;
  length: number;
  height: number;
  unit: string;
}

export interface IUpdateLocationTruckRequest {
  currentLocation?: string;
  latitude?: number;
  longitude?: number;
}

export interface ITruckMeTotal {
  totalTypes: TotalTypes;
  totalSizes: TotalSizes;
}

export interface TotalTypes {
  types: string[];
  total: number;
}

export interface TotalSizes {
  sizes: string[];
  total: number;
}
