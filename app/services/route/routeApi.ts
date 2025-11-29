import { apiGet, apiPatch, apiPost } from "../common";

import { RouteForm } from "@/app/features/admin/route/validate/route-validate";
import {
  IBaseParams,
  IBaseResponse,
  IResponseWithPaginate,
} from "@/app/types/global";
import { EFreightType, ERouteStatus } from "@/app/types/route/routeEnum";
import { IRoute } from "@/app/types/route/routeType";

export interface routeParams extends IBaseParams {
  freight_type?: EFreightType;
  status?: ERouteStatus;
}

export const routeApi = {
  // API Get
  getAllRoutes: async (
    getAllParams: routeParams
  ): Promise<IResponseWithPaginate<IRoute[]>> => {
    const params = new URLSearchParams();
    params.set("page", getAllParams.page.toString());
    params.set("limit", getAllParams.limit.toString());

    if (getAllParams.search)
      params.set("search", getAllParams.search.toString());

    if (getAllParams.sort) params.set("sort", getAllParams.sort);
    if (getAllParams.order) params.set("order", getAllParams.order);

    if (getAllParams.freight_type)
      params.set("freight_type", getAllParams.freight_type);

    const response = await apiGet("/v1/route", params.toString());

    return response;
  },

  getAllRoutesByStatus: async (
    getAllParams: routeParams
  ): Promise<IResponseWithPaginate<IRoute[]>> => {
    const params = new URLSearchParams();
    params.set("page", getAllParams.page.toString());
    params.set("limit", getAllParams.limit.toString());

    if (getAllParams.search)
      params.set("search", getAllParams.search.toString());

    if (getAllParams.sort) params.set("sort", getAllParams.sort);
    if (getAllParams.order) params.set("order", getAllParams.order);

    if (getAllParams.freight_type)
      params.set("freight_type", getAllParams.freight_type);

    if (getAllParams.status) params.set("status", getAllParams.status);

    const response = await apiGet("/v1/route/byStatus", params.toString());

    return response;
  },

  // API Post
  createRoute: async (
    organizationId: number,
    data: RouteForm
  ): Promise<IBaseResponse> => {
    const response = await apiPost(
      `/v1/route?organization_id=${organizationId}`,
      data
    );

    return response;
  },

  // API Patch
  updateRouteStatus: async (
    id: number,
    status: string
  ): Promise<IBaseResponse> => {
    const response = await apiPatch(`/v1/route/status?id=${id}`, { status });

    return response;
  },
};
