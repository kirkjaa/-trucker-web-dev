import { useState } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { usePoolStore } from "@/app/store/poolStore";
import { EHttpStatusCode, ESortDirection } from "@/app/types/enum";
import { IMeta, ISort } from "@/app/types/global";
import { IPoolOfferData } from "@/app/types/poolType";

interface keyHeaderListProps {
  selected: string;
  displayCode: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  admin: string;
  active: string;
}

export default function usePoolOfferListTable() {
  //#region State
  const [dataList, setDataList] = useState<IPoolOfferData[]>([]);
  const [selectedData, setSelectedData] = useState<IPoolOfferData>();
  const [pagination, setPagination] = useState<IMeta>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [sorting, setSorting] = useState<ISort>({
    sortBy: "",
    sortDirection: ESortDirection.ASC,
  });
  const [openAceptModal, setOpenAcceptModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const headerList = [
    {
      key: "companyName",
      label: "ชื่อบริษัท",
      width: "20%",
      sortable: false,
    },
    {
      key: "truckSize",
      label: "ประเภทรถ",
      width: "20%",
      sortable: false,
    },
    {
      key: "truckQuantity",
      label: "จำนวนรถ",
      width: "20%",
      sortable: false,
    },
    {
      key: "offeringPrice",
      label: "ราคาเสนอ(บาท)",
      width: "20%",
      sortable: false,
    },
    {
      key: "action",
      label: "",
      width: "20%",
      sortable: false,
    },
  ];

  const router = useRouter();
  const { toast } = useToast();
  //#endregion State

  //#region Store
  const {
    getPoolOfferList,
    getSelectedPool,
    acceptOfferPool,
    rejectOfferPool,
    getOfferPoolParams,
    setOfferPoolParams,
  } = usePoolStore();
  //#endregion Store

  //#region Function
  const handleClickBackStep = () => {
    router.back();
  };
  const fetchDataList = async (postId: string) => {
    const response = await getPoolOfferList(postId, getOfferPoolParams());
    setDataList(response.data);
    setPagination(response.meta);
  };

  const handleSort = (key: keyof keyHeaderListProps | "") => {
    const isNotSortable =
      headerList.find((header) => header.key === key)?.sortable === false;

    if (isNotSortable) {
      setSorting(() => ({
        sortBy: "",
        sortDirection: ESortDirection.ASC,
      }));
    } else {
      setSorting((prev) => ({
        sortBy: key,
        sortDirection:
          prev.sortBy === key && prev.sortDirection === ESortDirection.ASC
            ? ESortDirection.DESC
            : ESortDirection.ASC,
      }));
    }
  };
  const onPaginationChange = (pagination: IMeta) => {
    setOfferPoolParams(pagination);
    fetchDataList(getSelectedPool()!.id);
  };
  const handleChangePage = (page: number) => {
    const paginationUpdated = {
      ...pagination,
      page,
    };
    setPagination(paginationUpdated);
    onPaginationChange(paginationUpdated);
  };

  const handleChangeLimit = (limit: number) => {
    const paginationUpdated = {
      ...pagination,
      limit,
      page: 1,
    };
    setPagination(paginationUpdated);
    onPaginationChange(paginationUpdated);
  };
  const handleClickConfirmAcceptOffer = async (id: string, postId: string) => {
    const response = await acceptOfferPool(id, postId);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "บันทึกสำเร็จ",
        descriptionTwo: "'รายการดำเนินการอยู่'",
      });
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: response.message.th,
      });
    }
  };

  const handleClickConfirmRejectOffer = async (id: string) => {
    const response = await rejectOfferPool(id);

    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "บันทึกสำเร็จ",
        descriptionTwo: "'รายการดำเนินการอยู่'",
      });
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: response.message.th,
      });
    }
  };

  const handleAcceptOffer = async (data: IPoolOfferData) => {
    setSelectedData(data);
    setOpenAcceptModal(true);
  };
  const handleRejectOffer = async (data: IPoolOfferData) => {
    setSelectedData(data);
    setOpenRejectModal(true);
  };
  //#endregion Function
  return {
    fetchDataList,
    headerList,
    handleSort,
    sorting,
    dataList,
    handleClickBackStep,
    getSelectedPool,
    handleAcceptOffer,
    handleRejectOffer,
    handleChangePage,
    handleChangeLimit,
    pagination,
    openAceptModal,
    setOpenAcceptModal,
    openRejectModal,
    setOpenRejectModal,
    selectedData,
    handleClickConfirmAcceptOffer,
    handleClickConfirmRejectOffer,
  };
}
