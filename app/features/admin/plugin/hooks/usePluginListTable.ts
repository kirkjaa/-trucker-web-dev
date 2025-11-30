import { useCallback, useState } from "react";

import { usePluginStore } from "@/app/store/pluginStore";

interface KeyHeaderListProps {
  code: string;
  name: string;
  detail: string;
  date: string;
  createBy: string;
  amount: string;
  status: string;
}

const sortableKeys: (keyof KeyHeaderListProps)[] = [
  "code",
  "name",
  "date",
  "amount",
  "status",
];

export default function usePluginListTable() {
  const { plugins, getAllPlugins, getPluginParams } = usePluginStore(
    (state) => ({
      plugins: state.plugins,
      getAllPlugins: state.getAllPlugins,
      getPluginParams: state.getPluginParams,
    })
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [sortKey, setSortKey] = useState<keyof KeyHeaderListProps>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const headerList = [
    { key: "code", label: "รหัส", width: "8%", sortable: true },
    { key: "name", label: "ชื่อปลั๊กอิน", width: "15%", sortable: true },
    {
      key: "detail",
      label: "รายละเอียดบริษัท",
      width: "14%",
      sortable: false,
    },
    { key: "date", label: "วันที่เพิ่ม", width: "12%", sortable: true },
    { key: "createBy", label: "ผู้เพิ่มข้อมูล", width: "14%", sortable: false },
    { key: "amount", label: "เหรียญคงเหลือ", width: "14%", sortable: true },
    { key: "status", label: "สถานะ", width: "10%", sortable: true },
    { key: "action", label: "", width: "8%", sortable: false },
  ];

  const fetchDataList = useCallback(
    async (
      search?: string,
      customSort?: keyof KeyHeaderListProps,
      customOrder?: "asc" | "desc"
    ) => {
      setLoading(true);
      try {
        await getAllPlugins({
          ...getPluginParams(),
          search,
          sort: (customSort ?? sortKey) as string,
          order: customOrder ?? sortOrder,
        });
      } finally {
        setLoading(false);
      }
    },
    [getAllPlugins, getPluginParams, sortKey, sortOrder]
  );

  const handleSort = (key: keyof KeyHeaderListProps | "") => {
    if (!key || !sortableKeys.includes(key)) {
      return;
    }
    const order =
      sortKey === key ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
    setSortKey(key);
    setSortOrder(order);
    fetchDataList(undefined, key, order);
  };

  return {
    headerList,
    handleSort,
    fetchDataList,
    loading,
    plugins,
    sortKey,
    sortOrder,
  };
}
