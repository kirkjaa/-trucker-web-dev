export interface ICompanyById {
  _id: object;
  deleted: boolean;
  displayCode: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  companyStatus: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
  adminUserId: string;
  businessType: string;
}

export interface ICompanyMe {
  id: string;
  displayCode: string;
  name: string;
  dialCode: string;
  phone: string;
  email: string;
  address: ICompanyMeAddress;
  admin: ICompanyMeAdmin;
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

export interface ICompanyMeAddress {
  latitude: number;
  longitude: number;
  province: string;
  district: string;
  subDistrict: string;
  addressLine1: string;
  postalCode: string;
}

export interface ICompanyMeAdmin {
  adminUserId: string;
  fullName: string;
}
