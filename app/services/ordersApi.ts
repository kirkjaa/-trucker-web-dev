import { useUserStore } from "../store/userStore";
import type {
  getAllParams,
  IBaseResponse,
  IBaseResponseData,
  IResponseWithPaginate,
} from "../types/global";
import type {
  IOrderTruck,
  IUpdateDriversRequest,
  IUpdateOrderCompanyRequest,
  Order,
  OrderDetail,
} from "../types/orderType";
import type { IRfqById } from "../types/rfqType";

import { apiGet, apiPatch, apiPost } from "./common";

// Placeholder for IUpdateOrderStatusRequest if not defined elsewhere
interface IUpdateOrderStatusRequest {
  id: string;
  status: string;
}

export interface CreateOrderRequest {
  displayCode?: string;
  factoryId: string;
  factoryName: string;
  orderType: "oneWay" | "multiWay" | "csvImport" | "abroad";
  vehicleType: string;
  vehicleSize: string;
  items: string;
  startDestination: string;
  zone: string;
  destination: string;
  distance: number;
  orderStatus: string;
  paymentStatus: string;
  paymentType: string;
  deliveryType: string;
  createdBy: string;
  masterRouteType?: string;
  originProvince?: string;
  companies?: Record<string, unknown>;
  drivers?: Record<string, unknown>;
  tripInformation?: Record<string, unknown>;
  overviewInformation?: Record<string, unknown>;
  priceInformation?: Record<string, unknown>;
  checkIns?: Record<string, unknown>;
  assistantStaff?: Record<string, unknown>;
  registrationHistory?: Record<string, unknown>;
  vehicleRegistration?: string;
  price?: number;
  fuelCost?: number;
  maxGross?: number;
  tare?: number;
  containerNo?: string;
  sealNo?: string;
  expensive?: number;
  updatedBy?: string;
}

export const createOrder = async (
  data: CreateOrderRequest
): Promise<unknown> => {
  const userStore = useUserStore.getState();
  const userMe = userStore.userMe;

  try {
    const enhancedData = {
      ...data,
      createdBy: userMe?.id || data.createdBy,
      factoryId: userMe?.factory.id || data.factoryId,
      factoryName: userMe?.factory.name || data.factoryName,
    };

    try {
      const response = await apiPost("/v1/orders/create", enhancedData);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const ordersApi = {
  getAllOrdersList: async (
    getAllParams: getAllParams
  ): Promise<IResponseWithPaginate<IRfqById[]>> => {
    const params = new URLSearchParams();

    params.set("name", getAllParams.name ? getAllParams.name.join(",") : "");
    if (getAllParams.value) {
      params.set("value", getAllParams.value);
    }
    if (getAllParams.status) {
      params.set("status", getAllParams.status);
    }
    if (getAllParams.isActive) {
      params.set("isActive", getAllParams.isActive.toString());
    }
    params.set("page", getAllParams.page.toString());
    params.set("limit", getAllParams.limit.toString());
    try {
      const response = await apiGet("/v1/orders/list", params.toString());
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getOrderById: async (
    orderId: string
  ): Promise<IBaseResponseData<OrderDetail>> => {
    try {
      const response = await apiGet(`/v1/orders/${orderId}`);
      return response;
    } catch (error) {
      console.log("Error fetching order by ID:", error);
      throw error;
    }
  },

  getAllOrderList: async (
    getAllParams: getAllParams
  ): Promise<IResponseWithPaginate<Order[]>> => {
    const params = new URLSearchParams();
    if (getAllParams.status) {
      params.set("status", getAllParams.status);
    }
    params.set("page", getAllParams.page.toString());
    params.set("limit", getAllParams.limit.toString());
    try {
      const response = await apiGet("/v1/orders/list", params.toString());
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  deleteOrdersByIds: async (orderIds: string[]): Promise<IBaseResponse> => {
    try {
      const response = await apiPatch("/v1/orders/delete", { ids: orderIds });
      console.log("🚀 ~ deleteOrdersByIds: ~ response:", response);
      return response;
    } catch (error) {
      console.error("Error deleting orders:", error);
      throw error;
    }
  },

  updateOrderStatus: async (
    payload: IUpdateOrderStatusRequest
  ): Promise<IBaseResponseData<OrderDetail>> => {
    return apiPatch("/v1/orders/update-status", payload);
  },

  updateDriversForOrder: async (
    payload: IUpdateDriversRequest
  ): Promise<IBaseResponseData<OrderDetail>> => {
    return apiPatch("/v1/orders/update-drivers", payload);
  },

  updateOrderCompany: async (
    payload: IUpdateOrderCompanyRequest
  ): Promise<IBaseResponse> => {
    return apiPatch(`/v1/orders/${payload.orderId}/company`, payload);
  },

  getCompanyOrderList: async (
    getAllParams: getAllParams
  ): Promise<IResponseWithPaginate<Order[]>> => {
    try {
      const params = new URLSearchParams();

      params.set("name", getAllParams.name ? getAllParams.name.join(",") : "");
      if (getAllParams.value) {
        params.set("value", getAllParams.value);
      }
      if (getAllParams.status) {
        params.set("status", getAllParams.status);
      }
      if (getAllParams.isActive) {
        params.set("isActive", getAllParams.isActive.toString());
      }

      const response = await apiGet(
        "/v1/orders/companyList",
        params.toString()
      );
      return response;
    } catch (err) {
      console.error("Error retrieving company order list:", err);
      throw err;
    }
  },
  getTrucksOrderByTruckId: async (
    truckId: string
  ): Promise<IResponseWithPaginate<IOrderTruck[]>> => {
    try {
      const response = await apiGet(`/v1/orders/truck/${truckId}`);
      return response;
    } catch (err) {
      console.error("Error retrieving orders by truck ID:", err);
      throw err;
    }
  },
};
