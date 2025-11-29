import { IBaseType } from "../global";
import { IUnitPriceRoute } from "../master/masterType";
import { IOffer } from "../offer/offerType";
import { IOrganization } from "../organization/organizationType";
import { IRoute } from "../route/routeType";
import { ISignature } from "../signature/signatureType";

export interface IRfqRoute {
  base_price: number;
  organization_route: Omit<IRoute, "organization">;
  unit_price_route: Omit<IUnitPriceRoute, "id">;
}

export interface IRfqBase<TOffer> {
  id: number;
  display_code: string;
  type: string;
  send_type: string;
  map_zone: string;
  price_changes_up: number;
  price_changes_down: number;
  contract_date_start: Date;
  contract_date_end: Date;
  fuel_price: number;
  assistant: number;
  assistant_price: number;
  remark: string;
  is_active: string;
  organization: Omit<
    IOrganization,
    | "owner_user"
    | "type"
    | "business_type"
    | "package"
    | "documents"
    | "signature"
  >;
  signature: ISignature;
  truck_size: Omit<IBaseType, "id">;
  truck_type: Omit<IBaseType, "id">;
  routes: IRfqRoute[];
  rfq_organizations: Array<{
    organization: Omit<
      IOrganization,
      | "owner_user"
      | "type"
      | "business_type"
      | "package"
      | "documents"
      | "addresses"
    >;
  }>;
  offers: TOffer[];
}

export type IRfqList = IRfqBase<
  Omit<IOffer, "signature" | "price_column" | "routes">
>;

export type IRfqById = IRfqBase<IOffer>;

export interface ICreateRfqRoute {
  organization_route_id: number;
  unit_price_route_id: number;
  base_price: number;
}

export interface ICreateRfq {
  type: string;
  send_type: string;
  price_changes_up: number;
  price_changes_down: number;
  truck_size_id: number;
  truck_type_id: number;
  contract_start_date: string;
  contract_end_date: string;
  organization_ids: number[];
  fuel_price: number;
  assistant: number;
  assistant_price: number;
  remark: string;
  signature_id: number;
  routes: ICreateRfqRoute[];
}
