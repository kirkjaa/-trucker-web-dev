import { useState } from "react";

import { useDisbursementStore } from "@/app/store/disbursementStore";

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

export default function useDisbursementListTable() {
  //#region State
  const headerList = [
    { key: "selected", label: "", width: "5%", sortable: false },
    {
      key: "createdAt",
      label: "วันทีั่",
      width: "14%",
      sortable: false,
    },
    {
      key: "code",
      label: "รหัสออเดอร์",
      width: "14%",
      sortable: false,
    },
    {
      key: "name",
      label: "ชื่อขนส่ง",
      width: "14%",
      sortable: false,
    },
    {
      key: "subject",
      label: "เรื่อง",
      width: "14%",
      sortable: false,
    },
    {
      key: "origin",
      label: "ต้นทาง",
      width: "14%",
      sortable: false,
    },
    {
      key: "destination",
      label: "ปลายทาง",
      width: "14%",
      sortable: false,
    },
    {
      key: "license",
      label: "ทะเบียน",
      width: "14%",
      sortable: false,
    },

    {
      key: "namevehicle",
      label: "ชื่อคนขับ",
      width: "14%",
      sortable: false,
    },
    {
      key: "amount",
      label: "จํานวนเงิน",
      width: "14%",
      sortable: false,
    },
    {
      key: "status",
      label: "สถานะ",
      width: "14%",
      sortable: false,
    },
    {
      key: "action",
      label: "",
      width: "14%",
      sortable: false,
    },
  ];
  // const [sorting, setSorting] = useState<ISort>({
  //   sortBy: "",
  //   sortDirection: ESortDirection.ASC,
  // });
  const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false);
  const [openDownloadModal, setOpenDownloadModal] = useState<boolean>(false);
  //#endregion State

  //#region Store
  const {
    getOpenDowloadModal,
    setOpenDowloadModal: setOpenDownloadModalStore,
  } = useDisbursementStore();
  //#endregion Store

  //#region Function
  const handleSort = (key: keyof keyHeaderListProps | "") => {
    console.log(key);
    // const isNotSortable =
    //   headerList.find((header) => header.key === key)?.sortable === false;

    // if (isNotSortable) {
    //   setSorting((prev) => ({
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
  //#endregion Function
  return {
    headerList,
    handleSort,
    openPaymentModal,
    setOpenPaymentModal,
    openDownloadModal,
    setOpenDownloadModal,
    getOpenDowloadModal,
    setOpenDownloadModalStore,
  };
}
