import { useEffect, useState } from "react";

import { type orderStore, useOrderStore } from "../store/ordersStore"; // Use 'type' for orderStore
import type { getAllParams, IMeta } from "../types/global"; // Use 'type' for getAllParams and import IMeta

interface UseOrderListProps {
  page: number;
  limit: number;
  status?: string;
}

export const useOrderList = ({ page, limit, status }: UseOrderListProps) => {
  const {
    getAllOrderList,
    allOrderList,
    orderParams,
    selectedOrder, // This will be the source for orderDetail
    getOrderById: getOrderByIdFromStore, // Action from the store
  } = useOrderStore((state: orderStore) => ({
    getAllOrderList: state.getAllOrderList,
    allOrderList: state.allOrderList,
    orderParams: state.orderParams,
    selectedOrder: state.selectedOrder,
    getOrderById: state.getOrderById,
  }));

  // States for list loading and error
  const [isListLoading, setIsListLoading] = useState(false);
  const [listError, setListError] = useState<Error | null>(null);

  // States for detail loading and error (local to this hook)
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsListLoading(true);
      setListError(null);
      try {
        const params: getAllParams = {
          page,
          limit,
          status,
        };
        await getAllOrderList(params);
      } catch (error) {
        // Type assertion for error handling
        if (error instanceof Error) {
          setListError(error);
        } else {
          setListError(new Error(String(error ?? "An unknown error occurred")));
        }
      } finally {
        setIsListLoading(false);
      }
    };

    if (page && limit) {
      fetchOrders();
    }
  }, [page, limit, status, getAllOrderList]);

  // Function to fetch a single order by ID using the store action
  const fetchOrderById = async (orderId: string) => {
    setIsDetailLoading(true);
    setDetailError(null);
    try {
      await getOrderByIdFromStore(orderId); // Call store action
      // selectedOrder in the store will be updated by the action itself
    } catch (err) {
      // Type assertion for error handling
      if (err instanceof Error) {
        setDetailError(err);
      } else {
        // Keep error message concise to avoid linting issues with long lines
        setDetailError(new Error("Failed to fetch order details."));
      }
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Construct the meta object explicitly with IMeta type
  const constructedMeta: IMeta = {
    page: orderParams.page,
    limit: orderParams.limit,
    totalPages: orderParams.totalPages, // Sourced from orderParams
    total: orderParams.total, // Sourced from orderParams
  };

  return {
    data: {
      items: allOrderList || [],
      meta: constructedMeta, // Use the explicitly typed meta object
    },
    isListLoading,
    listError,
    orderDetail: selectedOrder, // Use selectedOrder from store directly
    isDetailLoading, // Local state for detail view loading
    detailError, // Local state for detail view error
    fetchOrderById, // Hook's function to trigger detail fetching
  };
};
