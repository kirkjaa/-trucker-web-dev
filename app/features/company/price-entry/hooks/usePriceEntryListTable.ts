import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { useRouteStore } from "@/app/store/routeStore";
import { ERouteType, ETruckSize, truckSizeLabel } from "@/app/types/enum";
import { IMeta } from "@/app/types/global";
import { IRoutePriceEntryListData } from "@/app/types/routesType";

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
export default function usePriceEntryListTable() {
  //#region State
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [pagination, setPagination] = useState<IMeta>({
    page: 1,
    limit: 10,
    total: 0,
  });
  // const [sorting, setSorting] = useState<ISort>({
  //   sortBy: "",
  //   sortDirection: ESortDirection.ASC,
  // });
  const [dataList, setDataList] = useState<IRoutePriceEntryListData[]>([]);
  const [selectedData, setSelectedData] = useState<IRoutePriceEntryListData>();

  const pathName = usePathname();

  const type: ERouteType = useMemo(() => {
    if (pathName.includes(ERouteType.ABROAD)) return ERouteType.ABROAD;
    return ERouteType.ONEWAY;
  }, [pathName]);

  const headerList = useMemo(() => {
    const defaultHeaders = [
      {
        key: "displayCode",
        label: "รหัสเส้นทางใหม่",
        sortable: false,
        width: "15%",
      },
      { key: "origin", label: "ต้นทาง", sortable: false, width: "15%" },
      { key: "destination", label: "ปลายทาง", sortable: false, width: "15%" },
      { key: "distance", label: "ระยะทาง", sortable: false, width: "10%" },
    ];

    const wheelSet = new Set<ETruckSize>();
    dataList.forEach((route) => {
      route.priceEntries.forEach((entry) => {
        wheelSet.add(entry.truckSize);
      });
    });

    const wheelHeaders = Array.from(wheelSet).map((wheel: ETruckSize) => ({
      key: wheel,
      label: truckSizeLabel[wheel] || wheel,
      sortable: false,
    }));

    const actionHeader = {
      key: "action",
      label: "",
      sortable: false,
      width: "10%",
    };

    const dynamicColumnCount = wheelHeaders.length;
    const remainingWidth =
      100 -
      defaultHeaders.reduce((acc, h) => acc + parseFloat(h.width!), 0) -
      parseFloat(actionHeader.width!);
    const dynamicWidth = `${(remainingWidth / dynamicColumnCount).toFixed(2)}%`;

    const wheelHeadersWithWidth = wheelHeaders.map((header) => ({
      ...header,
      width: dynamicWidth,
    }));

    return [...defaultHeaders, ...wheelHeadersWithWidth, actionHeader];
  }, [dataList]);

  //#endregion State

  //#region Store
  const {
    getRoutePriceEntryList,
    setRoutePriceEntryParams,
    getRoutePriceEntryParams,
  } = useRouteStore();

  //#endregion Store

  //#region Function
  const onPaginationChange = (pagination: IMeta) => {
    setRoutePriceEntryParams(pagination);
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
      limit,
      page: 1,
    };
    setPagination(paginationUpdated);
    onPaginationChange(paginationUpdated);
  };
  const handleSort = (key: keyof keyHeaderListProps | "") => {
    console.log(key);
    // const isNotSortable =
    //   headerList.find((header) => header.key === key)?.sortable === false;
    // if (isNotSortable) {
    //   setSorting(() => ({
    //     sortBy: "",
    //     sortDirection: ESortDirection.ASC,
    //   }));
    // } else {
    //   setSorting((prev) => ({
    //     sortBy: key,
    //     sortDirection:
    //       prev.sortBy === key && prev.sortDirection === ESortDirection.ASC
    //         ? ESortDirection.DESC
    //         : ESortDirection.ASC,
    //   }));
    // }
  };
  const fetchDataList = async () => {
    const response = await getRoutePriceEntryList(
      getRoutePriceEntryParams(),
      type
    );

    setDataList(response.data);
    setPagination(response.meta);
  };

  const handleClickPlusIcon = (data: IRoutePriceEntryListData) => {
    setSelectedData(data);
    setOpenAddModal(true);
  };

  const handleClickPenIcon = (data: IRoutePriceEntryListData) => {
    setSelectedData(data);
    setOpenEditModal(true);
  };
  //#endregion Function
  return {
    headerList,
    handleSort,
    handleChangePage,
    pagination,
    handleChangeLimit,
    openAddModal,
    setOpenAddModal,
    openEditModal,
    setOpenEditModal,
    fetchDataList,
    dataList,
    handleClickPlusIcon,
    selectedData,
    handleClickPenIcon,
  };
}
