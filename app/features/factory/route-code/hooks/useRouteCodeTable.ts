import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { useRouteStore } from "@/app/store/routeStore";
import { useUserStore } from "@/app/store/userStore";
import { EFacPathName, ERouteType, ESortDirection } from "@/app/types/enum";
import { ISort } from "@/app/types/global";
import { IRouteData } from "@/app/types/routesType";

interface keyHeaderListProps {
  _id: string;
  routeFactoryCode: string;
  "factory.name": string;
  returnPoint: string;
  origin: string;
  destination: string;
  distance: string;
  active: string;
}

export default function useRouteCodeTable() {
  // Global State
  const {
    getRouteFactoryList,
    getRouteFactorySearchParams,
    setRouteFactorySearchParams,
  } = useRouteStore((state) => ({
    getRouteFactoryList: state.getRouteFactoryList,
    getRouteFactorySearchParams: state.getRouteFactorySearchParams,
    setRouteFactorySearchParams: state.setRouteFactorySearchParams,
  }));
  const { userMe, getUserMe } = useUserStore((state) => ({
    userMe: state.userMe,
    getUserMe: state.getUserMe,
  }));

  // Local State
  const [sorting, setSorting] = useState<ISort>({
    sortBy: "",
    sortDirection: ESortDirection.ASC,
  });
  const [selectedData, setSelectedData] = useState<IRouteData>();
  const [openLatLngModal, setOpenLatLngModal] = useState<boolean>(false);
  const [latLngModalType, setLatLngModalType] = useState<
    "origin" | "destination" | "returnPoint"
  >();

  // Hook
  const pathName = usePathname();
  const latLngByType = useMemo(() => {
    if (latLngModalType) {
      const location = selectedData?.masterRoute?.[latLngModalType];

      return location
        ? {
            latitude: location.latitude?.toString(),
            longitude: location.longitude?.toString(),
          }
        : null;
    }
  }, [selectedData, latLngModalType]);

  // Use Effect
  useEffect(() => {
    getUserMe();
  }, []);

  useEffect(() => {
    if (!userMe?.factory?.id) return;

    getRouteFactoryList({
      page: 1,
      limit: getRouteFactorySearchParams().limit,
      byFactoryId: userMe.factory.id,
      byType:
        pathName === EFacPathName.DOMESTIC_ROUTE
          ? ERouteType.ONEWAY
          : ERouteType.ABROAD,
      sortBy: sorting.sortBy,
      sortDirection: sorting.sortDirection,
    });
  }, [sorting, userMe]);

  // Function
  const setPage = (page: number) => {
    const newSearchParams = {
      ...getRouteFactorySearchParams(),
      page,
      limit: getRouteFactorySearchParams().limit,
      byFactoryId: userMe?.factory?.id,
      byType:
        pathName === EFacPathName.DOMESTIC_ROUTE
          ? ERouteType.ONEWAY
          : ERouteType.ABROAD,
      sortDirection: sorting.sortDirection,
    };
    setRouteFactorySearchParams(newSearchParams);
    getRouteFactoryList(newSearchParams);
  };

  const setLimit = (limit: number) => {
    const newSearchParams = {
      ...getRouteFactorySearchParams(),
      page: getRouteFactorySearchParams().page,
      limit,
      byFactoryId: userMe?.factory?.id,
      byType:
        pathName === EFacPathName.DOMESTIC_ROUTE
          ? ERouteType.ONEWAY
          : ERouteType.ABROAD,
      sortDirection: sorting.sortDirection,
    };
    setRouteFactorySearchParams(newSearchParams);
    getRouteFactoryList(newSearchParams);
  };

  const headerList: {
    key: keyof keyHeaderListProps | "";
    label: string;
    sortable?: boolean;
    width?: string;
  }[] = [
    { key: "_id", label: "รหัสเส้นทางใหม่", width: "15%" },
    { key: "routeFactoryCode", label: "รหัสเส้นทางโรงงาน", width: "15%" },
    // { key: "factory.name", label: "ชื่อโรงงาน", width: "15%" },
    { key: "returnPoint", label: "จุดรับตู้", width: "15%", sortable: false },
    { key: "origin", label: "ต้นทาง", width: "15%", sortable: false },
    { key: "destination", label: "ปลายทาง", width: "15%", sortable: false },
    { key: "distance", label: "ระยะทาง", width: "10%", sortable: false },
    { key: "active", label: "สถานะ", width: "15%", sortable: false },
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
          prev.sortDirection === ESortDirection.ASC
            ? ESortDirection.DESC
            : ESortDirection.ASC,
      }));
    }
  };

  const handleClickOpenLatLngModal = (
    data: IRouteData,
    type: "origin" | "destination" | "returnPoint"
  ) => {
    setSelectedData(data);
    setOpenLatLngModal(true);
    setLatLngModalType(type);
  };

  return {
    headerList,
    handleSort,
    setPage,
    setLimit,
    latLngByType,
    openLatLngModal,
    setOpenLatLngModal,
    handleClickOpenLatLngModal,
  };
}
