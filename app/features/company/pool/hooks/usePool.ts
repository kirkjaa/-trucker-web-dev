import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { usePoolStore } from "@/app/store/poolStore";
import { EPoolType } from "@/app/types/enum";
import { IMeta } from "@/app/types/global";
import { IPoolData } from "@/app/types/poolType";

export default function usePool() {
  //#region State
  const defaultPagination: IMeta = {
    page: 1,
    limit: 10,
    total: 0,
  };
  const [openModal, setOpenModal] = useState(false);
  const [openOfferModal, setOpenOfferModal] = useState(false);
  const [selectedData, setSelectedData] = useState<IPoolData>();
  const [dataList, setDataList] = useState<IPoolData[]>([]);
  const [pagination, setPagination] = useState<IMeta>(defaultPagination);

  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState<
    string[]
  >([]);
  const [selectedPoolTypeFilter, setSelectedPoolTypeFilter] = useState<
    string[]
  >([]);
  const [selectedTruckSizeFilter, setSelectedTruckSizeFilter] = useState<
    string[]
  >([]);
  const [wFull, setWFull] = useState(false);
  const [ePoolType, setEPoolType] = useState<EPoolType>(EPoolType.NORMAL);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const pathName = usePathname();
  //#endregion State

  //#region Store
  const {
    getPoolList,
    getPoolParams,
    setPoolListData,
    setSelectedPool,
    getPoolMeList,
    setSelectedPoolType,
    setSelectedTruckSize,
    setSelectedProvice,
    getSelectedPoolType,
    getSelectedProvice,
    getSelectedTruckSize,
  } = usePoolStore();
  //#endregion Store

  //#region Functions
  const handleClickCreatePool = (type: EPoolType) => {
    setEPoolType(type);
    setOpenModal(true);
  };

  const fetchDataList = async (
    selectedPoolType?: string[],
    selectedProvince?: string[],
    selectedTruckSize?: string[],
    more?: boolean,
    paginationParam?: IMeta
  ) => {
    let response = null;
    const queryParam = paginationParam || pagination;
    if (more) {
      queryParam.page += 1;
    }
    const getPoolFunction = pathName.includes("market")
      ? getPoolList
      : getPoolMeList;

    response = await getPoolFunction(
      queryParam,
      selectedPoolType,
      selectedProvince,
      selectedTruckSize
    );

    if (response) {
      if (!more) {
        setDataList(response.data);
      } else {
        setDataList((prev: IPoolData[] | undefined) => [
          ...(prev?.length ? prev : []),
          ...response.data,
        ]);
      }
      setHasMore(dataList.length < response.meta.total!);
      setPagination(response.meta);
    }
  };

  const handleClickOffer = (data: IPoolData) => {
    setSelectedData(data);
    setOpenOfferModal(true);
  };

  const handleClickClearFilter = () => {
    setSelectedPoolType([]);
    setSelectedTruckSize([]);
    setSelectedProvice([]);
    setPagination(defaultPagination);
    fetchDataList([], [], [], false, defaultPagination);
  };

  const handleClickPoolCard = (data: IPoolData) => {
    setSelectedPool(data);
    router.push(`${pathName}/${data.id}`);
  };
  //#endregion Functions

  return {
    openModal,
    setOpenModal,
    handleClickCreatePool,
    fetchDataList,
    dataList,
    handleClickOffer,
    openOfferModal,
    setOpenOfferModal,
    selectedData,
    selectedProvinceFilter,
    setSelectedProvinceFilter,
    ePoolType,
    selectedPoolTypeFilter,
    setSelectedPoolTypeFilter,
    selectedTruckSizeFilter,
    setSelectedTruckSizeFilter,
    getPoolParams,
    wFull,
    setWFull,
    handleClickClearFilter,
    handleClickPoolCard,
    pathName,
    getSelectedPoolType,
    getSelectedProvice,
    getSelectedTruckSize,
    setSelectedPoolType,
    setSelectedTruckSize,
    setSelectedProvice,
    hasMore,
    defaultPagination,
    setPoolListData,
    setDataList,
  };
}
