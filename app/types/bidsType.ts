import { IOilData } from "./oilType";
import { IRfqById } from "./rfqType";
import { IRouteFactoryById } from "./routesType";

export interface IBidDetailForBidById {
  routes: IRouteFactoryById;
  bidBasePrice: number; // จากการ create bid
  oils: IOilData[];
}

export interface IBidById {
  id: string; // ID mongoDB
  rfqData: IRfqById; // BE get from rfqId when createBid
  displayCode: string; // #B00001 Auto gen
  bidStatus: string; // Draft, Submitted, Approved, Rejected === factory reject bid นี้, Canceled === company ยกเลิก bid นี้เอง
  bidDetail: IBidDetailForBidById[];
  companyData: {
    id: string;
    deleted: boolean;
    companyCode: string;
    name: string;
    address: {
      latitude: number;
      longitude: number;
      province: string;
      district: string;
      subDistrict: string;
      addressLine1: string;
      postalCode: string;
    };
    phone: string;
    email: string;
    taxId: string;
    companyStatus: string;
  };
  oilRange: number;
  bidReason: string;
  createdAt: Date;
  signatureCompany: {
    type: string; // enum text, image
    sign: string; // text, url
  };
}

export interface IBidDetail {
  routeId: string; // ID mongoDB
  bidBasePrice: number; // หน้าบ้านส่งให้ไปเก็บ
  oils: IOilData[];
}

export interface ICreateBid {
  rfqId: string; // ID mongoDB
  companyId: string; // ID mongoDB
  bidStatus: string;
  oilRange: number; // get default from API === 2 ปรับระยะห่างน้ำมัน
  bidDetail: IBidDetail[];
  bidReason: string;
  signatureCompany: {
    type: string; // enum text, image
    sign: string; // text, url
  };
}
