export interface IFactoryById {
  _id: object;
  deleted: boolean;
  factoryId: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
  totalOfferUnitPrice: boolean;
  factoryStatus: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
}

export interface IFactoryMe {
  id: string;
  imageUrl: string;
  displayCode: string;
  name: string;
  dialCode: string;
  phone: string;
  email: string;
  address: IFactoryMeAddress;
  admin: any;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  factoryStatus: string;
  businessType: string;
  documentUrls: any[];
  truckerId: string;
}

export interface IFactoryMeAddress {
  latitude: number;
  longitude: number;
  province: string;
  district: string;
  subDistrict: string;
  addressLine1: string;
  postalCode: string;
}
