import { useState } from "react";
import { usePathname } from "next/navigation";

import { quotationApi } from "@/app/services/quotation/quotationApi";
import { useGlobalStore } from "@/app/store/globalStore";
import { useQuotationStore } from "@/app/store/quotation/quotationStore";
import {
  EComPathName,
  EHttpStatusCode,
  ESortDirection,
} from "@/app/types/enum";
import { EQuotationStatus } from "@/app/types/quotation/quotationEnum";

interface keyHeaderListProps {
  quotationStatus: string;
  display_code: string;
  contactLength: string;
  contactAge: string;
  quotationType: string;
  vehicleSize: string;
  companyName: string;
}

export default function useQuotationTable() {
  // Global State
  const { getQuotationsByStatus, getQuotationParams, setQuotationById } =
    useQuotationStore((state) => ({
      getQuotationsByStatus: state.getQuotationsByStatus,
      getQuotationParams: state.getQuotationParams,
      setQuotationById: state.setQuotationById,
    }));
  const setCurrentStep = useGlobalStore((state) => state.setCurrentStep);

  // Local State
  const [sorting, setSorting] = useState<{
    key: keyof keyHeaderListProps | "";
    direction: ESortDirection;
  }>({ key: "", direction: ESortDirection.ASC });
  const [isModalDetailOpen, setIsModalDetailOpen] = useState<boolean>(false);

  // Hook
  const pathName = usePathname();

  // Function
  const headerList: {
    key: keyof keyHeaderListProps | "";
    label: string;
    sortable?: boolean;
    width?: string;
  }[] = [
    { key: "quotationStatus", label: "สถานะ", width: "15%", sortable: false },
    { key: "display_code", label: "รหัสใบเสนอราคา", width: "15%" },
    {
      key: "contactLength",
      label: "ระยะเวลาสัญญา",
      width: "20%",
      sortable: false,
    },
    { key: "contactAge", label: "อายุสัญญา", width: "10%", sortable: false },
    {
      key: "quotationType",
      label: "รูปแบบใบเสนอราคา",
      width: "15%",
      sortable: false,
    },
    { key: "vehicleSize", label: "ประเภทรถ", width: "15%", sortable: false },
    {
      key: "companyName",
      label: "ชื่อบริษัท",
      width: "15%",
      sortable: false,
    },
    { key: "", label: "", width: "10%", sortable: false },
  ];

  const handleSort = (key: keyof keyHeaderListProps | "") => {
    const isNotSortable =
      headerList.find((header) => header.key === key)?.sortable === false;
    if (isNotSortable) return;

    setSorting((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === ESortDirection.ASC
          ? ESortDirection.DESC
          : ESortDirection.ASC,
    }));
    switch (pathName) {
      case EComPathName.QUOPENDING:
        getQuotationsByStatus({
          page: 1,
          limit: getQuotationParams().limit,
          status: EQuotationStatus.PENDING,
          sort: sorting.key,
          order: sorting.direction,
        });
        break;
      case EComPathName.QUOAPPROVED:
        getQuotationsByStatus({
          page: 1,
          limit: getQuotationParams().limit,
          status: EQuotationStatus.SUCCESS,
          sort: sorting.key,
          order: sorting.direction,
        });
        break;
      case EComPathName.QUOEXPIRED:
        getQuotationsByStatus({
          page: 1,
          limit: getQuotationParams().limit,
          status: EQuotationStatus.EXPIRED,
          sort: sorting.key,
          order: sorting.direction,
        });
        break;
    }
  };

  const handleClickViewIcon = async (quotationId: number) => {
    const res = await quotationApi.getQuotationById(quotationId);

    if (res.statusCode === EHttpStatusCode.SUCCESS) {
      setQuotationById(res.data);
      setIsModalDetailOpen(true);
      setCurrentStep(1);
    }
  };

  return {
    headerList,
    handleSort,
    isModalDetailOpen,
    setIsModalDetailOpen,
    handleClickViewIcon,
  };
}
