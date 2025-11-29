import { TrucksListTable } from "./truckType";

export interface IUserAgora {
  uuid: string;
  type: string;
  created: string;
  username: string;
  activated: boolean;
}

export interface IUsersDriver {
  id: string;
  displayCode: string;
  type: string;
  idCardImageUrl: any;
  vehicleRegistrationImageUrl: any;
  vehicleLicenseImageUrl: any;
  driverStatus: string;
  truckerId: string;
  truck: TrucksListTable;
}
export interface IUsersListTable {
  _id: IUsersListTableId;
  deleted: boolean;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string;
  userStatus: string;
  imageUrl: any;
  factoryId: string;
  companyId: any;
  dialCode: string;
  position: IUsersPosition;
  phone: string;
  username: string;
  displayCode: string;
  createdAt: string;
  updatedAt: string;
  userAgora: IUserAgora;
  id: string;
  isShowPassword: boolean;
  driver?: IUsersDriver;
}

export interface IUsersListTableId {}

export interface IUsersDetail {
  id: string;
  displayCode: string;
  username: string;
  firstName: string;
  lastName: string;
  dialCode: string;
  phone: string;
  email: string;
  imageUrl: any;
  userStatus: string;
  roles: string;
  userTruckerPackage: any;
  position: IUsersPosition;
  companyData: IUsersCompanyData;
  factoryData: any;
  driverData: any;
}

export interface IUsersPosition {
  id: string;
  name: string;
  title: string;
  isActive: boolean;
}

export interface IUsersCompanyData {
  id: string;
  displayCode: string;
  name: string;
  dialCode: string;
  phone: string;
  email: string;
  address: IUsersAddress;
  admin: any;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  companyStatus: string;
  businessType: string;
  imageUrl: string;
  logoImageUrl: string;
  documentUrls: string[];
  truckerId: string;
}

export interface IUsersAddress {
  latitude: number;
  longitude: number;
  province: string;
  district: string;
  subDistrict: string;
  addressLine1: string;
  postalCode: string;
}
