import { EPoolType } from "./enum";

export interface IPoolData {
  id: string;
  type: EPoolType;
  subject: string;
  description: string;
  jobDetail: IPoolDataJobDetail;
  imageUrl: string;
  createdAt: Date;
}

export interface IPoolDataJobDetail {
  originProvince: string;
  destinationProvince: string;
  initialPrice: any;
  jobStartAt: Date;
  jobEndAt: Date;
  truckSize: any;
  truckQuantity: any;
}

export interface IPoolOfferData {
  id: string;
  post: IPoolData;
  offeringPrice: number;
  offerFrom: IPoolOfferFrom;
  status: string;
  createdAt: string;
}

export interface IPoolOfferFrom {
  name: string;
}

export interface IPoolLatLng {
  latitude: number;
  longitude: number;
}
