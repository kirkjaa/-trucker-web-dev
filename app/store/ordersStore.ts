/* eslint-disable prettier/prettier */
import { create } from "zustand";

import { ordersApi } from "../services/ordersApi";
import { EOrderStatus } from "../types/enum";
import type {
  getAllParams,
  IBaseResponse, // Added IBaseResponse
  IBaseResponseData,
  IResponseWithPaginate,
} from "../types/global";
import type {
  IUpdateDriversRequest,
  IUpdateOrderCompanyRequest, // Added
  Order,
  OrderDetail,
} from "../types/orderType";

export type orderStore = {
  // Added export
  // Search
  orderParams: getAllParams;
  getOrderSearchParams: () => getAllParams;
  setOrderSearchParams: (getAllParams: getAllParams) => void;

  // State
  allOrderList: Order[] | null;
  selectedOrder: OrderDetail | null; // State for a single selected order
  isLoading: boolean; // Added isLoading state
  error: string | null; // Added error state

  // API Get
  getAllOrderList: (
    getAllParams: getAllParams
  ) => Promise<IResponseWithPaginate<Order[]>>;
  getOrderById: (orderId: string) => Promise<IBaseResponseData<OrderDetail>>;
  clearSelectedOrder: () => void; // Added clearSelectedOrder action

  // API Patch
  updateDriversForOrder: (
    payload: IUpdateDriversRequest
  ) => Promise<IBaseResponseData<OrderDetail>>;
  updateOrderCompany: (
    // Added
    payload: IUpdateOrderCompanyRequest
  ) => Promise<IBaseResponse>; // Corrected to use IBaseResponse

  // Company Orders
  companyOrdersList: Order[] | null;
  companyOrdersParams: getAllParams;
  getCompanyOrdersParams: () => getAllParams;
  setCompanyOrdersParams: (getAllParams: getAllParams) => void;
  getCompanyOrdersList: (
    getAllParams: getAllParams
  ) => Promise<IResponseWithPaginate<Order[]>>;
};

const defaultOrderSearchParams: getAllParams = {
  page: 1,
  limit: 10,
  totalPages: 10,
  total: 0,
  status: EOrderStatus.PUBLISHED,
};

export const useOrderStore = create<orderStore>((set, get) => ({
  // Search
  orderParams: defaultOrderSearchParams,
  getOrderSearchParams: () => get().orderParams,
  setOrderSearchParams: (getAllParams: getAllParams) => {
    set((state) => ({
      orderParams: {
        ...state.orderParams,
        page: getAllParams.page ?? 1,
        limit: getAllParams.limit ?? 10,
        total: getAllParams.total ?? 0,
        totalPages: getAllParams.totalPages ?? 10,
        status: getAllParams.status ?? EOrderStatus.PUBLISHED,
      },
    }));
  },

  // State
  allOrderList: null,
  selectedOrder: null, // Initialize selectedOrder
  isLoading: false, // Initialize isLoading
  error: null, // Initialize error

  // API Get
  getAllOrderList: async (
    getAllParams: getAllParams
  ): Promise<IResponseWithPaginate<Order[]>> => {
    set({ isLoading: true, error: null });
    const currentParams = get().orderParams;
    try {
      const response = await ordersApi.getAllOrderList({
        ...currentParams,
        page: getAllParams.page ?? 1,
        limit: getAllParams.limit ?? 10,
        status: getAllParams.status ?? "Published",
      });

      set({
        allOrderList: response.data,
        orderParams: {
          ...currentParams,
          page: response.meta.page ?? 1,
          limit: response.meta.limit ?? 10,
          totalPages: response.meta.totalPages,
          total: response.meta.total,
          status: getAllParams.status ?? EOrderStatus.PUBLISHED,
        },
        isLoading: false,
      });
      return response;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Failed to fetch order list",
      });
      throw err;
    }
  },

  getOrderById: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersApi.getOrderById(orderId);
      if (response?.data) {
        // Corrected to optional chaining
        set({ selectedOrder: response.data, isLoading: false });
      }
      return response; // Return the full response
    } catch (err: any) {
      console.error("Error fetching order by ID in store:", err);
      set({
        selectedOrder: null,
        isLoading: false,
        error: err.message || "Failed to fetch order details",
      });
      throw err; // Re-throw the error to be caught by the caller
    }
  },

  clearSelectedOrder: () => {
    set({ selectedOrder: null, error: null });
  },

  // API Patch
  updateDriversForOrder: async (payload: IUpdateDriversRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersApi.updateDriversForOrder(payload);
      if (get().selectedOrder?.id === payload.id) {
        // Potentially refresh the selected order or update its drivers list
        await get().getOrderById(payload.id);
      } else {
        set({ isLoading: false });
      }
      return response;
    } catch (err: any) {
      console.error("Error updating drivers for order in store:", err);
      set({
        isLoading: false,
        error: err.message || "Failed to update drivers",
      });
      throw err;
    }
  },

  updateOrderCompany: async (payload: IUpdateOrderCompanyRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersApi.updateOrderCompany(payload);
      // If the updated order is currently selected, re-fetch its details
      if (get().selectedOrder?.id === payload.orderId) {
        await get().getOrderById(payload.orderId); // Re-fetch the order details
      } else {
        set({ isLoading: false });
      }
      return response;
    } catch (err: any) {
      console.error("Error updating company for order in store:", err);
      set({
        isLoading: false,
        error: err.message || "Failed to update company",
      });
      throw err;
    }
  },

  // Company Orders State
  companyOrdersList: null,
  companyOrdersParams: { ...defaultOrderSearchParams },
  getCompanyOrdersParams: () => get().companyOrdersParams,
  setCompanyOrdersParams: (getAllParams: getAllParams) => {
    set((state) => ({
      companyOrdersParams: {
        ...state.companyOrdersParams,
        page: getAllParams.page ?? 1,
        limit: getAllParams.limit ?? 10,
        total: getAllParams.total ?? 0,
        totalPages: getAllParams.totalPages ?? 10,
        status: getAllParams.status ?? "Published",
      },
    }));
  },

  // Company Orders API Get
  getCompanyOrdersList: async (getAllParams: getAllParams) => {
    set({ isLoading: true, error: null });
    const currentParams = get().companyOrdersParams;
    try {
      const response = await ordersApi.getCompanyOrderList({
        ...currentParams,
        page: getAllParams.page ?? 1,
        limit: getAllParams.limit ?? 10,
        status: getAllParams.status ?? "Published",
        name: getAllParams.name,
        value: getAllParams.value,
      });

      set({
        companyOrdersList: response.data,
        companyOrdersParams: {
          ...currentParams,
          page: response.meta.page ?? 1,
          limit: response.meta.limit ?? 10,
          totalPages: response.meta.totalPages,
          total: response.meta.total,
          status: getAllParams.status ?? "Published",
        },
        isLoading: false,
      });
      return response;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Failed to fetch company order list",
      });
      throw err;
    }
  },
}));
