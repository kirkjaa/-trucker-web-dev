/* eslint-disable @typescript-eslint/no-unused-vars */
interface keyHeaderListProps {
  driverType: string;
  companyName: string;
  factoryName: string;
  package: string;
  amount: string;
  status: string;
}
export default function usePluginListTable() {
  //#region State
  const headerList = [
    {
      key: "code",
      label: "รหัส",
      width: "8%",
      sortable: false,
    },
    { key: "name", label: "ชื่อปลั๊กอิน", width: "15%", sortable: false },
    {
      key: "detail",
      label: "รายละเอียดบริษัท",
      width: "14%",
      sortable: false,
    },
    {
      key: "date",
      label: "วันที่เพิ่ม",
      width: "12%",
      sortable: false,
    },
    {
      key: "createBy",
      label: "ผู้เพิ่มข้อมูล",
      width: "14%",
      sortable: false,
    },
    {
      key: "amount",
      label: "เหรียญคงเหลือ",
      width: "14%",
      sortable: false,
    },
    { key: "status", label: "สถานะ", width: "10%", sortable: false },
    { key: "action", label: "", width: "8%", sortable: false },
  ];
  //#endregion State
  //#region Fucntion
  const handleSort = (key: keyof keyHeaderListProps | "") => {};
  //#region Fucntion

  return {
    headerList,
    handleSort,
  };
}
