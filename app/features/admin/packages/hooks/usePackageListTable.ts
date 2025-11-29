import { useMemo, useState } from "react";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { packageApi } from "@/app/services/package/packageApi";
import { useGlobalStore } from "@/app/store/globalStore";
import { usePackageStore } from "@/app/store/package/packageStore";
import { usePackagesStore } from "@/app/store/packagesStore";
import { EHttpStatusCode, ESortDirection } from "@/app/types/enum";
import { IMeta, ISort } from "@/app/types/global";
import { IPackage } from "@/app/types/package/packageType";
import { IPackagesData } from "@/app/types/packagesType";

interface keyHeaderListProps {
  name: string;
  duration: string;
  price: string;
  createDate: string;
  startDate: string;
  endDate: string;
  isActive: string;
  action: string;
}
export default function usePackageListTable() {
  //Global State
  const {
    getAllPackages,
    getPackageById,
    getPackageParams,
    setPackageParams,
    getOpenPackageModal,
    setOpenPackageModal,
    getDisabled,
    setDisabled,
  } = usePackageStore((state) => ({
    getAllPackages: state.getAllPackages,
    getPackageById: state.getPackageById,
    getPackageParams: state.getPackageParams,
    setPackageParams: state.setPackageParams,
    getOpenPackageModal: state.getOpenPackageModal,
    setOpenPackageModal: state.setOpenPackageModal,
    getDisabled: state.getDisabled,
    setDisabled: state.setDisabled,
  }));
  const { currentStep } = useGlobalStore();
  const { getPackagesListData, getPackagesByIdData } = usePackagesStore();

  //Local State
  const [pagination, setPagination] = useState<IMeta>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [dataList, setDataList] = useState<IPackagesData[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<IPackage>();
  const [openStatusModal, setOpenStatusModal] = useState<boolean>(false);
  const [sorting, setSorting] = useState<ISort>({
    sortBy: "",
    sortDirection: ESortDirection.ASC,
  });

  // Hook
  const { toast } = useToast();
  const headerList = useMemo(() => {
    switch (currentStep) {
      case 1:
        return [
          { key: "name", label: "ชื่อแพ็คเกจ", width: "30%", sortable: false },
          {
            key: "duration.value",
            label: "ระยะเวลาใช้งาน",
            width: "16%",
          },
          { key: "price", label: "ราคาแพ็คเกจ", width: "15%" },
          {
            key: "createdAt",
            label: "วันที่สร้าง",
            width: "12%",
          },
          {
            key: "startDate",
            label: "วันที่เริ่มใช้งาน",
            width: "15%",
          },
          {
            key: "endDate",
            label: "วันที่สิ้นสุดใช้งาน",
            width: "17%",
          },
          { key: "status", label: "สถานะ", width: "9%", sortable: false },
          { key: "actions", label: "", width: "10%", sortable: false },
        ];

      case 2:
        return [];
      default:
        return [];
    }
  }, [currentStep]);

  //Function
  const fetchDataList = async () => {
    await getAllPackages({
      page: 1,
      limit: 10,
      sort: sorting.sortBy,
      order: sorting.sortDirection,
    });
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

  const handleChangeStatus = async (data: IPackage, status: boolean) => {
    const updatedData: IPackage = {
      ...data,
      is_active: status === true ? "Y" : "N",
    };
    setSelectedData(updatedData);
    setOpenStatusModal(true);
  };

  const handleClickConfirmChangeStatus = async (id: number, status: string) => {
    const response = await packageApi.updatePackageStatus(
      id,
      status === "Y" ? true : false
    );
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      fetchDataList();
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "อัพเดทสถานะสำเร็จ",
      });
    } else {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "อัพเดทสถานะไม่สำเร็จ กรุณาลองใหม่",
      });
    }
  };

  const handleClickBinIcon = (data: IPackage) => {
    setSelectedData(data);
    setOpenDeleteModal(true);
  };

  const handleClickConfirmDelete = async (id: number) => {
    const response = await packageApi.deletePackage(id);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      fetchDataList();
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "ลบรายการสำเร็จ",
      });
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: "ลบรายการไม่สำเร็จ กรุณาลองใหม่",
      });
    }
  };

  const handleClickPenIcon = async (id: number) => {
    const response = await getPackageById(id);

    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      setDisabled(false);
      setOpenPackageModal(true);
    }
  };

  const handleClickViewIcon = async (id: number) => {
    setDisabled(true);
    const response = await getPackageById(id);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      setOpenPackageModal(true);
    }
  };

  const handleChangePage = (page: number) => {
    const paginationUpdated = {
      ...getPackageParams(),
      page,
    };
    setPackageParams(paginationUpdated);
    getAllPackages(paginationUpdated);
  };

  const handleChangeLimit = (limit: number) => {
    const paginationUpdated = {
      ...getPackageParams(),
      limit,
      page: 1,
    };
    setPackageParams(paginationUpdated);
    getAllPackages(paginationUpdated);
  };

  return {
    headerList,
    handleSort,
    fetchDataList,
    dataList,
    currentStep,
    getOpenPackageModal,
    setOpenPackageModal,
    handleChangeStatus,
    openDeleteModal,
    setOpenDeleteModal,
    selectedData,
    handleClickConfirmDelete,
    openStatusModal,
    setOpenStatusModal,
    handleClickConfirmChangeStatus,
    handleClickBinIcon,
    handleClickPenIcon,
    handleClickViewIcon,
    getDisabled,
    setDisabled,
    pagination,
    handleChangePage,
    handleChangeLimit,
    getPackagesListData,
    setDataList,
    setPagination,
    getPackageParams,
    sorting,
    getPackagesByIdData,
  };
}
