import { useState } from "react";

import { useGlobalStore } from "@/app/store/globalStore";
import { useRfqStore } from "@/app/store/rfqStore";

interface keyHeaderListProps {
  displayCode: string;
  factoryName: string;
  quotationType: string;
  vehicleSize: string;
  routeStart: string;
  routeEnd: string;
  distance: string;
  contactAge: string;
}

export default function useWaitBidTable() {
  // Global State
  const { allRfqList, getRfqById } = useRfqStore();
  const { setCurrentStep } = useGlobalStore();

  // Local State
  const [sorting, setSorting] = useState<{
    key: keyof keyHeaderListProps | "";
    direction: string;
  }>({ key: "", direction: "asc" });
  const [isModalDetailOpen, setIsModalDetailOpen] = useState<boolean>(false);

  // Functions
  const headerList: {
    key: keyof keyHeaderListProps | "";
    label: string;
    sortable?: boolean;
    width?: string;
  }[] = [
    { key: "displayCode", label: "รหัสใบเสนอราคา", width: "12%" },
    { key: "factoryName", label: "ชื่อบริษัท", width: "12%" },
    { key: "quotationType", label: "รูปแบบใบเสนอราคา", width: "14%" },
    { key: "vehicleSize", label: "ประเภทรถ", width: "12%" },
    { key: "routeStart", label: "ต้นทาง", sortable: false, width: "12%" },
    { key: "routeEnd", label: "ปลายทาง", sortable: false, width: "12%" },
    { key: "distance", label: "ระยะทาง", width: "10%" },
    {
      key: "contactAge",
      label: "อายุสัญญา",
      width: "10%",
    },
    { key: "", label: "", width: "6%" },
  ];

  const handleSort = (key: keyof keyHeaderListProps | "") => {
    const isNotSortable =
      headerList.find((header) => header.key === key)?.sortable === false;
    if (isNotSortable) return;

    setSorting((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedDataFromWaitBid = allRfqList
    ? [...allRfqList].sort((a, b) => {
        if (!sorting.key) return 0;
        const valueA =
          sorting.key === "vehicleSize"
            ? (a as any)[sorting.key]?.length
            : (a as any)[sorting.key];
        const valueB =
          sorting.key === "vehicleSize"
            ? (b as any)[sorting.key]?.length
            : (b as any)[sorting.key];

        if (sorting.direction === "asc") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      })
    : [];

  const handleClickViewIcon = async (rfqId: string) => {
    await getRfqById(rfqId).then(() => {
      setIsModalDetailOpen(true);
      setCurrentStep(1);
    });
  };

  return {
    headerList,
    handleSort,
    sortedDataFromWaitBid,
    isModalDetailOpen,
    setIsModalDetailOpen,
    handleClickViewIcon,
  };
}
