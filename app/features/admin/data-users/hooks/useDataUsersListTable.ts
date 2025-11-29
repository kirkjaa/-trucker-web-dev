/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

interface keyHeaderListProps {
  id: string;
  name: string;
  displayCode: string;
  fullName: string;
  userName: string;
  phone: string;
  email: string;
}

export default function useDataUsersListTable() {
  //#region State
  const [openModal, setOpenModal] = useState<boolean>(false);
  const headerList = [
    {
      key: "businessType",
      label: "ประเภทธุรกิจ",
      width: "18%",
      sortable: false,
    },
    {
      key: "legalType",
      label: "ประเภทนิติบุคคล",
      width: "15%",
      sortable: false,
    },
    {
      key: "legalName",
      label: "ชื่อนิติบุคคล",
      width: "14%",
      sortable: false,
    },
    {
      key: "address",
      label: "ที่ตั้งหลัก",
      width: "15%",
      sortable: false,
    },
    {
      key: "admin",
      label: "ผู้ดูแล",
      width: "10%",
      sortable: false,
    },
    { key: "user", label: "ผู้ใช้", width: "10%", sortable: false },
  ];
  //#endregion State
  //#region Store
  //#endregion Store
  //#region Function
  const handleSort = (_key: keyof keyHeaderListProps | "") => {};
  const handleClickViewIcon = () => {
    setOpenModal(true);
  };
  //#endregion Function
  return {
    headerList,
    handleSort,
    handleClickViewIcon,
    openModal,
    setOpenModal,
  };
}
