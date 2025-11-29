/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { toast, useToast } from "@/app/components/ui/toast/use-toast";
import { iconNames } from "@/app/icons";
import { useDisbursementStore } from "@/app/store/disbursementStore";
import { useQuotationsStore } from "@/app/store/quotationsStore";
import { useRouteStore } from "@/app/store/routeStore";
import { useTruckStore } from "@/app/store/truckStore";
import { useUsersPositionStore } from "@/app/store/usersPositionStore";
import { useUsersStore } from "@/app/store/usersStore";
import {
  EComPathName,
  EFacPathName,
  ERoles,
  ETruckDepartmentType,
} from "@/app/types/enum";
import { ISearch } from "@/app/types/global";

export default function useSearchBar() {
  //#region  State
  const [textBtnPlus, setTextBtnPlus] = useState<string>("");
  const [visibleBtnPlus, setVisibleBtnPlus] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [dataCount, setDataCount] = useState<number>(0);
  const [optionSearch, setOptionSearch] = useState<string[]>([]);
  const [searchKey, setSearchKey] = useState<string[]>([]);
  const [openModalDeleteList, setOpenModalDeleteList] =
    useState<boolean>(false);
  const [selectedListId, setSelectedListId] = useState<any[]>([]);
  const [iconBtnPlus, setIconBtnPlus] =
    useState<keyof typeof iconNames>("Plus");
  const router = useRouter();
  const pathName = usePathname();

  //#endregion State

  //#region Store
  const {
    getTruckParams,
    getOptionSearchTruck,
    getAllCompanyTruckList,
    getAllFactoryTruckList,
    getSelectedTruck,
    deleteTruck,
    setSelectedTruck,
  } = useTruckStore();

  const {
    getSelectedUsersPosition,
    setSelectedUsersPosition,
    getUsersPositionParams,
    getListUsersPositionMe,
    getOptionSearchUsersPosition,
    deleteUserPosition,
  } = useUsersPositionStore();

  const {
    getUsersParams,
    getSelectedUsers,
    setSelectedUsers,
    deleteUsers,
    getOptionSearchUsers,
    getAllUsersCompanyList,
    getAllUsersFactoryList,
  } = useUsersStore();

  const {
    getQuotationSearchParams,
    getOptionSearchContractCompany,
    getContractCompanyList,
  } = useQuotationsStore();

  const { getRoutePriceEntryParams } = useRouteStore();

  const { getOpenDowloadModal, setOpenDowloadModal } = useDisbursementStore();
  //#endregion Store

  //#region Function
  const handleClickCreate = () => {
    if (
      pathName === EComPathName.DISBURSEMENTEMPLOYEE ||
      pathName === EComPathName.DISBURSEMENTFACTORY ||
      pathName === EComPathName.DISBURSEMENTFREELANCE ||
      pathName === EFacPathName.DISBURSEMENTEMPLOYEE ||
      pathName === EFacPathName.DISBURSEMENTTRANSPORTATION
    ) {
      setOpenDowloadModal(true);
    } else {
      router.push(`${pathName}/create`);
    }
  };

  const getSelectedListId = () => {
    if (
      pathName === EFacPathName.TRUCK ||
      pathName === EComPathName.TRUCK ||
      pathName === EComPathName.RENTALTRUCK
    ) {
      return getSelectedTruck();
    } else if (
      pathName === EComPathName.USERSPOSITION ||
      pathName === EFacPathName.USERSPOSITION
    ) {
      return getSelectedUsersPosition();
    } else if (
      pathName === EFacPathName.USERS ||
      pathName === EComPathName.USERS ||
      pathName === EComPathName.USERSDRIVER
    ) {
      return getSelectedUsers();
    }

    return [];
  };

  const onClickDeleteList = () => {
    if (
      pathName === EFacPathName.TRUCK ||
      pathName === EComPathName.TRUCK ||
      pathName === EComPathName.RENTALTRUCK
    ) {
      setSelectedListId(getSelectedListId());
    } else if (
      pathName === EComPathName.USERSPOSITION ||
      pathName === EFacPathName.USERSPOSITION
    ) {
      setSelectedListId(getSelectedUsersPosition());
    } else if (
      pathName === EFacPathName.USERS ||
      pathName === EComPathName.USERS ||
      pathName === EComPathName.USERSDRIVER
    ) {
      setSelectedListId(getSelectedUsers());
    }
    setOpenModalDeleteList(true);
  };

  const handleCheckSearchKey = (key: string) => {
    const newKey = searchKey.includes(key)
      ? searchKey.filter((e) => e !== key)
      : [...searchKey, key];
    setSearchKey(newKey);
  };

  const handleClickClearSearch = async () => {
    setSearch("");
    switch (true) {
      case pathName === EFacPathName.TRUCK ||
        pathName === EComPathName.TRUCK ||
        pathName === EComPathName.RENTALTRUCK:
        setOptionSearch(getOptionSearchTruck());
        setSearchKey(getOptionSearchTruck());
        break;

      case pathName === EComPathName.USERSPOSITION ||
        pathName === EFacPathName.USERSPOSITION:
        setOptionSearch(getOptionSearchUsersPosition());
        setSearchKey(getOptionSearchUsersPosition());
        break;
      case pathName === EComPathName.USERS ||
        pathName === EFacPathName.USERS ||
        pathName === EComPathName.USERSDRIVER:
        setSearchKey(getOptionSearchUsers());
        setOptionSearch(getOptionSearchUsers());
        break;
      case pathName === EFacPathName.SHIPPINGCOMPANY:
        setOptionSearch(getOptionSearchContractCompany());
        setSearchKey(getOptionSearchContractCompany());

        break;
    }

    setSearchKey([]);

    await handleClickSearch(true);
  };

  const handleClickSearch = async (clearSearch?: boolean) => {
    let searchFilter: ISearch | null = null;
    if (!clearSearch) {
      searchFilter = { search, searchKey };
    }
    const searchParams =
      searchFilter && searchFilter.searchKey?.length ? searchFilter : undefined;
    switch (true) {
      case pathName === EFacPathName.TRUCK:
        await getAllFactoryTruckList(
          getTruckParams(),
          undefined,
          searchParams,
          undefined
        );
        break;
      case pathName === EComPathName.TRUCK:
        await getAllCompanyTruckList(
          getTruckParams(),
          undefined,
          searchParams,
          undefined
        );
        break;
      case pathName === EComPathName.RENTALTRUCK:
        await getAllCompanyTruckList(
          getTruckParams(),
          undefined,
          searchParams,
          undefined,
          ETruckDepartmentType.FREELANCE
        );
        break;
      case pathName === EComPathName.USERSPOSITION ||
        pathName === EFacPathName.USERSPOSITION:
        console.log("aaaF");
        await getListUsersPositionMe(getUsersPositionParams(), searchParams);
        break;
      case pathName === EFacPathName.SHIPPINGCOMPANY:
        getContractCompanyList(getQuotationSearchParams(), searchParams);
        break;
      case pathName === EFacPathName.USERS:
        getAllUsersFactoryList(getUsersParams(), searchParams);
        break;
      case pathName === EComPathName.USERS:
        getAllUsersCompanyList(getUsersParams(), searchParams);
        break;
      case pathName === EComPathName.USERSDRIVER:
        getAllUsersCompanyList(
          getUsersParams(),
          searchParams,
          undefined,
          ERoles.DRIVER
        );
        break;
      default:
        break;
    }
  };

  const handleClickConfirmDelete = async (ids: string[]) => {
    let response = null;
    if (
      pathName === EFacPathName.TRUCK ||
      pathName === EComPathName.TRUCK ||
      pathName === EComPathName.RENTALTRUCK
    ) {
      response = await deleteTruck(ids);
    } else if (
      pathName === EComPathName.USERSPOSITION ||
      pathName === EFacPathName.USERSPOSITION
    ) {
      response = await deleteUserPosition(ids);
    } else if (
      pathName === EFacPathName.USERS ||
      pathName === EComPathName.USERS ||
      pathName === EComPathName.USERSDRIVER
    ) {
      response = await deleteUsers(ids);
    }

    if (response?.statusCode === 200) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "การลบรายการเสร็จสมบูรณ์",
      });
      handleClickSearch();
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: "การลบรายการไม่สำเร็จ โปรดลองอีกครั้ง",
      });
    }

    setSelectedListId([]);
    setSelectedTruck([]);
    setSelectedUsers([]);
    setSelectedUsersPosition([]);
  };
  //#endregion Function
  return {
    handleClickCreate,
    setDataCount,
    getTruckParams,
    pathName,
    dataCount,
    setTextBtnPlus,
    textBtnPlus,
    optionSearch,
    setOptionSearch,
    getOptionSearchTruck,
    getOptionSearchUsersPosition,
    handleCheckSearchKey,
    searchKey,
    setSearchKey,
    setSearch,
    handleClickSearch,
    getSelectedListId,
    onClickDeleteList,
    openModalDeleteList,
    setOpenModalDeleteList,
    selectedListId,
    handleClickConfirmDelete,
    visibleBtnPlus,
    setVisibleBtnPlus,
    getUsersPositionParams,
    getUsersParams,
    getQuotationSearchParams,
    getOptionSearchContractCompany,
    getOptionSearchUsers,
    getRoutePriceEntryParams,
    iconBtnPlus,
    setIconBtnPlus,
    handleClickClearSearch,
    setSelectedListId,
    setSelectedTruck,
    setSelectedUsers,
    setSelectedUsersPosition,
  };
}
