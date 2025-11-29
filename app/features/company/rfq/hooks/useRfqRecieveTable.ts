import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { rfqApi } from "@/app/services/rfq/rfqApi";
import { useGlobalStore } from "@/app/store/globalStore";
import { useRfqStore } from "@/app/store/rfq/rfqStore";
import {
  EComPathName,
  EHttpStatusCode,
  ESortDirection,
} from "@/app/types/enum";

interface keyHeaderListProps {
  display_code: string;
  createByFactoryName: string;
  type: string;
  truck_size: string;
  startDestination: string;
  // zone: string;
  factoryOfferPrice: string;
  unit: string;
}

export default function useRfqRecieveTable() {
  // Global State
  const setCurrentStep = useGlobalStore((state) => state.setCurrentStep);
  const { getRfqsReceived, getRfqParams, setRfqReceivedById } = useRfqStore(
    (state) => ({
      getRfqsReceived: state.getRfqsReceived,
      getRfqParams: state.getRfqParams,
      setRfqReceivedById: state.setRfqReceivedById,
    })
  );

  // Local State
  const [sorting, setSorting] = useState<{
    key: keyof keyHeaderListProps | "";
    direction: ESortDirection;
  }>({ key: "", direction: ESortDirection.ASC });
  const [isModalDetailOpen, setIsModalDetailOpen] = useState<boolean>(false);

  // Hooks
  const router = useRouter();
  const pathName = usePathname();

  // Functions
  const headerList: {
    key: keyof keyHeaderListProps | "";
    label: string;
    sortable?: boolean;
    width?: string;
  }[] = [
    { key: "display_code", label: "รหัสใบเสนอราคา", width: "12%" },
    {
      key: "createByFactoryName",
      label: "ชื่อโรงงาน",
      width: "12%",
      sortable: false,
    },
    { key: "type", label: "รูปแบบใบเสนอราคา", width: "12%" },
    { key: "truck_size", label: "ประเภทรถ", width: "12%" },
    { key: "startDestination", label: "ต้นทาง", width: "12%", sortable: false },
    // { key: "zone", label: "โซน", sortable: false, width: "10%" },
    {
      key: "factoryOfferPrice",
      label: "ราคาเสนอ",
      width: "10%",
      sortable: false,
    },
    {
      key: "unit",
      label: "หน่วย",
      width: "7%",
      sortable: false,
    },
    { key: "", label: "", width: "10%" },
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

    getRfqsReceived({
      page: 1,
      limit: getRfqParams().limit,
      sort: sorting.key,
      order: sorting.direction,
    });
  };

  const handleClickViewIcon = async (rfqId: number) => {
    const response = await rfqApi.getRfqReceivedById(rfqId);

    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      setRfqReceivedById(response.data);
      setIsModalDetailOpen(true);
      setCurrentStep(1);
    }
  };

  const handleClickOffer = async (id: number) => {
    const response = await rfqApi.getRfqById(id);

    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      router.push(
        pathName.startsWith(EComPathName.QUOFAC)
          ? `/company/quotation-factory/offer/${id}`
          : `/company/quotation-market/offer/${id}`
      );
    }
  };

  return {
    headerList,
    handleSort,
    handleClickOffer,
    isModalDetailOpen,
    setIsModalDetailOpen,
    handleClickViewIcon,
  };
}
