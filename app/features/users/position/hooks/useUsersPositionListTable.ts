import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { useUsersPositionStore } from "@/app/store/usersPositionStore";
import { ESortDirection } from "@/app/types/enum";
import { IMeta, ISort } from "@/app/types/global";
import { IUsersPositionListTable } from "@/app/types/usersPositionType";

interface keyHeaderListProps {
  selected: string;
  title: string;
  name: string;
  isActive: string;
  action: string;
}

export default function useUsersPositionListTable() {
  //#region State
  const { toast } = useToast();
  const headerList = [
    { key: "selected", label: "#", width: "5%", sortable: false },
    { key: "title", label: "อักษรนำหน้า", width: "13%" },
    { key: "name", label: "ตำแหน่ง", width: "17%" },
    { key: "isActive", label: "สถานะ", width: "10%", sortable: false },
    { key: "action", label: "", width: "55%", sortable: false },
  ];
  const [pagination, setPagination] = useState<IMeta>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [sorting, setSorting] = useState<ISort>({
    sortBy: "",
    sortDirection: ESortDirection.ASC,
  });
  const [dataList, setDataList] = useState<IUsersPositionListTable[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<IUsersPositionListTable>();
  const [selectedList, setSelectedList] = useState<IUsersPositionListTable[]>(
    []
  );
  const router = useRouter();
  const pathName = usePathname();
  //#endregion State

  //#region Store
  const {
    getUsersPositionParams,
    changeStatusUsersPosition,
    deleteUserPosition,
    getSelectedUsersPosition,
    setSelectedUsersPosition,
    setUsersPositionParams,
    getListUsersPositionMe,
  } = useUsersPositionStore();
  //#endregion Store

  //#region Function
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

  const fetchDataList = async () => {
    const response = await getListUsersPositionMe(
      getUsersPositionParams(),
      undefined,
      sorting
    );

    setDataList(response.data);
    setPagination(response.meta);
  };

  const handleChangeStatus = async (id: string, status: boolean) => {
    const response = await changeStatusUsersPosition(id, status);
    if (response.statusCode === 200) {
      setDataList((prev) => {
        return prev.map((data) => {
          if (data.id === id) {
            data.isActive = status;
          }
          return data;
        });
      });
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "อัพเดทสถานะสำเร็จ",
      });
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: "อัพเดทสถานะไม่สำเร็จ กรุณาลองใหม่ " + response.message.th,
      });
    }
  };

  const handleClickEditIcon = (id: string) => {
    router.push(pathName + "/" + id);
  };

  const handleClickConfirmDelete = async (id: string) => {
    const response = await deleteUserPosition([id]);
    if (response.statusCode === 200) {
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
        description: "ลบรายการไม่สำเร็จ กรุณาลองใหม่ " + response.message.th,
      });
    }
  };
  const handleClickBinIcon = (data: IUsersPositionListTable) => {
    setSelectedData(data);
    setOpenDeleteModal(true);
  };

  const handleClickViewIcon = (data: IUsersPositionListTable) => {
    setSelectedData(data);
    setOpenDetailModal(true);
  };

  const handleSelectListId = (
    data: IUsersPositionListTable,
    checked: boolean
  ) => {
    const updatedList = checked
      ? [...getSelectedUsersPosition(), data]
      : getSelectedUsersPosition().filter(
          (item: IUsersPositionListTable) => item.id !== data.id
        );
    setSelectedList(updatedList);
    setSelectedUsersPosition(updatedList);
  };

  const onPaginationChange = (pagination: IMeta) => {
    setUsersPositionParams(pagination);
    fetchDataList();
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
    console.log(limit);
    const paginationUpdated = {
      ...pagination,
      page: 1,
      limit: limit,
    };
    setPagination(paginationUpdated);
    onPaginationChange(paginationUpdated);
  };
  //#endregion Function
  return {
    handleSort,
    headerList,
    fetchDataList,
    dataList,
    handleChangeStatus,
    handleClickEditIcon,
    openDeleteModal,
    setOpenDeleteModal,
    selectedData,
    handleClickConfirmDelete,
    handleClickBinIcon,
    handleClickViewIcon,
    openDetailModal,
    setOpenDetailModal,
    handleSelectListId,
    selectedList,
    sorting,
    pagination,
    setPagination,
    handleChangeLimit,
    handleChangePage,
  };
}
