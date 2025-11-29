import { useEffect, useState } from "react";

import { type orderStore, useOrderStore } from "../store/ordersStore";
import type { getAllParams, IMeta } from "../types/global";

interface UseCompanyOrdersListProps {
  page: number;
  limit: number;
  status?: string;
  name?: string[];
  value?: string;
}

export const useCompanyOrdersList = ({
  page,
  limit,
  status,
  name,
  value,
}: UseCompanyOrdersListProps) => {
  const {
    getCompanyOrdersList,
    companyOrdersList,
    companyOrdersParams,
    selectedOrder,
    getOrderById: getOrderByIdFromStore,
  } = useOrderStore((state: orderStore) => ({
    getCompanyOrdersList: state.getCompanyOrdersList,
    companyOrdersList: state.companyOrdersList,
    companyOrdersParams: state.companyOrdersParams,
    selectedOrder: state.selectedOrder,
    getOrderById: state.getOrderById,
  }));

  // States for list loading and error
  const [isListLoading, setIsListLoading] = useState(false);
  const [listError, setListError] = useState<Error | null>(null);

  // States for detail loading and error
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
          name,
          value,
        };
        await getCompanyOrdersList(params);
      } catch (error) {
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
  }, [page, limit, status, getCompanyOrdersList, name, value]);

  // Function to fetch a single order by ID
  const fetchOrderById = async (orderId: string) => {
    setIsDetailLoading(true);
    setDetailError(null);
    try {
      await getOrderByIdFromStore(orderId);
    } catch (err) {
      if (err instanceof Error) {
        setDetailError(err);
      } else {
        setDetailError(new Error("Failed to fetch order details."));
      }
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Construct the meta object
  const constructedMeta: IMeta = {
    page: companyOrdersParams.page,
    limit: companyOrdersParams.limit,
    totalPages: companyOrdersParams.totalPages,
    total: companyOrdersParams.total,
  };

  return {
    data: {
      items: companyOrdersList || [],
      meta: constructedMeta,
    },
    isListLoading,
    listError,
    orderDetail: selectedOrder,
    isDetailLoading,
    detailError,
    fetchOrderById,
  };
};
