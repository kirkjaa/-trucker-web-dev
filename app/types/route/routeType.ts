import { IMasterRoute } from "../master/masterType";
import { IOrganization } from "../organization/organizationType";

import { ERouteStatus } from "./routeEnum";

export interface IRoute {
  id: number;
  freight_type: string;
  organization_route_code: string;
  distance_value: string;
  distance_unit: string;
  status: ERouteStatus;
  reject_reason: string;
  organization: Omit<
    IOrganization,
    | "type"
    | "business_type"
    | "package"
    | "documents"
    | "addresses"
    | "owner_user"
  >;
  master_route: IMasterRoute;
}
