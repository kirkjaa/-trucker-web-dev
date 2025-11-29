interface ICompanyAndFactoryData {
  id: string;
  name: string;
  taxId: string;
  admin: {
    adminUserId: string;
    fullName: string;
  };
  address: {
    longtitude: number;
    latitude: number;
    province: string;
    district: string;
    subDistrict: string;
    addressLine1: string;
    postalCode: string;
  };
}

export interface ISystemUsersData {
  id: string;
  displayCode: string;
  firstName: string;
  lastName: string;
  dialCode: any;
  phone: any;
  email: string;
  imageUrl: any;
  userStatus: string;
  company: ICompanyAndFactoryData;
  factory: ICompanyAndFactoryData;
  username: string;
}

export interface ISystemUsersId {
  id: string;
}
