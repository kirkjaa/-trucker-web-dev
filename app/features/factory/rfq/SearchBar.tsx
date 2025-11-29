"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { usePathname } from "next/navigation";

import CardCreateRfqModal, {
  cardModalDetails,
} from "./list-of-rfq/components/createRfq/components/CardCreateRfqModal";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Icons } from "@/app/icons";
import { useGlobalStore } from "@/app/store/globalStore";
import { useQuotationStore } from "@/app/store/quotation/quotationStore";
import { useRfqStore } from "@/app/store/rfq/rfqStore";
import { EFacPathName } from "@/app/types/enum";
import { EQuotationStatus } from "@/app/types/quotation/quotationEnum";
import { cn } from "@/lib/utils";

export default function SearchBar() {
  // Global State
  const setCurrentStep = useGlobalStore((state) => state.setCurrentStep);
  const { getQuotationsByStatus, getQuotationParams } = useQuotationStore(
    (state) => ({
      getQuotationsByStatus: state.getQuotationsByStatus,
      getQuotationParams: state.getQuotationParams,
    })
  );
  const { getRfqs, getRfqParams } = useRfqStore((state) => ({
    getRfqs: state.getRfqs,
    getRfqParams: state.getRfqParams,
  }));

  // Local State
  const [searchValue, setSearchValue] = useState<string>("");
  const [isCreateQuotationModalOpen, setIsCreateQuotationModalOpen] =
    useState<boolean>(false);

  // Hook
  const pathName = usePathname();
  const isFirstRun = useRef(true);
  const debouncedSearch = useCallback(
    debounce(() => {
      switch (pathName) {
        case EFacPathName.QUOPENDING:
          getQuotationsByStatus({
            page: 1,
            limit: getQuotationParams().limit,
            status: EQuotationStatus.PENDING,
            search: searchValue,
          });
          break;
        case EFacPathName.QUOAPPROVED:
          getQuotationsByStatus({
            page: 1,
            limit: getQuotationParams().limit,
            status: EQuotationStatus.SUCCESS,
            search: searchValue,
          });
          break;
        case EFacPathName.QUOEXPIRED:
          getQuotationsByStatus({
            page: 1,
            limit: getQuotationParams().limit,
            status: EQuotationStatus.EXPIRED,
            search: searchValue,
          });
          break;
        case EFacPathName.RFQLIST:
          getRfqs({
            page: 1,
            limit: getRfqParams().limit,
            search: searchValue,
          });
          break;
      }
    }, 300),
    [searchValue]
  );

  // Use Effect
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    /* if (search.length === 0) return; */

    debouncedSearch();
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchValue]);

  useEffect(() => {
    setCurrentStep(1);
  }, []);

  // Function
  const handleClickCreateQuotation = () => {
    setIsCreateQuotationModalOpen(true);
  };

  // const handleCheckedChange = (checked: boolean, name: string) => {
  //   if (checked) {
  //     setNameFilter((prevFilters) => [...prevFilters, name]);
  //   } else {
  //     setNameFilter((prevFilters) =>
  //       prevFilters.filter((filter) => filter !== name)
  //     );
  //   }
  // };

  // const handleClickSearch = async () => {
  //   if (pathName === EFacPathName.QUOPENDING) {
  //     await getAllQuotationList({
  //       page: getQuotationSearchParams().page,
  //       limit: getQuotationSearchParams().limit,
  //       status: EQuotationStatus.PENDING,
  //       name: nameFilter,
  //       value: searchValue,
  //     });
  //   } else if (pathName === EFacPathName.QUOAPPROVED) {
  //     await getAllQuotationList({
  //       page: getQuotationSearchParams().page,
  //       limit: getQuotationSearchParams().limit,
  //       status: EQuotationStatus.APPROVED,
  //       name: nameFilter,
  //       value: searchValue,
  //     });
  //   } else if (pathName === EFacPathName.QUOEXPIRED) {
  //     await getAllQuotationList({
  //       page: getQuotationSearchParams().page,
  //       limit: getQuotationSearchParams().limit,
  //       status: EQuotationStatus.EXPIRED,
  //       name: nameFilter,
  //       value: searchValue,
  //     });
  //   } else if (pathName === EFacPathName.RFQLIST) {
  //     await getRfqs({
  //       page: getRfqParams().page,
  //       limit: getRfqParams().limit,
  //     });
  //   }
  // };

  const handleClickClearSearch = async () => {
    switch (pathName) {
      case EFacPathName.QUOPENDING:
        getQuotationsByStatus({
          page: 1,
          limit: getQuotationParams().limit,
          status: EQuotationStatus.PENDING,
        });
        break;
      case EFacPathName.QUOAPPROVED:
        getQuotationsByStatus({
          page: 1,
          limit: getQuotationParams().limit,
          status: EQuotationStatus.SUCCESS,
        });
        break;
      case EFacPathName.QUOEXPIRED:
        getQuotationsByStatus({
          page: 1,
          limit: getQuotationParams().limit,
          status: EQuotationStatus.EXPIRED,
        });
        break;
      case EFacPathName.RFQLIST:
        getRfqs({
          page: 1,
          limit: getRfqParams().limit,
        });
        break;
    }

    setSearchValue("");
  };

  return (
    <>
      <div className="flex justify-between items-center bg-neutral-01 px-5 py-4 rounded-xl">
        {/* Search Bar */}
        {/* <div className="flex"> */}
        {/* <DropdownMenu> */}
        {/*   <DropdownMenuTrigger asChild> */}
        {/*     <Button variant="dropdownMenu"> */}
        {/*       <p>ทุกหมวดหมู่</p> */}
        {/*       <Icons name="ChevronDown" className="w-6 h-6" /> */}
        {/*     </Button> */}
        {/*   </DropdownMenuTrigger> */}
        {/*   <DropdownMenuContent className="w-80"> */}
        {/*     <DropdownMenuLabel className="flex justify-between items-center"> */}
        {/*       <p className="button">ตัวกรอง</p> */}
        {/*       <Button */}
        {/*         variant="ghost" */}
        {/*         className="text-primary-blue-main" */}
        {/*         onClick={() => { */}
        {/*           setNameFilter([]); */}
        {/*         }} */}
        {/*       > */}
        {/*         ล้างทั้งหมด */}
        {/*       </Button> */}
        {/*     </DropdownMenuLabel> */}
        {/*     <DropdownMenuSeparator /> */}
        {/*     <DropdownMenuCheckboxItem */}
        {/*       checked={nameFilter.includes("quotationId")} */}
        {/*       onCheckedChange={(checked) => { */}
        {/*         handleCheckedChange(checked, "quotationId"); */}
        {/*       }} */}
        {/*     > */}
        {/*       <p className="body2">รหัส</p> */}
        {/*     </DropdownMenuCheckboxItem> */}
        {/*     {/* <DropdownMenuCheckboxItem */}
        {/*       checked={nameFilter.includes("items")} */}
        {/*       onCheckedChange={(checked) => { */}
        {/*         handleCheckedChange(checked, "items"); */}
        {/*       }} */}
        {/*     > */}
        {/*       <p className="body2">สินค้า</p> */}
        {/*     </DropdownMenuCheckboxItem> */}
        {/*     <DropdownMenuCheckboxItem */}
        {/*       checked={nameFilter.includes("startRoutes")} */}
        {/*       onCheckedChange={(checked) => { */}
        {/*         handleCheckedChange(checked, "startRoutes"); */}
        {/*       }} */}
        {/*     > */}
        {/*       <p className="body2">สถานที่ต้นทาง</p> */}
        {/*     </DropdownMenuCheckboxItem> */}
        {/*     <DropdownMenuCheckboxItem */}
        {/*       checked={nameFilter.includes("endRoutes")} */}
        {/*       onCheckedChange={(checked) => { */}
        {/*         handleCheckedChange(checked, "endRoutes"); */}
        {/*       }} */}
        {/*     > */}
        {/*       <p className="body2">สถานที่ปลายทาง</p> */}
        {/*     </DropdownMenuCheckboxItem> */}
        {/*   </DropdownMenuContent> */}
        {/* </DropdownMenu> */}

        <Input
          value={searchValue}
          className="h-11 02:w-80 w-96 rounded-3xl border-neutral-04"
          placeholder="ค้นหา"
          onChange={(e) => setSearchValue(e.target.value)}
        />

        {/* <Button className="rounded-l-none" onClick={handleClickSearch}> */}
        {/*   <Icons name="Search" className="w-6 h-6" /> */}
        {/* </Button> */}
        {/* </div> */}

        {/* Button */}
        <div className="flex items-center gap-4">
          <p>
            ผลลัพธ์{" "}
            {pathName === EFacPathName.RFQLIST
              ? getRfqParams().total
              : getQuotationParams().total}{" "}
            รายการ
          </p>

          <div className="ml-auto">
            <Button variant="filter" onClick={handleClickClearSearch}>
              <Icons name="Filter" className="w-6 h-6" />
              <p>
                แสดงทั้งหมด
                {/* ({nameFilter.length}) */}
              </p>
            </Button>
          </div>

          {/* {bidIds.length > 1 && ( */}
          {/*   <> */}
          {/*     <Button variant="delete" onClick={handleClickClearSearch}> */}
          {/*       <Icons name="Bin" className="w-6 h-6" /> */}
          {/*       <p>ลบ {bidIds.length} รายการที่เลือก</p> */}
          {/*     </Button> */}
          {/*     <Button onClick={handleClickClearSearch}> */}
          {/*       <Icons name="DocumentLight" className="w-6 h-6" /> */}
          {/*       <p>ดู {bidIds.length} รายการที่เลือก</p> */}
          {/*     </Button> */}
          {/*   </> */}
          {/* )} */}

          {pathName.startsWith("/factory/list-of-rfq") && (
            <Button onClick={handleClickCreateQuotation}>
              <Icons name="Plus" className="w-6 h-6" />
              <p>เพิ่มใบเสนอราคา</p>
            </Button>
          )}
        </div>
      </div>

      {/* Create Quotation Modal */}
      <Dialog
        open={isCreateQuotationModalOpen}
        onOpenChange={setIsCreateQuotationModalOpen}
      >
        <DialogContent
          className={cn("max-w-[60rem] bg-white/80", {
            "max-w-[40rem]": cardModalDetails.length !== 3,
          })}
          outlineCloseButton
        >
          <DialogHeader>
            <DialogTitle>
              <p className="text-lg font-bold">เพิ่มใบเสนอราคา</p>
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <CardCreateRfqModal />
        </DialogContent>
      </Dialog>
    </>
  );
}
