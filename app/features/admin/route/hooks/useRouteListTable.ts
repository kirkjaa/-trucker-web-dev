import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { routeApi } from "@/app/services/route/routeApi";
import { useRouteStore } from "@/app/store/route/routeStore";
import {
  EAdminPathName,
  EHttpStatusCode,
  ERouteShippingType,
  ERouteType,
  ESortDirection,
} from "@/app/types/enum";
import { ISort } from "@/app/types/global";
import { EFreightType, ERouteStatus } from "@/app/types/route/routeEnum";
import { IRoute } from "@/app/types/route/routeType";
import { IRouteData } from "@/app/types/routesType";
import { RouteFormInputs } from "@/app/utils/validate/route-validate";

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
export default function useRouteListTable() {
  // Global State
  const {
    getAllRoutes,
    getAllRoutesByStatus,
    getRouteParams,
    setRouteParams,
    getOpenCreateModal,
    setOpenCreateModal,
  } = useRouteStore((state) => ({
    getAllRoutes: state.getAllRoutes,
    getAllRoutesByStatus: state.getAllRoutesByStatus,
    getRouteParams: state.getRouteParams,
    setRouteParams: state.setRouteParams,
    getOpenCreateModal: state.getOpenCreateModal,
    setOpenCreateModal: state.setOpenCreateModal,
  }));

  //Local State
  // const [dataList, setDataList] = useState<IRouteData[]>([]);
  // const [pagination, setPagination] = useState<IMeta>({
  //   page: 1,
  //   limit: 10,
  //   total: 0,
  // });
  const [selectedData, setSelectedData] = useState<IRoute>();
  const [openLatLngModal, setOpenLatLngModal] = useState<boolean>(false);
  const [latLngModalType, setLatLngModalType] = useState<
    "origin" | "destination"
  >();
  const [sorting, setSorting] = useState<ISort>({
    sortBy: "",
    sortDirection: ESortDirection.ASC,
  });
  const [byShippingType, setByShippingType] = useState<ERouteShippingType>();
  const [byType, setByType] = useState<ERouteType>();
  // const [typeForm, setTypeForm] = useState<"import" | "form">();
  // const [idFactory, setIdFactory] = useState<string>();
  const [dataEdit, setDataEdit] = useState<IRouteData>();

  // Hook
  const pathName = usePathname();
  // const router = useRouter();
  const { toast } = useToast();
  /* const byStatus = useMemo(() => { */
  /*   const status: ERouteStatus = pathName.includes("confirm") */
  /*     ? ERouteStatus.PENDING */
  /*     : ERouteStatus.CONFIRMED; */
  /*   return status; */
  /* }, [pathName]); */

  const headerList = useMemo(() => {
    const value = [
      {
        key: "_id",
        label: "รหัสเส้นทางใหม่",
        width: "18%",
      },
      {
        key: "routeFactoryCode",
        label: "รหัสเส้นทางโรงงาน",
        width: "18%",
      },
      {
        key: "factory.name",
        label: "ชื่อโรงงาน",
        width: "18%",
      },
      {
        key: "originName",
        label: "ต้นทาง",
        width: "18%",
        sortable: false,
      },
      {
        key: "destinationName",
        label: "ปลายทาง",
        width: "18%",
        sortable: false,
      },
      {
        key: "distance",
        label: "ระยะทาง",
        width: "18%",
        sortable: false,
      },
      {
        key: "status",
        label: "สถานะ",
        width: pathName.includes("create") ? "18%" : "12%",
        sortable: false,
      },
    ];
    if (pathName.includes("create")) {
      value.push({
        key: "edit",
        label: "",
        width: "6%",
        sortable: false,
      });
    } else if (pathName.includes("confirm")) {
      value.push(
        {
          key: "approve",
          label: "",
          width: "10%",
          sortable: false,
        },
        {
          key: "reject",
          label: "",
          width: "15%",
          sortable: false,
        }
      );
    }
    return value;
  }, [pathName]);

  const latLngByType = useMemo(() => {
    if (latLngModalType === "origin") {
      return selectedData?.master_route.origin_latitude &&
        selectedData?.master_route.origin_longitude
        ? {
            latitude: selectedData.master_route.origin_latitude,
            longitude: selectedData.master_route.origin_longitude,
          }
        : null;
    } else if (latLngModalType === "destination") {
      return selectedData?.master_route.destination_latitude &&
        selectedData?.master_route.destination_longitude
        ? {
            latitude: selectedData.master_route.destination_latitude,
            longitude: selectedData.master_route.destination_longitude,
          }
        : null;
    }
    return null;
  }, [selectedData, latLngModalType]);

  //Function
  const setFormData = (data: RouteFormInputs[]) => {
    console.log(data);
    /* const dataFormList = data.map((item) => ({ */
    /*   id: Math.random().toString(36).substr(2, 9), */
    /*   masterRoute: { */
    /*     origin: item.origin!, */
    /*     destination: item.destination!, */
    /*   }, */
    /*   factory: { */
    /*     id: item.factoryId, */
    /*     name: item.factoryName */
    /*       ? item.factoryName */
    /*       : data[0].factoryName */
    /*         ? data[0].factoryName */
    /*         : "", */
    /*   }, */
    /*   returnPoint: item.returnPoint, */
    /*   routeFactoryCode: item.routeFactoryCode, */
    /*   shippingType: item.shippingType!, */
    /*   type: item.type!, */
    /*   distance: item.distance, */
    /*   status: ERouteStatus.PENDING, */
    /* })); */
    /* console.log("aaa", dataFormList); */
    /* setDataList(dataFormList as IRouteData[]); */
    /* setPagination({ */
    /*   page: 1, */
    /*   limit: 10, */
    /*   total: data ? data.length : 0, */
    /* }); */
  };

  const fetchFormList = () => {
    /* const formCreateData = getFormCreate(); // เก็บค่าไว้ในตัวแปรก่อน */
    /* console.log("formCreateData", formCreateData); */
    /* if (formCreateData && formCreateData.length > 0) { */
    /*   setFormData(formCreateData); */
    /* } else { */
    /*   if (pathName.includes(EAdminPathName.CREATEINTERNATIONALROUTE)) { */
    /*     router.replace(EAdminPathName.INTERNATIONALROUTE); */
    /*   } else { */
    /*     router.replace(EAdminPathName.DOMESTICROUTE); */
    /*   } */
    /* } */
  };

  const fetchDataList = async () => {
    if (
      pathName === EAdminPathName.DOMESTICROUTE ||
      pathName === EAdminPathName.INTERNATIONALROUTE
    ) {
      await getAllRoutes({
        page: 1,
        limit: 10,
        freight_type:
          pathName === EAdminPathName.DOMESTICROUTE
            ? EFreightType.DOMESTIC
            : EFreightType.INTERNATIONAL,
        sort: sorting.sortBy,
        order: sorting.sortDirection,
      });
    } else {
      await getAllRoutesByStatus({
        page: 1,
        limit: 10,
        freight_type:
          pathName === EAdminPathName.CONFIRMDOMESTICROUTE
            ? EFreightType.DOMESTIC
            : EFreightType.INTERNATIONAL,
        status: ERouteStatus.PENDING,
        sort: sorting.sortBy,
        order: sorting.sortDirection,
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
      setSorting((prev) => ({
        sortBy: key,
        sortDirection:
          prev.sortBy === key && prev.sortDirection === ESortDirection.ASC
            ? ESortDirection.DESC
            : ESortDirection.ASC,
      }));
    }
  };

  const handleChangePage = (page: number) => {
    const paginationUpdated = {
      ...getRouteParams(),
      freight_type:
        pathName === EAdminPathName.DOMESTICROUTE
          ? EFreightType.DOMESTIC
          : EFreightType.INTERNATIONAL,
      page: page,
    };
    setRouteParams(paginationUpdated);
    if (
      pathName === EAdminPathName.DOMESTICROUTE ||
      pathName === EAdminPathName.INTERNATIONALROUTE
    ) {
      getAllRoutes(paginationUpdated);
    } else {
      getAllRoutesByStatus(paginationUpdated);
    }
  };

  const handleChangeLimit = (limit: number) => {
    const paginationUpdated = {
      ...getRouteParams(),
      limit,
      page: 1,
      freight_type:
        pathName === EAdminPathName.DOMESTICROUTE
          ? EFreightType.DOMESTIC
          : EFreightType.INTERNATIONAL,
    };
    setRouteParams(paginationUpdated);
    if (
      pathName === EAdminPathName.DOMESTICROUTE ||
      pathName === EAdminPathName.INTERNATIONALROUTE
    ) {
      getAllRoutes(paginationUpdated);
    } else {
      getAllRoutesByStatus(paginationUpdated);
    }
  };

  const handleClickOpenLatLngModal = (
    data: IRoute,
    type: "origin" | "destination"
  ) => {
    setSelectedData(data);
    setOpenLatLngModal(true);
    setLatLngModalType(type);
  };

  const handleClickPen = (data: IRouteData) => {
    console.log(data);
    /* console.log("handleClickPen", data); */
    /* setTypeForm("form"); */
    /* setIdFactory(data.factory.id); */
    /* setDataEdit(data); */
    /* console.log(getOpenCreateModal()); */
    /* setOpenCreateModalStore(true); */
  };

  const handleConfirm = async (id: number) => {
    const response = await routeApi.updateRouteStatus(
      id,
      ERouteStatus.APPROVED
    );
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "การอนุมัติเสร็จสมบูรณ์",
      });
      fetchDataList();
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: "การอนุมัติรายการไม่สำเร็จ โปรดลองอีกครั้ง",
      });
    }
  };

  const handleReject = async (id: number) => {
    const response = await routeApi.updateRouteStatus(
      id,
      ERouteStatus.REJECTED
    );
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "การปฏิเสธเสร็จสมบูรณ์",
      });
      fetchDataList();
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: "การปฏิเสธรายการไม่สำเร็จ โปรดลองอีกครั้ง",
      });
    }
  };

  return {
    headerList,
    handleSort,
    sorting,
    setByShippingType,
    pathName,
    fetchDataList,
    byShippingType,
    handleChangePage,
    handleChangeLimit,
    handleClickOpenLatLngModal,
    selectedData,
    latLngModalType,
    openLatLngModal,
    setOpenLatLngModal,
    latLngByType,
    byType,
    setByType,
    fetchFormList,
    handleClickPen,
    handleConfirm,
    dataEdit,
    setOpenCreateModal,
    getOpenCreateModal,
    /* getFormCreate, */
    setFormData,
    setDataEdit,
    handleReject,
  };
}
