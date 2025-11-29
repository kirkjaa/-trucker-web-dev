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
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import { Icons } from "@/app/icons";
import { useOrderStore } from "@/app/store/ordersStore";
import { EComPathName, EOrderStatus } from "@/app/types/enum";
import type { Order } from "@/app/types/orderType";
import { formatISOToDate } from "@/app/utils/formatDate";
import {
  getStatusStyle,
  mapStatusToThaiCom,
} from "@/app/utils/formatOrderStatus";

const OrderTable = () => {
  const {
    companyOrdersList,
    getCompanyOrdersList,
    getCompanyOrdersParams,
    setCompanyOrdersParams,
  } = useOrderStore((state) => ({
    companyOrdersList: state.companyOrdersList,
    getCompanyOrdersList: state.getCompanyOrdersList,
    getCompanyOrdersParams: state.getCompanyOrdersParams,
    setCompanyOrdersParams: state.setCompanyOrdersParams,
  }));

  // Modal state
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [isEditPlateModalOpen, setIsEditPlateModalOpen] = useState(false);
  // const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  // const [selectedOrderForDriver, setSelectedOrderForDriver] = useState<
  //   string | null
  // >(null);
  const [orderId, setOrderId] = useState<string>("");

  // Hooks
  const pathName = usePathname();

  // Use Effect
  useEffect(() => {
    const fetchData = async () => {
      let status;

      switch (pathName) {
        case EComPathName.ORDERS_START_SHIP:
          status = EOrderStatus.START_SHIP;
          break;
        case EComPathName.ORDERS_SHIPPED:
          status = EOrderStatus.SHIPPED;
          break;
        default:
          status = EOrderStatus.PUBLISHED;
      }

      await getCompanyOrdersList({
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
      case EComPathName.ORDERS_START_SHIP:
        status = EOrderStatus.START_SHIP;
        break;
      case EComPathName.ORDERS_SHIPPED:
        status = EOrderStatus.SHIPPED;
        break;
      default:
        status = EOrderStatus.PUBLISHED;
    }

    const newSearchParams = {
      ...getCompanyOrdersParams(),
      page,
      limit: getCompanyOrdersParams().limit,
      status,
    };
    setCompanyOrdersParams(newSearchParams);
    getCompanyOrdersList(newSearchParams);
  };

  const setLimit = (limit: number) => {
    let status;

    switch (pathName) {
      case EComPathName.ORDERS_START_SHIP:
        status = EOrderStatus.START_SHIP;
        break;
      case EComPathName.ORDERS_SHIPPED:
        status = EOrderStatus.SHIPPED;
        break;
      default:
        status = EOrderStatus.PUBLISHED;
    }

    const newSearchParams = {
      ...getCompanyOrdersParams(),
      page: getCompanyOrdersParams().page,
      limit,
      status,
    };
    setCompanyOrdersParams(newSearchParams);
    getCompanyOrdersList(newSearchParams);
  };

  // Icon handling functions
  const handleClickViewIcon = (id: string) => {
    setOrderId(id);
    setIsModalDetailOpen(true);
  };

  // const handleOrderEditPlate = (id: string) => {
  //   setOrderId(id);
  //   setIsEditPlateModalOpen(true);
  // };

  const handleClickDriverIcon = (id: string) => {
    console.log(id);
    // setSelectedOrderForDriver(id);
    // setIsDriverModalOpen(true);
  };

  // const handleDriverSelect = (driverId: string) => {
  //   if (selectedOrderForDriver) {
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
          {companyOrdersList && companyOrdersList.length > 0 ? (
            companyOrdersList.map((row: Order) => (
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
                    • {mapStatusToThaiCom(row.orderStatus)}
                  </p>
                </TableCell>
                <TableCell className="w-[10%] flex gap-2">
                  {row.orderStatus === EOrderStatus.PUBLISHED && (
                    <Icons
                      name="SelectTruck"
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => handleClickDriverIcon(row.id)}
                    />
                  )}
                  <Icons
                    name="ShowPassword"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => handleClickViewIcon(row.id)}
                  />
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
          page: getCompanyOrdersParams().page,
          limit: getCompanyOrdersParams().limit,
          totalPages: getCompanyOrdersParams().totalPages,
          total: getCompanyOrdersParams().total,
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
    </div>
  );
};

export default OrderTable;
