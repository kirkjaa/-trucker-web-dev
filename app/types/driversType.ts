export interface IDriversData {
  id: string;
  displayCode: string;
  type: string;
  idCardImageUrl: string;
  vehicleRegistrationImageUrl: string;
  vehicleLicenseImageUrl: string;
  driverStatus: string;
  user: IDriversUser;
  truckerId: string;
  company: IDriverCompany;
  truck?: {
    id: string;
    vin: string;
    licensePlate?: {
      value: string;
      // Add other relevant fields for licensePlate if needed
    };
    // Add other relevant fields for truck if needed
  };
}
export interface IDriverCompany {
  id: string;
  name: string;
}

export interface IDriverAddress {
  latitude: number;
  longitude: number;
  province: string;
  district: string;
  subDistrict: string;
  addressLine1: string;
  postalCode: string;
}

export interface IDriversCompanyData {
  id: string;
  displayCode: string;
  name: string;
  dialCode: string;
  phone: string;
  email: string;
  address: IDriverAddress;
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

export interface IDriversUser {
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
  roles: string;
  userTruckerPackage: any;
  position: any;
  companyData: IDriversCompanyData;
  factoryData: any;
  driverData: any;
}

export interface IDriversId {
  id: string;
}
