"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";

import SelectTypeCreateRouteCodeModal from "./SelectTypeCreateRouteCodeModal";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Icons } from "@/app/icons";
import { useRouteStore } from "@/app/store/routeStore";
import { useUserStore } from "@/app/store/userStore";
import { EFacPathName, ERouteType } from "@/app/types/enum";

export default function SearchBar() {
  // Global State
  const { userMe } = useUserStore();
  const { getRouteFactoryList, getRouteFactorySearchParams } = useRouteStore();

  // Local State
  const [searchValue, setSearchValue] = useState<string>("");
  const [
    isSelectTypeCreateRouteCodeModalOpen,
    setIsSelectTypeCreateRouteCodeModalOpen,
  ] = useState<boolean>(false);

  // Hook
  const pathName = usePathname();

  // Function
  const handleClickSearch = async () => {
    await getRouteFactoryList({
      page: 1,
      limit: 10,
      byFactoryId: userMe?.factory?.id,
      byType:
        pathName === EFacPathName.DOMESTIC_ROUTE
          ? ERouteType.ONEWAY
          : ERouteType.ABROAD,
      search: searchValue,
    });
  };

  const handleClickClearSearch = async () => {
    await getRouteFactoryList({
      page: 1,
      limit: 10,
      byFactoryId: userMe?.factory?.id,
      byType:
        pathName === EFacPathName.DOMESTIC_ROUTE
          ? ERouteType.ONEWAY
          : ERouteType.ABROAD,
    });
    setSearchValue("");
  };

  return (
    <>
      <div className="flex justify-between items-center bg-neutral-01 px-5 py-4 rounded-xl">
        {/* Search Bar */}
        <div className="flex">
          <Input
            value={searchValue}
            className="h-11 02:w-80 w-96 rounded-l-[1.25rem] rounded-r-none border-r-0 border-neutral-04"
            placeholder="ค้นหารหัสเส้นทางโรงงาน"
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <Button className="rounded-l-none" onClick={handleClickSearch}>
            <Icons name="Search" className="w-6 h-6" />
          </Button>
        </div>

        {/* Button */}
        <div className="flex items-center gap-4">
          <p>ผลลัพธ์ {getRouteFactorySearchParams().total} รายการ</p>

          <Button variant="filter" onClick={handleClickClearSearch}>
            <Icons name="Filter" className="w-6 h-6" />
            <p>แสดงทั้งหมด</p>
          </Button>

          <Button onClick={() => setIsSelectTypeCreateRouteCodeModalOpen(true)}>
            <Icons name="Plus" className="w-6 h-6" />
            <p>
              {pathName === EFacPathName.DOMESTIC_ROUTE
                ? "เพิ่มรหัสเส้นทางในประเทศ"
                : "เพิ่มรหัสเส้นทางต่างประเทศ"}
            </p>
          </Button>
        </div>
      </div>

      {/* Create Route Code Modal */}
      <SelectTypeCreateRouteCodeModal
        isSelectTypeCreateRouteCodeModalOpen={
          isSelectTypeCreateRouteCodeModalOpen
        }
        setIsSelectTypeCreateRouteCodeModalOpen={
          setIsSelectTypeCreateRouteCodeModalOpen
        }
      />
    </>
  );
}
