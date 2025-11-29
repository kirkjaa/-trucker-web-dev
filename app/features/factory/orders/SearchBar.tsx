"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { CreateOrderModal } from "./components/CreateOrder/CreateOrderModal";

import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Input } from "@/app/components/ui/input";
import { Icons } from "@/app/icons";
import { useGlobalStore } from "@/app/store/globalStore";
import { useOrderStore } from "@/app/store/ordersStore";
import { EFacPathName } from "@/app/types/enum";

export default function SearchBar() {
  // Global State
  const { setCurrentStep } = useGlobalStore();
  const { getAllOrderList, getOrderSearchParams, orderParams } =
    useOrderStore();

  // Local State
  const [nameFilter, setNameFilter] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);

  // Hooks
  const pathName = usePathname();

  // Use Effect
  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  const handleCheckedChange = (checked: boolean, name: string) => {
    if (checked) {
      setNameFilter((prevFilters) => [...prevFilters, name]);
    } else {
      setNameFilter((prevFilters) =>
        prevFilters.filter((filter) => filter !== name)
      );
    }
  };

  const handleClickSearch = async () => {
    await getAllOrderList({
      page: getOrderSearchParams().page,
      limit: getOrderSearchParams().limit,
      name: nameFilter,
      value: searchValue,
      // status:
      //   pathName === EFacPathName.ORDERS_PUBLISHED
      //     ? OrderStatus.Published
      //     : pathName === EFacPathName.ORDERS_PENDING
      //       ? OrderStatus.Pending
      //       : OrderStatus.Completed,
    });
  };

  const handleClickClearSearch = async () => {
    await getAllOrderList({
      page: getOrderSearchParams().page,
      limit: getOrderSearchParams().limit,
      // status:
      //   pathName === EFacPathName.ORDERS_PUBLISHED
      //     ? OrderStatus.Published
      //     : pathName === EFacPathName.ORDERS_PENDING
      //       ? OrderStatus.Pending
      //       : OrderStatus.Completed,
    });
    setNameFilter([]);
    setSearchValue("");
  };

  return (
    <>
      <div className="flex justify-between items-center bg-neutral-01 px-5 py-4 rounded-xl">
        {/* Search Bar */}
        <div className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="dropdownMenu">
                <p>ทุกหมวดหมู่</p>
                <Icons name="ChevronDown" className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80">
              <DropdownMenuLabel className="flex justify-between items-center">
                <p className="button">ตัวกรอง</p>
                <Button
                  variant="ghost"
                  className="text-primary-blue-main"
                  onClick={() => {
                    setNameFilter([]);
                  }}
                >
                  ล้างทั้งหมด
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={nameFilter.includes("orderId")}
                onCheckedChange={(checked) => {
                  handleCheckedChange(checked, "orderId");
                }}
              >
                <p className="body2">รหัสออเดอร์</p>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={nameFilter.includes("product")}
                onCheckedChange={(checked) => {
                  handleCheckedChange(checked, "product");
                }}
              >
                <p className="body2">สินค้า</p>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={nameFilter.includes("origin")}
                onCheckedChange={(checked) => {
                  handleCheckedChange(checked, "origin");
                }}
              >
                <p className="body2">สถานที่ต้นทาง</p>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={nameFilter.includes("destination")}
                onCheckedChange={(checked) => {
                  handleCheckedChange(checked, "destination");
                }}
              >
                <p className="body2">สถานที่ปลายทาง</p>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={nameFilter.includes("customerName")}
                onCheckedChange={(checked) => {
                  handleCheckedChange(checked, "customerName");
                }}
              >
                <p className="body2">ชื่อลูกค้า</p>
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            value={searchValue}
            className="h-11 02:w-80 w-96 rounded-none border-x-0 border-neutral-04"
            placeholder="ค้นหา"
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <Button className="rounded-l-none" onClick={handleClickSearch}>
            <Icons name="Search" className="w-6 h-6" />
          </Button>
        </div>

        {/* Button */}
        <div className="flex items-center gap-4">
          <p>ผลลัพธ์ {orderParams.total} รายการ</p>

          <Button variant="filter" onClick={handleClickClearSearch}>
            <Icons name="Filter" className="w-6 h-6" />
            <p>แสดงทั้งหมด ({nameFilter.length})</p>
          </Button>

          {pathName === EFacPathName.ORDERS_PUBLISHED && (
            <Button onClick={() => setIsCreateOrderModalOpen(true)}>
              <Icons name="Plus" className="w-5 h-5" />
              เพิ่มรายการขนส่ง
            </Button>
          )}
        </div>
      </div>

      {/* Create Order Modal */}
      <CreateOrderModal
        isCreateOrderModalOpen={isCreateOrderModalOpen}
        setIsCreateOrderModalOpen={setIsCreateOrderModalOpen}
      />
    </>
  );
}
