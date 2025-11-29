"use client";

import React, { useEffect } from "react";

import useSearchBar from "../hooks/useSearchBar";

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
import ModalNotification from "@/app/components/ui/ModalNotification";
import { Icons } from "@/app/icons";
import {
  EComPathName,
  EFacPathName,
  ESearchKey,
  searchKeyLabels,
} from "@/app/types/enum";

export default function SearchBar() {
  const {
    handleClickCreate,
    setDataCount,
    getTruckParams,
    pathName,
    dataCount,
    setTextBtnPlus,
    textBtnPlus,
    optionSearch,
    setOptionSearch,
    getOptionSearchTruck,
    handleCheckSearchKey,
    searchKey,
    setSearchKey,
    setSearch,
    handleClickSearch,
    getSelectedListId,
    onClickDeleteList,
    openModalDeleteList,
    setOpenModalDeleteList,
    selectedListId,
    handleClickConfirmDelete,
    visibleBtnPlus,
    setVisibleBtnPlus,
    getUsersPositionParams,
    getOptionSearchUsersPosition,
    getUsersParams,
    getQuotationSearchParams,
    getOptionSearchContractCompany,
    getOptionSearchUsers,
    getRoutePriceEntryParams,
    iconBtnPlus,
    setIconBtnPlus,
    handleClickClearSearch,
    setSelectedListId,
    setSelectedTruck,
    setSelectedUsers,
    setSelectedUsersPosition,
  } = useSearchBar();

  useEffect(() => {
    switch (true) {
      case pathName === EFacPathName.TRUCK ||
        pathName === EComPathName.TRUCK ||
        pathName === EComPathName.RENTALTRUCK:
        setDataCount(getTruckParams().total || 0);
        setTextBtnPlus(
          pathName === EComPathName.RENTALTRUCK
            ? "เพิ่มการเช่ารถ"
            : "เพิ่มรถบรรทุก"
        );
        setOptionSearch(getOptionSearchTruck());
        setSearchKey(getOptionSearchTruck());
        break;
      case pathName === EComPathName.PRICEENTRYABROAD ||
        pathName === EComPathName.PRICEENTRYDOMESTIC:
        setVisibleBtnPlus(false);
        setDataCount(getRoutePriceEntryParams().total || 0);
        break;
      case pathName === EComPathName.USERSPOSITION ||
        pathName === EFacPathName.USERSPOSITION:
        setTextBtnPlus("เพิ่มตำแหน่งงาน");
        setDataCount(getUsersPositionParams().total || 0);
        setOptionSearch(getOptionSearchUsersPosition());
        setSearchKey(getOptionSearchUsersPosition());
        break;
      case pathName === EComPathName.USERS ||
        pathName === EFacPathName.USERS ||
        pathName === EComPathName.USERSDRIVER:
        setTextBtnPlus("เพิ่มผู้ใช้งาน");
        setDataCount(getUsersParams().total || 0);
        setSearchKey(getOptionSearchUsers());
        setOptionSearch(getOptionSearchUsers());
        break;
      case pathName === EFacPathName.SHIPPINGCOMPANY:
        setDataCount(getQuotationSearchParams().total || 0);
        setOptionSearch(getOptionSearchContractCompany());
        setSearchKey(getOptionSearchContractCompany());
        setVisibleBtnPlus(false);
        break;
      case pathName === EComPathName.DISBURSEMENTEMPLOYEE ||
        pathName === EComPathName.DISBURSEMENTFACTORY ||
        pathName === EComPathName.DISBURSEMENTFREELANCE ||
        pathName === EFacPathName.DISBURSEMENTEMPLOYEE ||
        pathName === EFacPathName.DISBURSEMENTTRANSPORTATION:
        setTextBtnPlus("ดาวน์โหลดแบบกำหนดวัน");
        setIconBtnPlus("Calendar");
        break;

      default:
        break;
    }
    setSelectedListId([]);
    setSelectedTruck([]);
    setSelectedUsers([]);
    setSelectedUsersPosition([]);
  }, [
    pathName,
    getTruckParams(),
    getUsersPositionParams(),
    getQuotationSearchParams(),
    getUsersParams(),
  ]);

  return (
    <React.Fragment>
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
                    // setNameFilter([]);
                  }}
                >
                  ล้างทั้งหมด
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {optionSearch.map((item) => (
                <React.Fragment key={item}>
                  <DropdownMenuCheckboxItem
                    checked={searchKey.findIndex((key) => key === item) !== -1}
                    onCheckedChange={() => handleCheckSearchKey(item)}
                  >
                    <p className="body2">
                      {searchKeyLabels[item as ESearchKey]}
                    </p>
                  </DropdownMenuCheckboxItem>
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            // value={searchValue}
            className="h-11 02:w-80 w-96 rounded-none border-x-0 border-neutral-04"
            placeholder="ค้นหา"
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            className="rounded-l-none"
            onClick={() => handleClickSearch()}
          >
            <Icons name="Search" className="w-6 h-6" />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <p>ผลลัพธ์ {dataCount} รายการ</p>

          <Button variant="filter" onClick={handleClickClearSearch}>
            <Icons name="Filter" className="w-6 h-6" />
            <p>แสดงทั้งหมด ({dataCount})</p>
          </Button>

          {getSelectedListId().length > 0 && (
            <Button onClick={onClickDeleteList} className="bg-red-500">
              <Icons name="Bin" className="w-6 h-6" />
              <p>ลบ {getSelectedListId().length} รายการที่เลือก</p>
            </Button>
          )}
          {visibleBtnPlus && (
            <Button onClick={handleClickCreate}>
              <Icons name={iconBtnPlus} className="w-6 h-6" />
              <p>{textBtnPlus}</p>
            </Button>
          )}
        </div>
      </div>
      <ModalNotification
        open={openModalDeleteList}
        setOpen={setOpenModalDeleteList}
        title="ยืนยันการลบบริษัท"
        description={`คุณต้องการลบบริษัท #${selectedListId.map((item) => item.name).join(", ")} หรือไม่?`}
        description2="เมื่อลบจะไม่สามารถกู้คืนได้และข้อมูลทั้งหมดจะถูกลบอย่างถาวร"
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        isDelete
        icon={<Icons name="DialogDelete" className="w-16 h-16" />}
        onConfirm={() => {
          handleClickConfirmDelete(selectedListId.map((item) => item.id));
        }}
      />
    </React.Fragment>
  );
}
