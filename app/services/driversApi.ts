import { IDriversData, IDriversId } from "../types/driversType";
import { DriversStatus, DriversType } from "../types/enum";
import {
  getAllParams,
  IBaseResponse,
  IBaseResponseData,
  IMeta,
  IResponseWithPaginate,
  ISearch,
  ISort,
} from "../types/global";
import ConvertToformData from "../utils/formData";
import {
  DriverCompanyInternalFormInputs,
  DriversFormInputs,
} from "../utils/validate/drivers-validate";

import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "./common";

export const driversApi = {
  getAllDriversList: async (
    byType?: DriversType,
    queryParams?: IMeta,
    search?: ISearch,
    sort?: ISort,
    byStatus?: DriversStatus
  ): Promise<IResponseWithPaginate<IDriversData[]>> => {
    const params = new URLSearchParams();
    if (search && search.search !== "") {
      params.set("search", search.search!);
      search.searchKey?.forEach((key) => {
        params.append("searchKey", key);
      });
    }
    if (sort && sort.sortBy !== "") {
      params.set("sortDirection", sort.sortDirection!);
      params.set("sortBy", sort.sortBy!);
    }
    if (byType) {
      params.set("byType", byType.toString());
    }
    if (byStatus) {
      params.set("byStatus", byStatus.toString());
    }
    if (queryParams) {
      params.set("page", queryParams.page.toString());
      params.set("limit", queryParams.limit.toString());
    }
    const response = await apiGet("/v1/admin/driver", params.toString());
    return response;
  },
  getDriverCompanyMeList: async (): Promise<
    IResponseWithPaginate<IDriversData[]>
  > => {
    const response = await apiGet("/v1/driver/company/me");
    return response;
  },
  createDriver: async (
    data: DriversFormInputs
  ): Promise<IBaseResponseData<IDriversId>> => {
    const response = await apiPost("/v1/admin/driver", ConvertToformData(data));
    return response;
  },
  createDriverCompanyInternal: async (
    data: DriverCompanyInternalFormInputs
  ): Promise<IBaseResponseData<IDriversId>> => {
    const response = await apiPost(
      "/v1/driver/company/internal",
      ConvertToformData(data)
    );
    return response;
  },
  updateDriver: async (
    id: string,
    data: DriversFormInputs
  ): Promise<IBaseResponseData<IDriversId>> => {
    const response = await apiPut(
      `/v1/admin/driver/${id}`,
      ConvertToformData(data)
    );
    return response;
  },
  deleteDriver: async (ids: string[]): Promise<IBaseResponse> => {
    try {
      const queryParams = new URLSearchParams();
      ids.forEach((id) => {
        queryParams.append("id", id);
      });
      const response = await apiDelete(`/v1/admin/drive?${queryParams}`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getDriverById: async (
    id: string
  ): Promise<IBaseResponseData<IDriversData>> => {
    try {
      const response = await apiGet(`/v1/admin/driver/${id}`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  driverStatusById: async (
    id: string,
    status: DriversStatus,
    reason?: string,
    remark?: string
  ): Promise<IBaseResponseData<IDriversId>> => {
    const response = await apiPatch(`/v1/admin/driver/${id}/status`, {
      status,
      reason,
      remark,
    });
    return response;
  },
  addTruckByDriverId: async (
    id: string,
    truckId: string
  ): Promise<IBaseResponse> => {
    const payload = {
      truckId,
    };
    const response = await apiPatch(`/v1/driver/${id}/truck`, payload);
    return response;
  },
  getCompanyDrivers: async (
    params: getAllParams
  ): Promise<IResponseWithPaginate<IDriversData[]>> => {
    const urlParams = new URLSearchParams();
    urlParams.set("page", params.page.toString());
    urlParams.set("limit", params.limit.toString());
    // Add any other necessary params from your API spec
    // TODO: Add check free driver first filter from API......
    try {
      const response = await apiGet(
        "/v1/driver/company/me",
        urlParams.toString()
      );
      return response;
    } catch (error) {
      console.error("Error fetching company drivers:", error);
      throw error;
    }
  },
};
