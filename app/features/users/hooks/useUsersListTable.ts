import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { useUsersStore } from "@/app/store/usersStore";
import {
  EComPathName,
  EFacPathName,
  EHttpStatusCode,
  ERoles,
  ESortDirection,
} from "@/app/types/enum";
import { IMeta, ISort } from "@/app/types/global";
import { IUsersListTable } from "@/app/types/usersType";

// interface keyHeaderListProps {
//   selected: string;
//   role: string;
//   username: string;
//   name: string;
//   password: string;
//   phone: string;
//   email: string;
//   action: string;
// }

export default function useUsersListTable() {
  //#region State
  const pathName = usePathname();
  const headerList = useMemo(() => {
    const isDriverPage = pathName.includes(EComPathName.USERSDRIVER);

    const baseHeader = [
      { key: "selected", label: "#", width: "5%", sortable: false },
      { key: "user.position", label: "ตำแหน่ง", width: "15%", sortable: false },
      {
        key: pathName === EFacPathName.USERS ? "factory.name" : "company.name",
        label: "ชื่อ - นามสกุล",
        width: "15%",
      },
      {
        key: "username",
        label: "ชื่อผู้ใช้งาน",
        width: "15%",
        sortable: false,
      },
      { key: "phone", label: "เบอร์โทรศัพท์", width: "15%", sortable: false },
      { key: "email", label: "อีเมล", width: isDriverPage ? "15%" : "20%" },
    ];

    if (isDriverPage) {
      baseHeader.push({
        key: "truck",
        label: "รถบรรทุก",
        width: "15%",
        sortable: false,
      });
    }

    baseHeader.push({
      key: "action",
      label: "",
      width: "10%",
      sortable: false,
    });

    return baseHeader;
  }, [pathName]);

  const [sorting, setSorting] = useState<ISort>({
    sortBy: "",
    sortDirection: ESortDirection.ASC,
  });
  const [pagination, setPagination] = useState<IMeta>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [dataList, setDataList] = useState<IUsersListTable[]>([]);
  const [selectedData, setSelectedData] = useState<IUsersListTable>();
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedListData, setSelectedListData] = useState<IUsersListTable[]>(
    []
  );
  const [openDriverTruckModal, setOpenDriverTruckModal] =
    useState<boolean>(false);

  const router = useRouter();
  const { toast } = useToast();
  //#endregion State

  //#region Store
  const {
    setUsersParams,
    getUsersParams,
    getAllUsersCompanyList,
    getAllUsersFactoryList,
    getSelectedUsers,
    setSelectedUsers,
    deleteUsers,
    getUsersDataList,
  } = useUsersStore();
  //#endregion Store

  //#region Function
  const handleSort = (key: string | "") => {
    console.log("handleSort", key);

    const isNotSortable =
      headerList.find((header) => header.key === key)?.sortable === false;

    if (isNotSortable) {
      setSorting({
        sortBy: "",
        sortDirection: ESortDirection.ASC,
      });
      return;
    }

    const sortKey =
      key === "factory.name" || key === "company.name" ? "firstName" : key;

    setSorting((prev) => ({
      sortBy: sortKey,
      sortDirection:
        prev.sortBy === sortKey && prev.sortDirection === ESortDirection.ASC
          ? ESortDirection.DESC
          : ESortDirection.ASC,
    }));
  };

  const fetchDataList = async () => {
    const getUsersFunction =
      pathName === EComPathName.USERS || pathName === EComPathName.USERSDRIVER
        ? getAllUsersCompanyList
        : getAllUsersFactoryList;
    const byRole =
      pathName === EComPathName.USERSDRIVER ? ERoles.DRIVER : undefined;
    const response = await getUsersFunction(
      getUsersParams(),
      undefined,
      sorting,
      byRole
    );
    setSelectedUsers([]);
    setPagination(response.meta);
    setDataList(response.data);
  };

  const onPaginationChange = (pagination: IMeta) => {
    setUsersParams(pagination);
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
    const paginationUpdated = {
      ...pagination,
      page: 1,
      limit: limit,
    };
    setPagination(paginationUpdated);
    onPaginationChange(paginationUpdated);
  };

  const handleClickViewIcon = (data: IUsersListTable) => {
    setSelectedData(data);
    setOpenDetailModal(true);
  };

  const handleClickBinIcon = (data: IUsersListTable) => {
    setSelectedData(data);
    setOpenDeleteModal(true);
  };
  const handleClickEditIcon = (id: string) => {
    router.push(`${pathName}/${id}`);
  };
  const handleClickShowPassword = (data: IUsersListTable, show: boolean) => {
    const findData = dataList.find((item) => item.id === data.id);
    if (findData) {
      findData.isShowPassword = show;
      setDataList([...dataList]);
    }
  };

  const handleSelectListData = (data: IUsersListTable, checked: boolean) => {
    const updatedList = checked
      ? [...getSelectedUsers(), data]
      : getSelectedUsers().filter((item) => item.id !== data.id);
    setSelectedUsers(updatedList);
  };
  const handleClickConfirmDelete = async (id: string) => {
    const response = await deleteUsers([id]);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      fetchDataList();

      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "ลบรายการสำเร็จ",
      });
    } else {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "ลบรายการไม่สำเร็จ กรุณาลองใหม่",
      });
    }
  };

  const handleClickAddTruckDriver = (data: IUsersListTable) => {
    setSelectedData(data);
    setOpenDriverTruckModal(true);
  };
  //#endregion Function
  return {
    handleSort,
    headerList,
    fetchDataList,
    dataList,
    handleChangePage,
    handleChangeLimit,
    pagination,
    handleClickViewIcon,
    handleClickBinIcon,
    handleClickEditIcon,
    openDetailModal,
    setOpenDetailModal,
    selectedData,
    handleClickShowPassword,
    selectedListData,
    handleSelectListData,
    openDeleteModal,
    handleClickConfirmDelete,
    setOpenDeleteModal,
    getSelectedUsers,
    setSelectedListData,
    setSelectedUsers,
    pathName,
    getUsersDataList,
    setDataList,
    sorting,
    handleClickAddTruckDriver,
    openDriverTruckModal,
    setOpenDriverTruckModal,
  };
}
