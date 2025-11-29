import { IBidById } from "./bidsType";
import { IRouteDetailsForCreate, IRouteFactoryById } from "./routesType";

export interface IRfqById {
  id: string; // ID mongoDB
  displayCode: string; // #S00001 Auto gen
  rfqStatus: string; // Draft, Published, Expired, Canceled
  //   isActive: boolean; // Boolean
  active: string;
  rfqType: string; // oneWay, multiWay, abroad
  vehicleSize: string; // Truck, Van, Pickup
  vehicleType: string; // Cool, Normal, Hot
  productType: string; // ประเภทสินค้า
  contactStart: string; // วันที่เริ่มต้นสัญญา
  contactEnd: string; // วันที่สิ้นสุดสัญญา
  defaultOilRange: number; // Hard Code Default === 2
  oilRatePrice: number; // อัตราค่าน้ำมัน Default get from API
  priceRateUp: number; // ราคาผันขึ้น
  priceRateDown: number; // ราคาผันลง
  addOnEmp: string; // แรงงานเพิ่มเติม
  addOnCostPerEmp: string; // ค่าแรงงานต่อคน
  rfqReason: string[]; // หมายเหตุ
  signatureFactory: {
    type: string; // enum text, image
    sign: string; // text, url
  };
  bids: IBidById[]; // top 5
  totalBids: number;
  factoryData: {
    id: string;
    deleted: boolean;
    factoryCode: string;
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
    factoryStatus: string;
  }; // หลังบ้านเอามาให้จาก factoryId ที่ส่งไป create RFQ
  routes: IRouteFactoryById[];
  totalRoutes: number;
  createdAt: Date;
}

export interface ICreateRfq {
  factoryId: string; // from mongo
  active: string;
  rfqStatus: string; // Draft, Published
  rfqType: string; // oneWay, multiWay, abroad
  sendRfqTo: string; // enum all, only เลือกส่งไปตลาดและบริษัทขนส่งที่เลือก หรือ ส่งไปยังบริษัทขนส่งที่เลือก
  vehicleSize?: string; // ประเภทรถ
  vehicleType?: string; // รูปแบบการจัดส่ง
  contactStart: string; // วันที่เริ่มต้นสัญญา
  contactEnd: string; // วันที่สิ้นสุดสัญญา
  companyIds: string[]; // เลือกบริษัทขนส่ง ส่ง ID mongo
  oilRatePrice: number; // อัตราค่าน้ำมัน Default get from API
  priceRateUp: number; // ราคาผันขึ้น
  priceRateDown: number; // ราคาผันลง
  addOnEmp: string; // แรงงานเพิ่มเติม
  addOnCostPerEmp: string; // ค่าแรงงานต่อคน
  rfqReason: string[]; // หมายเหตุ
  signatureFactory: {
    type: string; // enum text, image
    sign: string; // text, url
  };
  routes: IRouteDetailsForCreate[];
}

export interface IRfqOil {
  OilName: string;
  PriceYesterday: number;
  PriceToday: number;
  PriceTomorrow: number;
  PriceDifYesterday: number;
  PriceDifTomorrow: number;
  Icon: string;
}
