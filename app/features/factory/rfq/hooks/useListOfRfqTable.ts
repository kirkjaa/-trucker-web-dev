import { useState } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { rfqApi } from "@/app/services/rfq/rfqApi";
import { useRfqStore } from "@/app/store/rfq/rfqStore";
import { EHttpStatusCode, ESortDirection } from "@/app/types/enum";

interface keyHeaderListProps {
  display_code: string;
  type: string;
  truck_size: string;
  routesStart: string;
  routesEnd: string;
  offer: string;
  is_active: string;
}

export default function useListOfRfqTable() {
  // Global State
  const { getRfqs, getRfqParams } = useRfqStore((state) => ({
    getRfqs: state.getRfqs,
    getRfqParams: state.getRfqParams,
  }));

  // Local State
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<boolean>(false);
  const [displayCode, setdisplayCode] = useState<string>("");
  const [rfqId, setRfqId] = useState<number>(0);
  const [isModalActiveStatusOpen, setIsModalActiveStatusOpen] =
    useState<boolean>(false);
  const [activeStatus, setActiveStatus] = useState<string>("");
  const [sorting, setSorting] = useState<{
    key: keyof keyHeaderListProps | "";
    direction: ESortDirection;
  }>({ key: "", direction: ESortDirection.ASC });

  // Hook
  const router = useRouter();
  const { toast } = useToast();

  // Function
  const headerList: {
    key: keyof keyHeaderListProps | "";
    label: string;
    sortable?: boolean;
    width?: string;
  }[] = [
    { key: "display_code", label: "รหัสใบเสนอราคา", width: "14%" },
    { key: "type", label: "รูปแบบใบเสนอราคา", width: "16%" },
    { key: "truck_size", label: "ประเภทรถ", width: "11%" },
    { key: "routesStart", label: "ต้นทาง", sortable: false, width: "13%" },
    { key: "routesEnd", label: "ปลายทาง", sortable: false, width: "13%" },
    { key: "offer", label: "เสนอราคา", sortable: false, width: "11%" },
    { key: "is_active", label: "แสดงตลาด", width: "12%" },
    { key: "", label: "", width: "9%" },
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

    getRfqs({
      page: 1,
      limit: getRfqParams().limit,
      sort: sorting.key,
      order: sorting.direction,
    });
  };

  const handleClickSwitchToggleActive = (
    id: number,
    active: string,
    displayCode: string
  ) => {
    setRfqId(id);
    setActiveStatus(active);
    setdisplayCode(displayCode);
    setIsModalActiveStatusOpen(true);
  };

  const handleClickConfirmChangeActive = async () => {
    try {
      const response = await rfqApi.isActiveRfq(
        rfqId,
        activeStatus === "Y" ? false : true
      );

      if (response.statusCode === EHttpStatusCode.SUCCESS) {
        toast({
          icon: "ToastSuccess",
          variant: "success",
          description: response.message.th,
        });
        getRfqs({
          page: 1,
          limit: getRfqParams().limit,
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
        description: "เปลี่ยนสถานะ RFQ ไม่สำเร็จ โปรดลองอีกครั้ง",
      });
    }
  };

  const handleClickViewRoute = (id: number) => {
    router.push(`/factory/list-of-rfq/${id}/routes`);
  };

  const handleClickCompanySelected = (id: number) => {
    router.push(`/factory/list-of-rfq/company-selected/${id}`);
  };

  const handleClickBinIcon = (id: number, displayCode: string) => {
    setRfqId(id);
    setdisplayCode(displayCode);
    setIsModalDeleteOpen(true);
  };

  const handleClickConfirmDeleteQuotation = async () => {
    try {
      const response = await rfqApi.deleteRfq(rfqId);

      if (response.statusCode === EHttpStatusCode.SUCCESS) {
        toast({
          icon: "ToastSuccess",
          variant: "success",
          description: "การลบใบเสนอราคาเสร็จสมบูรณ์",
        });
        getRfqs({
          page: 1,
          limit: getRfqParams().limit,
        });
      }
    } catch (error) {
      toast({
        icon: "ToastError",
        variant: "error",
        description: "การลบรายการไม่สำเร็จ โปรดลองอีกครั้ง",
      });
    }
  };

  return {
    displayCode,
    headerList,
    handleSort,
    activeStatus,
    isModalActiveStatusOpen,
    setIsModalActiveStatusOpen,
    handleClickSwitchToggleActive,
    handleClickConfirmChangeActive,
    handleClickViewRoute,
    handleClickCompanySelected,
    isModalDeleteOpen,
    setIsModalDeleteOpen,
    handleClickBinIcon,
    handleClickConfirmDeleteQuotation,
  };
}
