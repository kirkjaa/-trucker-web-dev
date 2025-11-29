/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

import { useCoinsStore } from "@/app/store/coinsStore";
import { useGlobalStore } from "@/app/store/globalStore";
import { ICoinsData } from "@/app/types/coinsType";
import { CoinsType } from "@/app/types/enum";
import { IMeta } from "@/app/types/global";

interface keyHeaderListProps {
  driverType: string;
  companyName: string;
  factoryName: string;
  package: string;
  amount: string;
  status: string;
}
export default function useCoinsListTable() {
  //#region State
  const [dataList, setDataList] = useState<ICoinsData[]>([]);
  const [pagination, setPagination] = useState<IMeta>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [tab, setTab] = useState<CoinsType>();
  const [sorting, setSorting] = useState<{
    key: keyof keyHeaderListProps | "";
    direction: string;
  }>({ key: "", direction: "asc" });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<ICoinsData>();
  const headerList = [
    {
      key: "driverType",
      label: "ประเภทบริษัท",
      width: "18%",
      sortable: false,
    },
    { key: "companyName", label: "ชื่อบริษัท", width: "15%", sortable: false },
    {
      key: "factoryName",
      label: "ชื่อผู้ทำรายการ",
      width: "14%",
      sortable: false,
    },
    {
      key: "package",
      label: "วันที่-เวลาทำรายการ",
      width: "15%",
      sortable: false,
    },
    {
      key: "amount",
      label: "จำนวนเหรียญ",
      width: "10%",
      sortable: false,
    },
    { key: "imageUrl", label: "หลักฐาน", width: "10%", sortable: false },
  ];
  //#endregion State

  //#region Store
  const { getAllCoinsList, getCoinsParams } = useCoinsStore();
  const { currentStep } = useGlobalStore();
  //#endregion Store

  //#region Function
  const fetchDataList = async () => {
    const response = await getAllCoinsList(getCoinsParams(), tab);
    // const mock: ICoinsData = {
    //   userId: "aaa",
    //   targetTruckerId: "bbb",
    //   amount: 10,
    //   type: "aaa",
    //   imageUrl:
    //     "https://ssl-trucker.s3.ap-southeast-2.amazonaws.com/production/chatGroup/273688225185795/1740536865656_Isolation_Mode%20(6).png",
    //   createdByTruckerId: "bbb",
    //   approvedBy: "bbb",
    //   remark: "bbb",
    //   createdBy: "bbb",
    //   userRole: "bbb",
    //   companyName: "bbb",
    //   factoryName: "bbb",
    //   driverType: "bbb",
    // };
    // response.data.push(mock);
    setDataList(response.data);
    setPagination(response.meta);
  };
  const handleSort = (key: keyof keyHeaderListProps | "") => {
    const isNotSortable =
      headerList.find((header) => header.key === key)?.sortable === false;
    if (isNotSortable) return;
    setSorting((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleClickViewIcon = (data: ICoinsData) => {
    setSelectedData(data);
    setOpenModal(true);
  };
  //#region Function

  return {
    dataList,
    pagination,
    tab,
    setTab,
    fetchDataList,
    currentStep,
    handleSort,
    headerList,
    handleClickViewIcon,
    openModal,
    setOpenModal,
    selectedData,
  };
}
