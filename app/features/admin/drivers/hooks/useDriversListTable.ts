import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { toast } from "@/app/components/ui/toast/use-toast";
import { driverApi } from "@/app/services/driver/driverApi";
import { useDriverStore } from "@/app/store/driver/driverStore";
import { IDriver } from "@/app/types/driver/driverType";
import {
  DriversStatus,
  DriversType,
  EAdminPathName,
  EHttpStatusCode,
  ESortDirection,
  ReviewDriverReason,
} from "@/app/types/enum";
import { ISort } from "@/app/types/global";
import { IUser } from "@/app/types/user/userType";
import formatFullName from "@/app/utils/formatFullName";

interface keyHeaderListProps {
  selected: string;
  displayCode: string;
  name: string;
  companyName: string;
  username: string;
  phone: string;
  email: string;
}
export default function useDriversListTable() {
  // Global State
  const {
    getDriversInternal,
    getDriversFreelance,
    getDriverParams,
    setDriverParams,
  } = useDriverStore((state) => ({
    getDriversInternal: state.getDriversInternal,
    getDriversFreelance: state.getDriversFreelance,
    getDriverParams: state.getDriverParams,
    setDriverParams: state.setDriverParams,
  }));

  //Local State
  const [data, setData] = useState<IDriver>();
  const [selectedListId, setSelectedListId] = useState<IDriver[]>([]);
  const [selectedData, setSelectedData] = useState<IDriver>();
  const [sorting, setSorting] = useState<ISort>({
    sortBy: "",
    sortDirection: ESortDirection.ASC,
  });
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openReviewModal, setOpenReviewModal] = useState<boolean>(false);
  const [status, setStatus] = useState<DriversStatus>();

  // Hook
  const pathName = usePathname();
  const driverType = useMemo(() => {
    return pathName.includes(EAdminPathName.DRIVERSINTERNAL)
      ? DriversType.INTERNAL
      : pathName.includes(EAdminPathName.DRIVERSREVIEWFREELANCE)
        ? DriversType.REVIEWFREELANCE
        : DriversType.FREELANCE;
  }, [pathName]);

  const headerList = useMemo(() => {
    switch (driverType) {
      case DriversType.INTERNAL:
        return [
          // { key: "selected", label: "#", width: "4%", sortable: false },
          {
            key: "displayCode",
            label: "รหัสพนักงาน",
            width: "12%",
          },
          { key: "name", label: "ชื่อ-นามสกุล", width: "15%", sortable: false },
          // { key: "position", label: "ตำแหน่ง", width: "18%", sortable: false },
          {
            key: "company.name",
            label: "ชื่อบริษัท",
            width: "15%",
          },
          {
            key: "username",
            label: "ชื่อผู้ใช้งาน",
            width: "10%",
            sortable: false,
          },
          {
            key: "phone",
            label: "เบอร์โทรศัพท์",
            width: "10%",
            sortable: false,
          },
          { key: "user.email", label: "อีเมล", width: "18%" },
          { key: "actions", label: "", width: "10%", sortable: false },
        ];
      case DriversType.FREELANCE:
        return [
          // { key: "selected", label: "#", width: "4%", sortable: false },
          {
            key: "displayCode",
            label: "รหัสพนักงาน",
            width: "12%",
          },
          { key: "name", label: "ชื่อ-นามสกุล", width: "15%", sortable: false },
          // { key: "position", label: "ตำแหน่ง", width: "18%", sortable: false },
          {
            key: "username",
            label: "ชื่อผู้ใช้งาน",
            width: "10%",
            sortable: false,
          },
          {
            key: "phone",
            label: "เบอร์โทรศัพท์",
            width: "10%",
            sortable: false,
          },
          { key: "user.email", label: "อีเมล", width: "18%" },
          { key: "actions", label: "", width: "10%", sortable: false },
        ];
      case DriversType.REVIEWFREELANCE:
        return [
          { key: "name", label: "ชื่อ-นามสกุล", width: "15%", sortable: false },
          {
            key: "phone",
            label: "เบอร์โทรศัพท์",
            width: "10%",
            sortable: false,
          },
          { key: "user.email", label: "อีเมล", width: "18%" },
          {
            key: "idCardImageUrl",
            label: "สำเนาบัตรประชาชน",
            width: "18%",
            sortable: false,
          },
          {
            key: "vehicleRegistrationImageUrl",
            label: "สำเนาทะเบียนรถ",
            width: "15%",
            sortable: false,
          },
          {
            key: "vehicleLicenseImageUrl",
            label: "สำเนาใบขับขี่",
            width: "15%",
            sortable: false,
          },
          { key: "actions", label: "", width: "8%", sortable: false },
        ];
    }
  }, [driverType]);

  const router = useRouter();

  //Function
  const handleSelectListId = (data: IUser, checked: boolean) => {
    console.log(data, checked);
    /* const updatedList = checked */
    /*   ? [...getSelectedList(), data] */
    /*   : getSelectedList().filter((item: IDriversData) => item.id !== data.id); */
    /* setSelectedList(updatedList); */
    /* setSelectedListId(updatedList); */
  };

  const fetchDataList = async () => {
    if (driverType === DriversType.INTERNAL) {
      await getDriversInternal({
        page: 1,
        limit: 10,
        sort: sorting.sortBy,
        order: sorting.sortDirection,
      });
    } else if (driverType === DriversType.FREELANCE) {
      await getDriversFreelance({
        page: 1,
        limit: 10,
        sort: sorting.sortBy,
        order: sorting.sortDirection,
        status: DriversStatus.APPROVE,
      });
    } else {
      await getDriversFreelance({
        page: 1,
        limit: 10,
        sort: sorting.sortBy,
        order: sorting.sortDirection,
        status: DriversStatus.PENDING,
      });
    }
  };

  const handleSort = (key: keyof keyHeaderListProps | "") => {
    const isNotSortable =
      headerList.find((header) => header.key === key)?.sortable === false;

    if (isNotSortable) {
      setSorting({
        sortBy: "",
        sortDirection: ESortDirection.ASC,
      });
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

  const handleClickEditIcon = (id: number) => {
    router.push(`${pathName}/${id}`);
  };

  const handleClickConfirmDelete = async (id: number) => {
    const response = pathName.includes(EAdminPathName.DRIVERSINTERNAL)
      ? await driverApi.deleteDriverInternal(id)
      : await driverApi.deleteDriverFreelance(id);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      fetchDataList();
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

  const handleClickBinIcon = (data: IDriver) => {
    setSelectedData(data);
    setOpenDeleteModal(true);
  };

  const handleClickViewIcon = async (id: number) => {
    const response = await driverApi.getDriverById(id);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      setData(response.data);
      setOpenDetailModal(true);
    }
  };

  const handleChangePage = (page: number) => {
    const paginationUpdated = {
      ...getDriverParams(),
      page,
    };
    setDriverParams(paginationUpdated);
    if (driverType === DriversType.INTERNAL) {
      getDriversInternal(paginationUpdated);
    } else if (driverType === DriversType.FREELANCE) {
      getDriversFreelance({
        ...paginationUpdated,
        status: DriversStatus.APPROVE,
      });
    } else {
      getDriversFreelance({
        ...paginationUpdated,
        status: DriversStatus.PENDING,
      });
    }
  };

  const handleChangeLimit = (limit: number) => {
    const paginationUpdated = {
      ...getDriverParams(),
      limit,
      page: 1,
    };
    setDriverParams(paginationUpdated);
    if (driverType === DriversType.INTERNAL) {
      getDriversInternal(paginationUpdated);
    } else if (driverType === DriversType.FREELANCE) {
      getDriversFreelance({
        ...paginationUpdated,
        status: DriversStatus.APPROVE,
      });
    } else {
      getDriversFreelance({
        ...paginationUpdated,
        status: DriversStatus.PENDING,
      });
    }
  };

  const handleReviewDriver = (data: IDriver, approve: DriversStatus) => {
    setStatus(approve);
    setSelectedData(data);
    setOpenReviewModal(true);
  };

  const handleClickViewDocument = (url: string) => {
    if (url === null || url === "") {
      toast({
        icon: "ToastError",
        variant: "error",
        description: "ไม่พบไฟล์ที่ต้องการ",
      });
    } else {
      window.open(url, "_blank");
    }
  };

  const onSubmitReviewDriver = async (
    reason?: ReviewDriverReason,
    remark?: string
  ) => {
    const formData = new FormData();

    formData.set(
      "driver_status",
      status === DriversStatus.APPROVE
        ? DriversStatus.APPROVE
        : DriversStatus.REJECTED
    );

    formData.set(
      "rejected_reason",
      reason === ReviewDriverReason.อื่นๆ ? (remark ?? "") : (reason ?? "")
    );

    const response = await driverApi.updateDriverFreelance(
      selectedData!.id,
      formData
    );
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: `ยืนยัน ${formatFullName(
          selectedData?.user.first_name,
          selectedData?.user.last_name
        )} เสร็จสมบูรณ์`,
      });
      fetchDataList();
      setSelectedData(undefined);
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: `ยืนยัน ${formatFullName(
          selectedData?.user.first_name,
          selectedData?.user.last_name
        )} ไม่สำเร็จ โปรดลองอีกครั้ง`,
      });
    }
  };

  return {
    fetchDataList,
    headerList,
    sorting,
    handleSort,
    driverType,
    handleClickEditIcon,
    handleClickBinIcon,
    handleClickViewIcon,
    openDetailModal,
    setOpenDetailModal,
    data,
    handleChangeLimit,
    handleChangePage,
    handleSelectListId,
    selectedListId,
    handleClickConfirmDelete,
    setOpenDeleteModal,
    openDeleteModal,
    selectedData,
    openReviewModal,
    setOpenReviewModal,
    status,
    setSelectedListId,
    handleReviewDriver,
    onSubmitReviewDriver,
    pathName,
    handleClickViewDocument,
  };
}
