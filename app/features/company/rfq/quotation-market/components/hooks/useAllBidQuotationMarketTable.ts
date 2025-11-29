import { useState } from "react";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { useBidsStore } from "@/app/store/bidsStore";
import { useGlobalStore } from "@/app/store/globalStore";
import { EBidStatus } from "@/app/types/enum";

interface keyHeaderListProps {
  displayCode: string;
  factoryName: string;
  quotationType: string;
  vehicleSize: string;
  routeStart: string;
  routeEnd: string;
  distance: string;
  contactAge: string;
  offerPrice: string;
  status: string;
}

export default function useAllBidQuotationMarketTable() {
  // Global State
  const {
    allBidsList,
    getAllBidsList,
    getBidsParams,
    getBidById,
    updateBidStatusCanceled,
  } = useBidsStore();
  const { setCurrentStep } = useGlobalStore();

  // Local State
  const [sorting, setSorting] = useState<{
    key: keyof keyHeaderListProps | "";
    direction: string;
  }>({ key: "", direction: "asc" });
  const [isModalDetailOpen, setIsModalDetailOpen] = useState<boolean>(false);
  const [isCanceledBidModalOpen, setIsCanceledBidModalOpen] =
    useState<boolean>(false);
  const [bidId, setBidId] = useState<string>("");
  const [displayCode, setdisplayCode] = useState<string>("");

  // Hooks
  const { toast } = useToast();

  // Functions
  const headerList: {
    key: keyof keyHeaderListProps | "";
    label: string;
    sortable?: boolean;
    width?: string;
  }[] = [
    { key: "displayCode", label: "รหัสใบเสนอราคา", width: "18%" },
    { key: "factoryName", label: "ชื่อบริษัท", width: "12%" },
    { key: "quotationType", label: "รูปแบบใบเสนอราคา", width: "18%" },
    { key: "vehicleSize", label: "ประเภทรถ", width: "12%" },
    { key: "routeStart", label: "ต้นทาง", sortable: false, width: "10%" },
    { key: "routeEnd", label: "ปลายทาง", sortable: false, width: "10%" },
    { key: "distance", label: "ระยะทาง", width: "10%" },
    {
      key: "contactAge",
      label: "อายุสัญญา",
      width: "12%",
    },
    { key: "offerPrice", label: "ราคาเสนอ", sortable: false, width: "12%" },
    { key: "status", label: "สถานะ", sortable: false, width: "14%" },

    { key: "", label: "", width: "8%" },
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

  const sortedDataForAllBid = allBidsList
    ? [...allBidsList].sort((a, b) => {
        if (!sorting.key) return 0;
        const valueA =
          sorting.key === "contactAge"
            ? (a as any)[sorting.key]?.length
            : (a as any)[sorting.key];
        const valueB =
          sorting.key === "contactAge"
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
    await getBidById(rfqId).then(() => {
      setIsModalDetailOpen(true);
      setCurrentStep(1);
    });
  };

  const handleClickCanceledBid = (id: string, displayCode: string) => {
    setBidId(id);
    setdisplayCode(displayCode);
    setIsCanceledBidModalOpen(true);
  };

  const handleClickConfirmCanceledBid = async (bidId: string) => {
    try {
      await updateBidStatusCanceled(bidId).then(() => {
        toast({
          icon: "ToastSuccess",
          variant: "success",
          description: "ยกเลิกใบเสนอราคาสำเร็จ",
        });
      });
    } catch (error) {
      toast({
        icon: "ToastError",
        variant: "error",
        description: "ยกเลิกใบเสนอราคาไม่สำเร็จ โปรดลองอีกครั้ง",
      });
    } finally {
      await getAllBidsList({
        page: getBidsParams().page,
        limit: getBidsParams().limit,
        status: EBidStatus.SUBMITTED,
      });
    }
  };

  return {
    headerList,
    handleSort,
    sortedDataForAllBid,
    bidId,
    displayCode,
    isCanceledBidModalOpen,
    setIsCanceledBidModalOpen,
    isModalDetailOpen,
    setIsModalDetailOpen,
    handleClickViewIcon,
    handleClickCanceledBid,
    handleClickConfirmCanceledBid,
  };
}
