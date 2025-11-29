"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { useTruckStore } from "@/app/store/truckStore";
import {
  EFacPathName,
  EHttpStatusCode,
  ESortDirection,
  ETruckDepartmentType,
} from "@/app/types/enum";
import { IMeta, ISort } from "@/app/types/global";
import {
  ITruckMeTotal,
  IUpdateLocationTruckRequest,
  TrucksListTable,
} from "@/app/types/truckType";

interface keyHeaderListProps {
  truckCode: string;
  brand: string;
  licensePlate: string;
  color: string;
  type: string;
  types: string;
  dimension: string;
  capacity: string;
  isActive: string;
  actions: string;
}

export default function useTruckTableList() {
  //#region State
  const { toast } = useToast();
  const pathName = usePathname();
  const router = useRouter();
  const [sorting, setSorting] = useState<ISort>({
    sortBy: "",
    sortDirection: ESortDirection.ASC,
  });
  const [dataList, setDataList] = useState<TrucksListTable[]>([]);
  const [selectedData, setSelectedData] = useState<TrucksListTable>();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [pagination, setPagination] = useState<IMeta>({
    page: 1,
    limit: 10,
    total: 0,
  });
  // const [locationRequest, setLocationRequest] =
  //   useState<IUpdateLocationTruckRequest>();
  const [selectedListData, setSelectedListData] = useState<TrucksListTable[]>(
    []
  );

  const [total, setTotal] = useState<ITruckMeTotal>({
    totalTypes: {
      types: [],
      total: 0,
    },
    totalSizes: {
      sizes: [],
      total: 0,
    },
  });

  const headerList = useMemo(() => {
    const columns = pathName.includes("rental")
      ? [
          {
            key: "select",
            label: "",
            width: "3%",
            sortable: false,
          },
          {
            key: "truckCode",
            label: "รหัสรถบรรทุก",
            width: "8%",
          },
          {
            key: "companyName",
            label: "ชื่อบริษัท",
            width: "8%",
          },
          {
            key: "brand",
            label: "ยี่ห้อ",
            width: "8%",
          },

          {
            key: "licensePlate",
            label: "ป้ายทะเบียน",
            width: "10%",
          },
          {
            key: "color",
            label: "สี",
            width: "10%",
            sortable: false,
          },
          {
            key: "type",
            label: "ประเภทรถ",
            width: "10%",
          },
          {
            key: "dimension",
            label: "ขนาดบรรทุกได้ (กxยxส)",
            width: "12%",
            sortable: false,
          },
          {
            key: "license",
            label: "ระยะสัญญา",
            width: "12%",
            sortable: false,
          },
          {
            key: "licenseAge",
            label: "อายุสัญญา",
            width: "12%",
            sortable: false,
          },
          {
            key: "statusJob",
            label: "สถานะงาน",
            width: "12%",
            sortable: false,
          },
          {
            key: "isActive",
            label: "สถานะ",
            width: "10%",
          },
          {
            key: "action",
            label: "",
            width: "14%",
            sortable: false,
          },
        ]
      : [
          {
            key: "select",
            label: "",
            width: "3%",
            sortable: false,
          },
          {
            key: "truckCode",
            label: "รหัสรถบรรทุก",
            width: "8%",
          },
          {
            key: "brand",
            label: "ยี่ห้อ",
            width: "8%",
          },
          {
            key: "licensePlate",
            label: "ป้ายทะเบียน",
            width: "10%",
          },
          {
            key: "color",
            label: "สี",
            width: "10%",
            sortable: false,
          },
          {
            key: "type",
            label: "ประเภทรถ",
            width: "10%",
          },
          {
            key: "dimension",
            label: "ขนาดบรรทุกได้ (กxยxส)",
            width: "12%",
            sortable: false,
          },
          {
            key: "capacity",
            label: "น้ำหนักที่บรรทุกได้",
            width: "10%",
          },
          {
            key: "isActive",
            label: "สถานะ",
            width: "10%",
          },
          {
            key: "action",
            label: "",
            width: "14%",
            sortable: false,
          },
        ];
    return columns;
  }, [pathName]);
  //#endregion State

  //#region Store
  const {
    updateTruckStatus,
    getTruckParams,
    setTruckParams,
    truckDataList,
    deleteTruck,
    updateLocationTruck,
    getAllCompanyTruckList,
    getAllFactoryTruckList,
    getSelectedTruck,
    setSelectedTruck,
    getTruckMeTotal,
  } = useTruckStore();
  //#endregion Store

  //#region  Function
  const fetchDataList = async () => {
    const getAllTruckList =
      pathName === EFacPathName.TRUCK
        ? getAllFactoryTruckList
        : getAllCompanyTruckList;
    const response = await getAllTruckList(
      getTruckParams(),
      undefined,
      undefined,
      sorting,
      pathName.includes("rental") ? ETruckDepartmentType.FREELANCE : undefined
    );
    setDataList(response.data);
    setPagination(response.meta);
  };

  const handleChangePage = (page: number) => {
    const paginationUpdated = {
      ...pagination,
      page,
    };
    setPagination(paginationUpdated);
    setTruckParams(paginationUpdated);
    fetchDataList();
  };

  const handleChangeLimit = (limit: number) => {
    const paginationUpdated = {
      ...pagination,
      limit,
      page: 1,
    };
    setPagination(paginationUpdated);
    setTruckParams(paginationUpdated);
    fetchDataList();
  };
  const handleClickBinIcon = (data: TrucksListTable) => {
    setSelectedData(data);
    setOpenDeleteModal(true);
  };

  const handleClickConfirmDelete = async (id: string) => {
    const response = await deleteTruck([id]);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "การลบรายการเสร็จสมบูรณ์",
      });
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: "การลบรายการไม่สำเร็จ โปรดลองอีกครั้ง",
      });
    }
  };

  const handleChangeStatus = async (id: string, status: boolean) => {
    const response = await updateTruckStatus(id, status);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "อัพเดทสถานะสำเร็จ",
      });
    } else {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "อัพเดทสถานะไม่สำเร็จ กรุณาลองใหม่",
      });
    }
    setDataList((prev) => {
      return prev.map((data) => {
        if (data.id === id) {
          data.isActive = status;
        }
        return data;
      });
    });
    if (selectedData) {
      selectedData.isActive = status;
    }
  };
  const handleClickPinIcon = (data: TrucksListTable) => {
    setOpenLocationModal(true);
    setSelectedData(data);
  };

  const handleClickEditIcon = (id: string) => {
    router.push(`${pathName}/${id}`);
  };

  const handleClickViewIcon = (data: TrucksListTable) => {
    setSelectedData(data);
    setOpenDetailModal(true);
  };

  const onSubmitModalLocation = async (
    id: string,
    data: string,
    latitude: number,
    longitude: number
  ) => {
    const mockRequest: IUpdateLocationTruckRequest = {
      currentLocation: data,
      latitude: latitude,
      longitude: longitude,
    };

    const response = await updateLocationTruck(mockRequest!, id);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "อัพเดทตําแหน่งสำเร็จ",
      });
      setOpenLocationModal(false);
      await fetchDataList();
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: "อัพเดทตําแหน่งไม่สำเร็จ กรุณาลองใหม่",
      });
    }
  };

  const handleSort = (key: keyof keyHeaderListProps | "") => {
    const isNotSortable =
      headerList.find((header) => header.key === key)?.sortable === false;
    if (isNotSortable) {
      setSorting(() => ({
        sortBy: "",
        sortDirection: ESortDirection.ASC,
      }));
    } else {
      let setKey = "";
      if (key === "capacity") setKey = "capacity.weight";
      else if (key === "licensePlate") setKey = "licensePlate.value";
      else setKey = key;
      setSorting((prev) => ({
        sortBy: setKey,
        sortDirection:
          prev.sortBy === key && prev.sortDirection === ESortDirection.ASC
            ? ESortDirection.DESC
            : ESortDirection.ASC,
      }));
    }
  };

  const handleSelectListId = (data: TrucksListTable, checked: boolean) => {
    const getSelectedListId = getSelectedTruck;
    const updatedList = checked
      ? [...getSelectedListId(), data]
      : getSelectedListId().filter((item) => item.id !== data.id);
    setSelectedTruck(updatedList);

    setSelectedListData(updatedList);
  };
  const fetchTotal = async () => {
    const response = await getTruckMeTotal();
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      setTotal(response.data);
    }
  };
  //#endregion Function
  return {
    headerList,
    fetchDataList,
    dataList,
    handleChangeStatus,
    pagination,
    handleChangePage,
    handleChangeLimit,
    truckDataList,
    setDataList,
    handleClickBinIcon,
    openDeleteModal,
    setOpenDeleteModal,
    selectedData,
    handleClickConfirmDelete,
    handleClickEditIcon,
    openLocationModal,
    setOpenLocationModal,
    handleClickPinIcon,
    openDetailModal,
    setOpenDetailModal,

    onSubmitModalLocation,
    handleClickViewIcon,
    handleSort,
    sorting,
    pathName,
    handleSelectListId,
    selectedListData,
    setSelectedTruck,
    setSelectedListData,
    total,
    fetchTotal,
  };
}
