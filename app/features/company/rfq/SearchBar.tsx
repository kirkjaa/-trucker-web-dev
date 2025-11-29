"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { usePathname } from "next/navigation";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Icons } from "@/app/icons";
import { useGlobalStore } from "@/app/store/globalStore";
import { useOfferStore } from "@/app/store/offer/offerStore";
import { useQuotationStore } from "@/app/store/quotation/quotationStore";
import { useRfqStore } from "@/app/store/rfq/rfqStore";
import { EComPathName } from "@/app/types/enum";
import { EOfferStatus } from "@/app/types/offer/offerEnum";
import { EQuotationStatus } from "@/app/types/quotation/quotationEnum";
import { ERfqSendTo } from "@/app/types/rfq/rfqEnum";

export default function SearchBar() {
  // Global State
  const setCurrentStep = useGlobalStore((state) => state.setCurrentStep);
  const { getQuotationsByStatus, getQuotationParams } = useQuotationStore(
    (state) => ({
      getQuotationsByStatus: state.getQuotationsByStatus,
      getQuotationParams: state.getQuotationParams,
    })
  );
  const { getRfqsReceived, getRfqParams } = useRfqStore((state) => ({
    getRfqsReceived: state.getRfqsReceived,
    getRfqParams: state.getRfqParams,
  }));
  const { getOfferByStatus, getOfferParams } = useOfferStore((state) => ({
    getOfferByStatus: state.getOfferByStatus,
    getOfferParams: state.getOfferParams,
  }));

  // Local State
  const [searchValue, setSearchValue] = useState<string>("");

  // Hook
  const pathName = usePathname();
  const isFirstRun = useRef(true);
  const debouncedSearch = useCallback(
    debounce(() => {
      switch (pathName) {
        case EComPathName.QUOPENDING:
          getQuotationsByStatus({
            page: 1,
            limit: getQuotationParams().limit,
            status: EQuotationStatus.PENDING,
            search: searchValue,
          });
          break;
        case EComPathName.QUOAPPROVED:
          getQuotationsByStatus({
            page: 1,
            limit: getQuotationParams().limit,
            status: EQuotationStatus.SUCCESS,
            search: searchValue,
          });
          break;
        case EComPathName.QUOEXPIRED:
          getQuotationsByStatus({
            page: 1,
            limit: getQuotationParams().limit,
            status: EQuotationStatus.EXPIRED,
            search: searchValue,
          });
          break;
        case EComPathName.QUOFAC:
          getRfqsReceived({
            page: 1,
            limit: getRfqParams().limit,
            type: ERfqSendTo.DIRECT,
            search: searchValue,
          });
          break;
        case EComPathName.QUOMAR:
          getRfqsReceived({
            page: 1,
            limit: getRfqParams().limit,
            type: ERfqSendTo.BOTH,
            search: searchValue,
          });
          break;
        case EComPathName.QUOFAC_OFFERED:
          getOfferByStatus({
            page: 1,
            limit: getOfferParams().limit,
            type: ERfqSendTo.DIRECT,
            status: EOfferStatus.OFFER,
            search: searchValue,
          });
          break;
        case EComPathName.QUOMAR_OFFERED:
          getOfferByStatus({
            page: 1,
            limit: getOfferParams().limit,
            type: ERfqSendTo.BOTH,
            status: EOfferStatus.OFFER,
            search: searchValue,
          });
          break;
        case EComPathName.QUOFAC_REJECTED:
          getOfferByStatus({
            page: 1,
            limit: getOfferParams().limit,
            type: ERfqSendTo.DIRECT,
            status: EOfferStatus.REJECTED,
            search: searchValue,
          });
          break;
        case EComPathName.QUOMAR_REJECTED:
          getOfferByStatus({
            page: 1,
            limit: getOfferParams().limit,
            type: ERfqSendTo.BOTH,
            status: EOfferStatus.REJECTED,
            search: searchValue,
          });
          break;
        case EComPathName.QUOFAC_CANCELED:
          getOfferByStatus({
            page: 1,
            limit: getOfferParams().limit,
            type: ERfqSendTo.DIRECT,
            status: EOfferStatus.CANCELED,
            search: searchValue,
          });
          break;
        case EComPathName.QUOMAR_CANCELED:
          getOfferByStatus({
            page: 1,
            limit: getOfferParams().limit,
            type: ERfqSendTo.BOTH,
            status: EOfferStatus.CANCELED,
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
  // const handleCheckedChange = (checked: boolean, name: string) => {
  //   if (checked) {
  //     setNameFilter((prevFilters) => [...prevFilters, name]);
  //   } else {
  //     setNameFilter((prevFilters) =>
  //       prevFilters.filter((filter) => filter !== name)
  //     );
  //   }
  // };

  //   const handleClickSearch = async () => {
  //     if (pathName === "/factory/rfq-progress") {
  //       await getAllQuotationList({
  //         page: getQuotationSearchParams().page,
  //         limit: getQuotationSearchParams().limit,
  //         status: EQuotationStatus.PUBLISHED,
  //         name: nameFilter,
  //         value: searchValue,
  //       });
  //     } else if (pathName === "/factory/quotation-expired") {
  //       await getAllQuotationList({
  //         page: getQuotationSearchParams().page,
  //         limit: getQuotationSearchParams().limit,
  //         status: EQuotationStatus.EXPIRED,
  //         name: nameFilter,
  //         value: searchValue,
  //       });
  //     } else {
  //       await getAllQuotationList({
  //         page: getQuotationSearchParams().page,
  //         limit: getQuotationSearchParams().limit,
  //         name: nameFilter,
  //         value: searchValue,
  //       });
  //     }
  //   };

  const handleClickClearSearch = async () => {
    switch (pathName) {
      case EComPathName.QUOPENDING:
        getQuotationsByStatus({
          page: 1,
          limit: getQuotationParams().limit,
          status: EQuotationStatus.PENDING,
        });
        break;
      case EComPathName.QUOAPPROVED:
        getQuotationsByStatus({
          page: 1,
          limit: getQuotationParams().limit,
          status: EQuotationStatus.SUCCESS,
        });
        break;
      case EComPathName.QUOEXPIRED:
        getQuotationsByStatus({
          page: 1,
          limit: getQuotationParams().limit,
          status: EQuotationStatus.EXPIRED,
        });
        break;
      case EComPathName.QUOFAC:
        getRfqsReceived({
          page: 1,
          limit: getRfqParams().limit,
          type: ERfqSendTo.DIRECT,
        });
        break;
      case EComPathName.QUOMAR:
        getRfqsReceived({
          page: 1,
          limit: getRfqParams().limit,
          type: ERfqSendTo.BOTH,
        });
        break;
      case EComPathName.QUOFAC_OFFERED:
        getOfferByStatus({
          page: 1,
          limit: getOfferParams().limit,
          type: ERfqSendTo.DIRECT,
          status: EOfferStatus.OFFER,
        });
        break;
      case EComPathName.QUOMAR_OFFERED:
        getOfferByStatus({
          page: 1,
          limit: getOfferParams().limit,
          type: ERfqSendTo.BOTH,
          status: EOfferStatus.OFFER,
        });
        break;
      case EComPathName.QUOFAC_REJECTED:
        getOfferByStatus({
          page: 1,
          limit: getOfferParams().limit,
          type: ERfqSendTo.DIRECT,
          status: EOfferStatus.REJECTED,
        });
        break;
      case EComPathName.QUOMAR_REJECTED:
        getOfferByStatus({
          page: 1,
          limit: getOfferParams().limit,
          type: ERfqSendTo.BOTH,
          status: EOfferStatus.REJECTED,
        });
        break;
      case EComPathName.QUOFAC_CANCELED:
        getOfferByStatus({
          page: 1,
          limit: getOfferParams().limit,
          type: ERfqSendTo.DIRECT,
          status: EOfferStatus.CANCELED,
        });
        break;
      case EComPathName.QUOMAR_CANCELED:
        getOfferByStatus({
          page: 1,
          limit: getOfferParams().limit,
          type: ERfqSendTo.BOTH,
          status: EOfferStatus.CANCELED,
        });
        break;
    }

    setSearchValue("");
  };

  return (
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
      {/*     <DropdownMenuCheckboxItem */}
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

      {/* <Button className="rounded-l-none"> */}
      {/*   <Icons name="Search" className="w-6 h-6" /> */}
      {/* </Button> */}
      {/* </div> */}

      {/* Button */}
      <div className="flex items-center gap-4">
        <p>
          ผลลัพธ์{" "}
          {pathName === EComPathName.QUOFAC || pathName === EComPathName.QUOMAR
            ? getRfqParams().total
            : pathName === EComPathName.QUOPENDING ||
                pathName === EComPathName.QUOAPPROVED ||
                pathName === EComPathName.QUOEXPIRED
              ? getQuotationParams().total
              : getOfferParams().total}{" "}
          รายการ
        </p>

        <Button variant="filter" onClick={handleClickClearSearch}>
          <Icons name="Filter" className="w-6 h-6" />
          <p>
            แสดงทั้งหมด
            {/* ({nameFilter.length}) */}
          </p>
        </Button>

        {/* {bidIds.length > 1 && ( */}
        {/*   <Button> */}
        {/*     <Icons name="DocumentLight" className="w-6 h-6" /> */}
        {/*     <p>ดู {bidIds.length} รายการที่เลือก</p> */}
        {/*   </Button> */}
        {/* )} */}
      </div>
    </div>
  );
}
