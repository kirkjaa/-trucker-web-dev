/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { useTruckStore } from "@/app/store/truckStore";
import { EAdminPathName } from "@/app/types/enum";

interface keyHeaderListProps {
  id: string;
  name: string;
  displayCode: string;
  fullName: string;
  userName: string;
  phone: string;
  email: string;
}

export default function useTruckListTable() {
  //#region State
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const pathName = usePathname();

  const headerList = useMemo(() => {
    const result = [
      { key: "selected", label: "#", width: "4%", sortable: false },
    ];
    switch (pathName) {
      case EAdminPathName.TRUCKTYPES:
        result.push({
          key: "type",
          label: "ประเภทรถบรรทุก",
          width: "70%",
          sortable: false,
        });
        break;
      case EAdminPathName.TRUCKSIZES:
        result.push({
          key: "size",
          label: "ขนาดรถบรรทุก",
          width: "70%",
          sortable: false,
        });
        break;
    }
    result.push({
      key: "actions",
      label: "",
      width: "10%",
      sortable: false,
    });
    return result;
  }, [pathName]);

  const feature = useMemo(() => {
    return pathName === EAdminPathName.TRUCKSIZES
      ? EAdminPathName.TRUCKSIZES
      : EAdminPathName.TRUCKTYPES;
  }, [pathName]);
  //#endregion State

  //#region Store
  const { getOpenModal, setOpenModal } = useTruckStore();
  //#endregion Store

  //#region Function
  const handleSort = (key: keyof keyHeaderListProps | "") => {};
  //#endregion Function
  return {
    headerList,
    handleSort,
    getOpenModal,
    setOpenModal,
    visibleModal,
    setVisibleModal,
    feature,
  };
}
