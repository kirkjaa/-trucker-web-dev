import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { offerApi } from "@/app/services/offer/offerApi";
import { useGlobalStore } from "@/app/store/globalStore";
import { useOfferStore } from "@/app/store/offer/offerStore";
import {
  EComPathName,
  EHttpStatusCode,
  ESortDirection,
} from "@/app/types/enum";
import { EOfferStatus } from "@/app/types/offer/offerEnum";
import { ERfqSendTo } from "@/app/types/rfq/rfqEnum";

interface keyHeaderListProps {
  display_code: string;
  factoryName: string;
  quotationType: string;
  vehicleSize: string;
  routeStart: string;
  routeEnd: string;
  offerPrice: string;
  // zone: string;
  factoryOfferPrice: string;
  status: string;
}

export default function useOfferListTable() {
  // Global State
  const { getOfferByStatus, getOfferParams, setOfferById } = useOfferStore(
    (state) => ({
      getOfferByStatus: state.getOfferByStatus,
      getOfferParams: state.getOfferParams,
      setOfferById: state.setOfferById,
    })
  );
  const setCurrentStep = useGlobalStore((state) => state.setCurrentStep);

  // Local State
  const [sorting, setSorting] = useState<{
    key: keyof keyHeaderListProps | "";
    direction: ESortDirection;
  }>({ key: "", direction: ESortDirection.ASC });
  const [isModalDetailOpen, setIsModalDetailOpen] = useState<boolean>(false);
  const [isCanceledBidModalOpen, setIsCanceledBidModalOpen] =
    useState<boolean>(false);
  const [offerId, setOfferId] = useState<string>("");
  const [displayCode, setdisplayCode] = useState<string>("");

  // Hooks
  const { toast } = useToast();
  const pathName = usePathname();
  const router = useRouter();

  // Functions
  const headerList: {
    key: keyof keyHeaderListProps | "";
    label: string;
    sortable?: boolean;
    width?: string;
  }[] = [
    { key: "display_code", label: "รหัสใบเสนอราคา", width: "12%" },
    { key: "factoryName", label: "ชื่อโรงงาน", width: "12%", sortable: false },
    {
      key: "quotationType",
      label: "รูปแบบใบเสนอราคา",
      width: "14%",
      sortable: false,
    },
    { key: "vehicleSize", label: "ประเภทรถ", width: "12%", sortable: false },
    { key: "routeStart", label: "ต้นทาง", width: "12%", sortable: false },
    { key: "routeEnd", label: "ปลายทาง", width: "12%", sortable: false },
    // { key: "zone", label: "โซน", sortable: false, width: "10%" },
    {
      key: "factoryOfferPrice",
      label: "ราคาเสนอ",
      width: "10%",
      sortable: false,
    },
    { key: "status", label: "สถานะ", sortable: false, width: "12%" },
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
    switch (pathName) {
      case EComPathName.QUOFAC_OFFERED:
        getOfferByStatus({
          page: 1,
          limit: getOfferParams().limit,
          type: ERfqSendTo.DIRECT,
          status: EOfferStatus.OFFER,
          sort: sorting.key,
          order: sorting.direction,
        });
        break;
      case EComPathName.QUOMAR_OFFERED:
        getOfferByStatus({
          page: 1,
          limit: getOfferParams().limit,
          type: ERfqSendTo.BOTH,
          status: EOfferStatus.OFFER,
          sort: sorting.key,
          order: sorting.direction,
        });
        break;
      case EComPathName.QUOFAC_REJECTED:
        getOfferByStatus({
          page: 1,
          limit: getOfferParams().limit,
          type: ERfqSendTo.DIRECT,
          status: EOfferStatus.REJECTED,
          sort: sorting.key,
          order: sorting.direction,
        });
        break;
      case EComPathName.QUOMAR_REJECTED:
        getOfferByStatus({
          page: 1,
          limit: getOfferParams().limit,
          type: ERfqSendTo.BOTH,
          status: EOfferStatus.REJECTED,
          sort: sorting.key,
          order: sorting.direction,
        });
        break;
      case EComPathName.QUOFAC_CANCELED:
        getOfferByStatus({
          page: 1,
          limit: getOfferParams().limit,
          type: ERfqSendTo.DIRECT,
          status: EOfferStatus.CANCELED,
          sort: sorting.key,
          order: sorting.direction,
        });
        break;
      case EComPathName.QUOMAR_CANCELED:
        getOfferByStatus({
          page: 1,
          limit: getOfferParams().limit,
          type: ERfqSendTo.BOTH,
          status: EOfferStatus.CANCELED,
          sort: sorting.key,
          order: sorting.direction,
        });
        break;
    }
  };

  const handleClickViewIcon = async (offerId: number) => {
    const response = await offerApi.getOfferById(offerId);

    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      setOfferById(response.data);
      setIsModalDetailOpen(true);
      setCurrentStep(1);
    }
  };

  const handleClickPenIcon = (offerId: number) => {
    router.push(`${EComPathName.QUOMAR}/offer/edit/${offerId}`);
  };

  const handleClickCanceledBid = (id: number, displayCode: string) => {
    setOfferId(id.toString());
    setdisplayCode(displayCode);
    setIsCanceledBidModalOpen(true);
  };

  const handleClickConfirmCanceledBid = async (offerId: number) => {
    try {
      const response = await offerApi.updateOfferStatus(
        offerId,
        EOfferStatus.CANCELED
      );

      if (response.statusCode === EHttpStatusCode.SUCCESS) {
        toast({
          icon: "ToastSuccess",
          variant: "success",
          description: response.message.th,
        });
      } else {
        toast({
          icon: "ToastError",
          variant: "error",
          description: response.message.th,
        });
      }
    } catch (error) {
      toast({
        icon: "ToastError",
        variant: "error",
        description: "ยกเลิกใบเสนอราคาไม่สำเร็จ โปรดลองอีกครั้ง",
      });
    } finally {
      getOfferByStatus({
        page: getOfferParams().page,
        limit: getOfferParams().limit,
        type: pathName.includes(EComPathName.QUOFAC)
          ? ERfqSendTo.DIRECT
          : ERfqSendTo.BOTH,
        status: EOfferStatus.OFFER,
      });
    }
  };

  return {
    headerList,
    handleSort,
    offerId,
    displayCode,
    isCanceledBidModalOpen,
    setIsCanceledBidModalOpen,
    isModalDetailOpen,
    setIsModalDetailOpen,
    handleClickViewIcon,
    handleClickPenIcon,
    handleClickCanceledBid,
    handleClickConfirmCanceledBid,
  };
}
