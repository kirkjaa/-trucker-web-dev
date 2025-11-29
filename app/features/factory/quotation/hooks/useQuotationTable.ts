import { useState } from "react";
import { usePathname } from "next/navigation";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { quotationApi } from "@/app/services/quotation/quotationApi";
import { useGlobalStore } from "@/app/store/globalStore";
import { useQuotationStore } from "@/app/store/quotation/quotationStore";
import {
  EFacPathName,
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
  vehicleType: string;
  companyName: string;
  document: string;
  oilPrice: string;
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
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<boolean>(false);
  const [isModalAddDocumentFileOpen, setIsModalAddDocumentFileOpen] =
    useState<boolean>(false);
  const [isModalEditOilPriceOpen, setIsModalEditOilPriceOpen] =
    useState<boolean>(false);
  const [quotationCode, setQuotationCode] = useState<string>("");
  const [quotationId, setQuotationId] = useState<number>(0);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  // Hook
  const { toast } = useToast();
  const pathName = usePathname();

  // Function
  const headerList: {
    key: keyof keyHeaderListProps | "";
    label: string;
    sortable?: boolean;
    width?: string;
  }[] = [
    { key: "quotationStatus", label: "สถานะ", width: "15%", sortable: false },
    {
      key: "display_code",
      label: "รหัสใบเสนอราคา",
      width: "15%",
      sortable: true,
    },
    {
      key: "contactLength",
      label: "ระยะเวลาสัญญา",
      width: "15%",
      sortable: false,
    },
    { key: "contactAge", label: "อายุสัญญา", width: "12%", sortable: false },
    {
      key: "quotationType",
      label: "รูปแบบใบเสนอราคา",
      width: "17%",
      sortable: false,
    },
    { key: "vehicleType", label: "ประเภทรถ", width: "12%", sortable: false },
    {
      key: "companyName",
      label: "ชื่อบริษัทขนส่ง",
      width: "15%",
      sortable: false,
    },
    { key: "document", label: "เอกสาร", width: "14%", sortable: false },
    {
      key: "oilPrice",
      label: "กำหนดราคาน้ำมัน",
      width: "16%",
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
      case EFacPathName.QUOPENDING:
        getQuotationsByStatus({
          page: 1,
          limit: getQuotationParams().limit,
          status: EQuotationStatus.PENDING,
          sort: sorting.key,
          order: sorting.direction,
        });
        break;
      case EFacPathName.QUOAPPROVED:
        getQuotationsByStatus({
          page: 1,
          limit: getQuotationParams().limit,
          status: EQuotationStatus.SUCCESS,
          sort: sorting.key,
          order: sorting.direction,
        });
        break;
      case EFacPathName.QUOEXPIRED:
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

  const handleClickAddDocumentButton = (quotationId: number) => {
    setQuotationId(quotationId);
    setIsModalAddDocumentFileOpen(true);
  };

  const handleClickConfirmUploadDocument = async () => {
    const formData = new FormData();
    formData.append("quotation_id", quotationId.toString());
    formData.append("contract_document", documentFile as File);

    const res = await quotationApi.attachFile(formData);
    if (res.statusCode === EHttpStatusCode.SUCCESS) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: res.message.th,
      });
      setIsModalAddDocumentFileOpen(false);
      setDocumentFile(null);
      getQuotationsByStatus({
        page: 1,
        limit: getQuotationParams().limit,
        status: EQuotationStatus.PENDING,
      });
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: res.message.th,
      });
    }
  };

  const handleClickEditOilPriceButton = async (quotationId: number) => {
    console.log(quotationId);
    // await getQuotationById(quotationId).then(() => {
    //   setIsModalEditOilPriceOpen(true);
    // });
  };

  const handleClickViewIcon = async (quotationId: number) => {
    const res = await quotationApi.getQuotationById(quotationId);

    if (res.statusCode === EHttpStatusCode.SUCCESS) {
      setQuotationById(res.data);
      setIsModalDetailOpen(true);
      setCurrentStep(1);
    }
  };

  const handleClickBinIcon = (quotationId: number, quotationCode: string) => {
    setQuotationId(quotationId);
    setQuotationCode(quotationCode);
    setIsModalDeleteOpen(true);
  };

  const handledClickConfirmCanceledQuotation = async () => {
    // try {
    //   await updateQuotationStatusCanceled(quotationId).then(() => {
    //     toast({
    //       icon: "ToastSuccess",
    //       variant: "success",
    //       description: "การลบใบเสนอราคาเสร็จสมบูรณ์",
    //     });
    //     if (pathName === EFacPathName.QUOPENDING) {
    //       getAllQuotationList({
    //         page: getQuotationSearchParams().page,
    //         limit: getQuotationSearchParams().limit,
    //         status: EQuotationStatus.PENDING,
    //       });
    //     } else if (pathName === EFacPathName.QUOEXPIRED) {
    //       getAllQuotationList({
    //         page: getQuotationSearchParams().page,
    //         limit: getQuotationSearchParams().limit,
    //         status: EQuotationStatus.EXPIRED,
    //       });
    //     } else if (pathName === EFacPathName.QUOAPPROVED) {
    //       getAllQuotationList({
    //         page: getQuotationSearchParams().page,
    //         limit: getQuotationSearchParams().limit,
    //         status: EQuotationStatus.APPROVED,
    //       });
    //     }
    //   });
    // } catch (error) {
    //   toast({
    //     icon: "ToastError",
    //     variant: "error",
    //     description: "การลบรายการไม่สำเร็จ โปรดลองอีกครั้ง",
    //   });
    // }
    const res = await quotationApi.deleteQuotation(quotationId);

    if (res.statusCode === EHttpStatusCode.SUCCESS) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: res.message.th,
      });
      if (pathName === EFacPathName.QUOAPPROVED) {
        getQuotationsByStatus({
          page: 1,
          limit: getQuotationParams().limit,
          status: EQuotationStatus.SUCCESS,
        });
      } else if (pathName === EFacPathName.QUOEXPIRED) {
        getQuotationsByStatus({
          page: 1,
          limit: getQuotationParams().limit,
          status: EQuotationStatus.EXPIRED,
        });
      }
    }
  };

  return {
    headerList,
    handleSort,
    handleClickViewIcon,
    handleClickBinIcon,
    handledClickConfirmCanceledQuotation,
    isModalDetailOpen,
    setIsModalDetailOpen,
    isModalDeleteOpen,
    setIsModalDeleteOpen,
    quotationCode,
    isModalAddDocumentFileOpen,
    setIsModalAddDocumentFileOpen,
    handleClickAddDocumentButton,
    handleClickConfirmUploadDocument,
    documentFile,
    setDocumentFile,
    isModalEditOilPriceOpen,
    setIsModalEditOilPriceOpen,
    handleClickEditOilPriceButton,
  };
}
