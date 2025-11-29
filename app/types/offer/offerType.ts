import { IMasterRoute, IUnitPriceRoute } from "../master/masterType";
import { IOrganization } from "../organization/organizationType";
import { IRfqList } from "../rfq/rfqType";
import { IRoute } from "../route/routeType";
import { ISignature } from "../signature/signatureType";

export interface IPriceColumn {
  id: number;
  sequence: number;
  range: string;
  min: number;
  max: number;
}

export interface IDefaultOfferRoute {
  id: number;
  sequence: number;
  price: number;
  is_base_price: string;
}

export interface IOfferRoute {
  id: number;
  freight_type: string;
  organization_route_code: string;
  distance_value: string;
  distance_unit: string;
  status: string;
  reject_reason: string;
  created_date: Date;
  updated_date: Date;
  master_route: IMasterRoute;
  unit_price_route: IUnitPriceRoute;
  offer_routes: IDefaultOfferRoute[];
}

export interface IRouteOfferRfq {
  id: number;
  freight_type: string;
  price: number;
  is_base_price: string;
  organization_route: Omit<IRoute, "organization">;
}

export interface IRouteQuotationOffer {
  organization_route: Omit<IRoute, "organization">;
  offer_routes: IDefaultOfferRoute[];
}

export interface IOfferBase<TRoute> {
  id: number;
  display_code: string;
  range_fuel_price: number;
  remark: string;
  status: string;
  created_date: Date;
  rfq: Omit<IRfqList, "offers">;
  organization: Omit<
    IOrganization,
    "owner_user" | "type" | "business_type" | "package" | "documents"
  >;
  signature: ISignature;
  price_columns: IPriceColumn[];
  routes: TRoute[];
}

export type IOffer = IOfferBase<IRouteOfferRfq>;

export type IOfferById = IOfferBase<IOfferRoute>;

export interface IOfferSeq {
  sequence: number;
  price: number;
  is_base_price: boolean;
}

export interface IPriceOffer {
  organization_route_id: number;
  offers: IOfferSeq[];
}

export interface ICreateOffer {
  rfq_id: number;
  range_fuel_price: number;
  remark: string;
  signature_id: number;
  column_ranges: Omit<IPriceColumn, "id">[];
  price_offers: IPriceOffer[];
}
