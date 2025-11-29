export interface IFactoriesAndCompaniesData {
  id: string;
  factoryId: string;
  displayCode: string;
  companyId: string;
  name: string;
  phone: string;
  email: string;
  address: IFactoriesAndCompaniesAddress | null;
  admin: IFactoriesAndCompaniesAdmin | null;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  documentUrls: string[];
  dialCode: string;
  businessType: string;
  imageUrl: string | null;
  logoImageUrl: string | null;
  truckerId: string;
}

export interface IFactoriesAndCompaniesAddress {
  latitude: number;
  longitude: number;
  province: string;
  district: string;
  subDistrict: string;
  addressLine1: string;
  postalCode: string;
}
export interface IFactoriesAndCompaniesAdmin {
  adminUserId: string;
  fullName: string;
}

export interface IFactoriesAndCompaniesId {
  id: string;
}

export interface IUserFactoriesAndCompanies {
  id: string;
  displayCode: string;
  username: string;
  firstName: string;
  lastName: string;
  dialCode: string;
  phone: string;
  email: string;
  imageUrl: string;
  userStatus: string;
}
