import { ERfqType } from "./rfq/rfqEnum";
import {
  ERouteShippingType,
  ERouteStatus,
  ERouteType,
  ETruckSize,
} from "./enum";

export interface ILocation {
  id?: string;
  province?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
}

export interface IDistanceRoute {
  value: number;
  unit: string;
}

export interface IRouteBase {
  routeFactoryCode: string;
  shippingType: string;
  type: string;
  distance: IDistanceRoute;
  status: ERouteStatus;
}

export interface IRouteFactoryById extends IRouteBase {
  id: string;
  deleted: boolean;
  masterRouteId: string;
  factoryId: string;
  createdAt: Date;
  updatedAt: Date;
  offerPrice: number;
  unit: string;
  displayCode: string;
  origin: ILocation;
  destination: ILocation;
}

export interface IRouteForCheck {
  routeFactoryCode: string;
  origin: Pick<ILocation, "province" | "district">;
  destination: Pick<ILocation, "province" | "district">;
}

export interface ICheckDuplicateRouteFactory {
  factoryId: string;
  routes: IRouteForCheck[];
  type: ERfqType;
}

export interface IResponseCheckDupRoute extends IRouteForCheck {
  isDuplicate: boolean;
  id: string;
  distance: IDistanceRoute;
  offerPrice: string;
  unit: string;
}

export interface IRouteDetailsForCreate {
  factoryRouteId: string;
  offerPrice: number;
  unit: string;
}

export interface IMasterRoute {
  id: string;
  displayCode: string;
  origin: ILocation;
  destination: ILocation;
  returnPoint: ILocation;
}

export interface IFactoryRoute {
  id: string;
  name: string;
}

export interface IRouteForm extends IRouteBase {
  factoryId: string;
  origin: ILocation;
  destination: ILocation;
  returnPoint: ILocation;
}

export interface IRouteData extends IRouteBase {
  id: string;
  masterRoute: IMasterRoute;
  factory: IFactoryRoute;
  returnPoint?: ILocation;
}

export interface IRouteCheckDuplicateRequest {
  routeFactoryCode: string;
  origin: ILocation;
  destination: ILocation;
}
export interface ICheckDuplicateRequest {
  factoryId: string;
  type: string;
  routes: IRouteCheckDuplicateRequest[];
}

export interface ICheckDuplicateResponse extends IRouteCheckDuplicateRequest {
  isDuplicate: boolean;
  id: string;
  distance: IDistanceRoute;
}

export interface IRoutePriceEntryListData {
  id: string;
  displayCode: string;
  origin: ILocation;
  destination: ILocation;
  returnPoint?: ILocation | null;
  priceEntries: IRoutePriceEntry[];
  shippingType?: ERouteShippingType;
  type?: ERouteType;
}

export interface IRoutePriceEntry {
  id: string;
  truckSize: ETruckSize;
  price: number;
  unitPrice: string;
}

interface ILocationForCreateRouteCode {
  province: string;
  district: string;
  latitude: number | string;
  longitude: number | string;
}

export interface ICreateRouteCode {
  factoryId: string;
  routeFactoryCode: string;
  shippingType: string;
  type: string;
  distance: {
    value: number | string;
    unit: string;
  };
  origin: ILocationForCreateRouteCode;
  destination: ILocationForCreateRouteCode;
  returnPoint: ILocationForCreateRouteCode;
}

export interface ICustomRoute {
  factoryRouteId: string;
  origin: Pick<ILocation, "province" | "district">;
  destination: Pick<ILocation, "province" | "district">;
  distance: IDistanceRoute;
  offerPrice: string;
  unit: string;
}
