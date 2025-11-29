"use client";

import { useEffect, useState } from "react";
import React from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";

import EditPlateModal from "./OrderModalDetail/EditPlateModal";
import ModalOrderDetailById from "./OrderModalDetail/ModalOrderDetailById";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHead,
} from "@/app/components/ui/data-table";
import ModalNotification from "@/app/components/ui/ModalNotification";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import { Icons } from "@/app/icons";
import { ordersApi } from "@/app/services/ordersApi";
import { useOrderStore } from "@/app/store/ordersStore";
import { EFacPathName, EOrderStatus } from "@/app/types/enum";
import type { Order } from "@/app/types/orderType";
import { formatISOToDate } from "@/app/utils/formatDate";
import {
  getStatusStyle,
  mapStatusToThaiFac,
} from "@/app/utils/formatOrderStatus";

const OrderTable = () => {
  const {
    allOrderList,
    getAllOrderList,
    getOrderSearchParams,
    setOrderSearchParams,
  } = useOrderStore((state) => ({
    allOrderList: state.allOrderList,
    getAllOrderList: state.getAllOrderList,
    getOrderSearchParams: state.getOrderSearchParams,
    setOrderSearchParams: state.setOrderSearchParams,
  }));

  // Modal state
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isEditPlateModalOpen, setIsEditPlateModalOpen] = useState(false);
  // const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  // const [selectedOrderForDriver, setSelectedOrderForDriver] = useState<
  //   string | null
  // >(null);
  const [orderId, setOrderId] = useState<string>("");
  const [orderCode, setOrderCode] = useState("");

  // const {
  //   data = {
  //     items: [] as Order[],
  //     meta: { page: 1, limit: 10, totalPages: 1, total: 0 },
  //   },
  //   isListLoading,
  // } = useOrderList({
  //   page: currentPage,
  //   limit: 10,
  //   status: EOrderStatus.PUBLISHED,
  // });

  // Hooks
  const pathName = usePathname();

  // Use Effect
  useEffect(() => {
    const fetchData = async () => {
      let status;

      switch (pathName) {
        // case EFacPathName.ORDERS_PUBLISHED:
        //   status = EOrderStatus.PUBLISHED;
        //   break;
        case EFacPathName.ORDERS_MATCHED:
          status = EOrderStatus.MATCHED;
          break;
        case EFacPathName.ORDERS_START_SHIP:
          status = EOrderStatus.START_SHIP;
          break;
        case EFacPathName.ORDERS_SHIPPED:
          status = EOrderStatus.SHIPPED;
          break;
        case EFacPathName.ORDERS_COMPLETED:
          status = EOrderStatus.COMPLETED;
          break;
        default:
          status = EOrderStatus.PUBLISHED;
      }

      await getAllOrderList({
        page: 1,
        limit: 10,
        status,
      });
    };

    fetchData();
  }, []);

  // const handleSort = (key: string) => {
  //   let direction = "ascending";
  //   if (sortConfig.key === key && sortConfig.direction === "ascending") {
  //     direction = "descending";
  //   }
  //   setSortConfig({ key, direction });
  // };

  const setPage = (page: number) => {
    let status;

    switch (pathName) {
      case EFacPathName.ORDERS_MATCHED:
        status = EOrderStatus.MATCHED;
        break;
      case EFacPathName.ORDERS_START_SHIP:
        status = EOrderStatus.START_SHIP;
        break;
      case EFacPathName.ORDERS_SHIPPED:
        status = EOrderStatus.SHIPPED;
        break;
      case EFacPathName.ORDERS_COMPLETED:
        status = EOrderStatus.COMPLETED;
        break;
      default:
        status = EOrderStatus.PUBLISHED;
    }

    const newSearchParams = {
      ...getOrderSearchParams(),
      page,
      limit: getOrderSearchParams().limit,
      status,
    };
    setOrderSearchParams(newSearchParams);
    getAllOrderList(newSearchParams);
  };

  const setLimit = (limit: number) => {
    let status;

    switch (pathName) {
      case EFacPathName.ORDERS_MATCHED:
        status = EOrderStatus.MATCHED;
        break;
      case EFacPathName.ORDERS_START_SHIP:
        status = EOrderStatus.START_SHIP;
        break;
      case EFacPathName.ORDERS_SHIPPED:
        status = EOrderStatus.SHIPPED;
        break;
      case EFacPathName.ORDERS_COMPLETED:
        status = EOrderStatus.COMPLETED;
        break;
      default:
        status = EOrderStatus.PUBLISHED;
    }

    const newSearchParams = {
      ...getOrderSearchParams(),
      page: getOrderSearchParams().page,
      limit,
      status,
    };
    setOrderSearchParams(newSearchParams);
    getAllOrderList(newSearchParams);
  };

  // Icon handling functions
  const handleClickViewIcon = (id: string) => {
    setOrderId(id);
    setIsModalDetailOpen(true);
  };

  const handleClickBinIcon = (id: string, displayCode: string) => {
    setOrderId(id);
    setOrderCode(displayCode);
    setIsModalDeleteOpen(true);
  };

  const handledClickConfirmDeleteOrder = async (id: string) => {
    console.log(
      `[PostJobTable] handledClickConfirmDeleteOrder triggered for ID: ${id}`
    );
    if (id) {
      try {
        const response = await ordersApi.deleteOrdersByIds([id]);
        console.log(
          `[PostJobTable] Order with ID: ${id} deleted successfully. Response:`,
          response
        );
        const currentParams = getOrderSearchParams();
        await getAllOrderList(currentParams);
      } catch (error) {
        console.error(
          `[PostJobTable] Error deleting order with ID ${id}:`,
          error
        );
      }
      setIsModalDeleteOpen(false);
    } else {
      setIsModalDeleteOpen(false);
    }
  };

  const handleOrderEditPlate = (id: string) => {
    setOrderId(id);
    setIsEditPlateModalOpen(true);
  };

  const handleClickDriverIcon = (id: string) => {
    console.log(id);
    // setSelectedOrderForDriver(id);
    // setIsDriverModalOpen(true);
  };

  // const handleDriverSelect = (driverId: string) => {
  //   if (selectedOrderForDriver) {
  //     console.log(
  //       `Assigning driver ${driverId} to order ${selectedOrderForDriver}`
  //     );
  //     setIsDriverModalOpen(false);
  //   }
  // };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Table>
        <TableHeader>
          <TableRowHead>
            <TableHead className="w-[12%] flex items-center gap-1 text-sm">
              รหัสออเดอร์
              {/* <Icons
                name="Swap"
                className={clsx("w-4 h-4 cursor-pointer")}
                onClick={() => handleSort("displayCode")}
              /> */}
            </TableHead>
            <TableHead className="w-[10%] flex items-center gap-1 text-sm">
              วันที่
            </TableHead>
            <TableHead className="w-[10%] flex items-center gap-1 text-sm">
              ประเภทรถ
            </TableHead>
            <TableHead className="w-[20%] flex items-center gap-1 text-sm">
              โรงงาน
            </TableHead>
            <TableHead className="w-[10%] flex items-center gap-1 text-sm">
              สินค้า
            </TableHead>
            <TableHead className="w-[13%] flex items-center gap-1 text-sm">
              ต้นทาง
            </TableHead>
            <TableHead className="w-[13%] flex items-center gap-1 text-sm">
              ปลายทาง
            </TableHead>
            <TableHead className="w-[12%] flex items-center gap-1 text-sm">
              ระยะทาง
              {/* <Icons
                name="Swap"
                className={clsx("w-4 h-4 cursor-pointer")}
                onClick={() => handleSort("distance")}
              /> */}
            </TableHead>
            <TableHead className="w-[12%] flex items-center gap-1 text-sm">
              ราคาน้ำมัน
            </TableHead>
            <TableHead className="w-[10%] flex items-center gap-1 text-sm">
              รายได้
              {/* <Icons
                name="Swap"
                className={clsx("w-4 h-4 cursor-pointer")}
                onClick={() => handleSort("price")}
              /> */}
            </TableHead>
            <TableHead className="w-[14%] flex items-center gap-1 text-sm">
              สถานะ
            </TableHead>
            <TableHead className="w-[10%]">{/* Actions */}</TableHead>
          </TableRowHead>
        </TableHeader>
        <TableBody>
          {allOrderList && allOrderList.length > 0 ? (
            allOrderList.map((row: Order) => (
              <TableRow key={row.id}>
                <TableCell className="w-[12%] text-sm">
                  {row.displayCode || "-"}
                </TableCell>
                <TableCell className="w-[10%] text-sm">
                  {row.createdAt &&
                    formatISOToDate.toShortFormat(row.createdAt)}
                </TableCell>
                <TableCell className="w-[10%] text-sm">
                  {row.masterRouteType || "-"}
                </TableCell>
                <TableCell className="w-[20%] text-sm">
                  {row.factoryName || "-"}
                </TableCell>
                <TableCell className="w-[10%] text-sm">
                  {row.items || "-"}
                </TableCell>
                <TableCell className="w-[13%] text-sm">
                  {row.startDestination || "-"}
                </TableCell>
                <TableCell className="w-[13%] text-sm">
                  {row.destination || "-"}
                </TableCell>
                <TableCell className="w-[12%] text-sm">
                  {row.distance ? `${row.distance} km` : "-"}
                </TableCell>
                <TableCell className="w-[12%] text-sm">
                  {row.fuelCost || "-"}
                </TableCell>
                <TableCell className="w-[10%] text-sm">
                  {row.price || "0"}
                </TableCell>
                <TableCell className="w-[14%] text-sm">
                  <p
                    className={`px-2 py-1 w-fit rounded-3xl ${getStatusStyle(row.orderStatus)}`}
                  >
                    • {mapStatusToThaiFac(row.orderStatus)}
                  </p>
                </TableCell>
                <TableCell className="w-[10%] flex gap-1">
                  <Icons
                    name="ShowPassword"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => handleClickViewIcon(row.id)}
                  />
                  {row.orderStatus === EOrderStatus.PUBLISHED && (
                    <>
                      <Icons
                        name="OrderEditPlate"
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => handleOrderEditPlate(row.id)}
                      />
                      <Icons
                        name="Document"
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => handleClickDriverIcon(row.id)}
                      />
                    </>
                  )}
                  {(row.orderStatus === EOrderStatus.PUBLISHED ||
                    row.orderStatus === EOrderStatus.MATCHED) && (
                    <Icons
                      name="Bin"
                      className="w-5 h-5 cursor-pointer text-urgent-fail-01"
                      onClick={() =>
                        handleClickBinIcon(row.id, row.displayCode)
                      }
                    />
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:border-none flex justify-center items-center">
              <TableCell
                colSpan={12}
                className={clsx("py-40 font-semibold text-secondary-200")}
              >
                <h4 className="h-10">ไม่พบข้อมูล</h4>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ControlledPaginate
        configPagination={{
          page: getOrderSearchParams().page,
          limit: getOrderSearchParams().limit,
          totalPages: getOrderSearchParams().totalPages,
          total: getOrderSearchParams().total,
        }}
        setPage={setPage}
        setLimit={setLimit}
        className="bg-white rounded-lg p-4 shadow-table"
      />

      {/* Modals */}
      <ModalOrderDetailById
        isModalDetailOpen={isModalDetailOpen}
        setIsModalDetailOpen={setIsModalDetailOpen}
        orderId={orderId}
      />

      <EditPlateModal
        isEditPlateModalOpen={isEditPlateModalOpen}
        setIsEditPlateModalOpen={setIsEditPlateModalOpen}
        orderId={orderId}
      />

      {/* <DriverSelectionModal
        isOpen={isDriverModalOpen}
        orderId={selectedOrderForDriver}
        onClose={() => setIsDriverModalOpen(false)}
        onSelect={handleDriverSelect}
      /> */}

      <ModalNotification
        open={isModalDeleteOpen}
        setOpen={setIsModalDeleteOpen}
        title="ลบออเดอร์"
        description={`คุณต้องการที่จะลบออเดอร์หมายเลข ${orderCode} ใช่หรือไม่?`}
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        isDelete={true}
        onConfirm={() => handledClickConfirmDeleteOrder(orderId)}
        onCancel={() => setIsModalDeleteOpen(false)}
      />
    </div>
  );
};

export default OrderTable;
