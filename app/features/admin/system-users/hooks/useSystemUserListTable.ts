import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { userApi } from "@/app/services/user/userApi";
import { useSystemUsersCompanyStore } from "@/app/store/systemUsersCompanyStore";
import { useSystemUsersFactoryStore } from "@/app/store/systemUsersFactoryStore";
import { useUserStore } from "@/app/store/user/userStore";
import {
  EAdminPathName,
  EHttpStatusCode,
  ESortDirection,
} from "@/app/types/enum";
import { ISort } from "@/app/types/global";
import { ISystemUsersData } from "@/app/types/systemUsersType";
import { IUser } from "@/app/types/user/userType";

interface keyHeaderListProps {
  id: string;
  name: string;
  displayCode: string;
  fullName: string;
  userName: string;
  phone: string;
  email: string;
}

export default function useSystemUserListTable() {
  // Global State
  const { getAllUserByTypeId, getUserParams, setUserParams } = useUserStore(
    (state) => ({
      getAllUserByTypeId: state.getAllUserByTypeId,
      getUserParams: state.getUserParams,
      setUserParams: state.setUserParams,
    })
  );
  const {
    // getSystemUsersCompanyById,
    getSelectedSystemUsersCompanyListId,
    setSelectedSystemUsersCompanyListId,
    // setSystemUserCompanyParams,
    // deleteSystemUserCompany,
  } = useSystemUsersCompanyStore();
  const {
    // getSystemUsersFactoryById,
    getSelectedSystemUsersFactoryListId,
    setSelectedSystemUsersFactoryListId,
    // setSystemUserFactoryParams,
  } = useSystemUsersFactoryStore();

  //Local State
  // const [dataList, setDataList] = useState<ISystemUsersData[]>([]);
  const [dataById, setDataById] = useState<IUser>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [sorting, setSorting] = useState<ISort>({
    sortBy: "",
    sortDirection: ESortDirection.ASC,
  });
  const [selectedListId, setSelectedListId] = useState<ISystemUsersData[]>([]);
  const [selectedData, setSelectedData] = useState<IUser>();
  // const [pagination, setPagination] = useState<IMeta>({
  //   page: 1,
  //   limit: 10,
  //   total: 0,
  // });
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  // Hook
  const pathName = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  //Function

  const headerList = [
    // { key: "id", label: "", width: "4%", sortable: false }, // เพิ่มขนาดให้ checkbox ดูสมดุลขึ้น
    {
      key: "id",
      label: pathName.includes(EAdminPathName.SYSTEMUSERSFACTORIES)
        ? "ชื่อโรงงาน"
        : "ชื่อบริษัท",
      width: "15%",
    },
    {
      key: "display_code",
      label: "รหัสผู้ใช้",
      width: "12%",
    },
    {
      key: "fullName",
      label: "ชื่อ - นามสกุล",
      width: "18%",
      sortable: false,
    },
    {
      key: "userName",
      label: "ชื่อผู้ใช้งาน",
      width: "12%",
      sortable: false,
    },
    { key: "phone", label: "เบอร์โทรศัพท์", width: "14%", sortable: false },
    { key: "email", label: "อีเมล", width: "20%" },
    { key: "actions", label: "", width: "10%", sortable: false },
  ];

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
    await getAllUserByTypeId({
      page: 1,
      limit: 10,
      organizationTypeId:
        pathName === EAdminPathName.SYSTEMUSERSFACTORIES ? 1 : 2,
      sort: sorting.sortBy,
      order: sorting.sortDirection,
    });
  };

  const handleClickViewIcon = async (id: number) => {
    try {
      const response = await userApi.getUserById(id);
      // await handleFetchTransactionCoins(data.truckerId);
      if (response.statusCode === EHttpStatusCode.SUCCESS) {
        const data = response.data;
        setDataById(data);
        setOpenModal(true);
      }
    } catch (error) {
      console.error("Failed to fetch details:", error);
    }
  };

  const handleClickEditIcon = (id: number) => {
    router.push(`${pathName}/${id}`);
  };

  const handleSelectListId = (data: ISystemUsersData, checked: boolean) => {
    const isCompany = pathName.includes(EAdminPathName.SYSTEMUSERSCOMPANIES);
    const getSelectedListId = isCompany
      ? getSelectedSystemUsersCompanyListId
      : getSelectedSystemUsersFactoryListId;
    const updatedList = checked
      ? [...getSelectedListId(), data]
      : getSelectedListId().filter((item) => item.id !== data.id);
    pathName.includes(EAdminPathName.SYSTEMUSERSCOMPANIES)
      ? setSelectedSystemUsersCompanyListId(updatedList)
      : setSelectedSystemUsersFactoryListId(updatedList);

    setSelectedListId(updatedList);
  };

  const handleChangePage = (page: number) => {
    const paginationUpdated = {
      ...getUserParams(),
      page,
    };
    setUserParams(paginationUpdated);
    getAllUserByTypeId(paginationUpdated);
  };

  const handleChangeLimit = (limit: number) => {
    const paginationUpdated = {
      ...getUserParams(),
      page: 1,
      limit,
    };
    setUserParams(paginationUpdated);
    getAllUserByTypeId(paginationUpdated);
  };

  const handleClickBinIcon = (data: IUser) => {
    setSelectedData(data);
    setOpenDeleteModal(true);
  };

  const handleClickConfirmDelete = async () => {
    if (!selectedData)
      return toast({
        icon: "ToastError",
        variant: "error",
        description: "การลบรายการไม่สำเร็จ โปรดลองอีกครั้ง",
      });

    const response = await userApi.deleteUser(selectedData?.id);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "การลบรายการเสร็จสมบูรณ์",
      });
      fetchDataList();
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: "การลบรายการไม่สำเร็จ โปรดลองอีกครั้ง",
      });
    }
  };
  //#endregion Function
  return {
    headerList,
    handleSort,
    fetchDataList,
    pathName,
    handleClickViewIcon,
    handleClickEditIcon,
    dataById,
    openModal,
    setOpenModal,
    sorting,
    handleSelectListId,
    selectedListId,
    handleChangePage,
    handleChangeLimit,
    handleClickBinIcon,
    openDeleteModal,
    setOpenDeleteModal,
    selectedData,
    handleClickConfirmDelete,
    setSelectedListId,
  };
}
