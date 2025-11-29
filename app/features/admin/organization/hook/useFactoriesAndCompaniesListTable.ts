import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { organizationApi } from "../../../../services/organization/organizationApi";
import { useOrganizationStore } from "../../../../store/organization/organizationStore";
import { IOrganization } from "../../../../types/organization/organizationType";

import { toast } from "@/app/components/ui/toast/use-toast";
import { useCoinsStore } from "@/app/store/coinsStore";
import { useCompaniesStore } from "@/app/store/companiesStore";
import { useFactoriesStore } from "@/app/store/factoriesStore";
import {
  EAdminPathName,
  EHttpStatusCode,
  ESortDirection,
} from "@/app/types/enum";
import {
  IFactoriesAndCompaniesData,
  IUserFactoriesAndCompanies,
} from "@/app/types/factoriesAndCompaniesType";
import { ISort } from "@/app/types/global";

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
export default function useFactoriesAndCompaniesListTable() {
  // Global State
  const {
    // getAllFactorysList,
    factorysList,
    deleteFactory,
    getFactoriesParams,
    getFactoriesById,
    setSelectedFactoryListId,
    getSelectedFactoryListId,
    // setFactoriesData,
    getFactoriesData,
    // setFactoriesParams,
    getUserFactoryById,
  } = useFactoriesStore();
  const {
    getAllCompanysList,
    getCompaniesParams,
    getCompaniesData,
    // getCompaniesById,
    // setCompaniesData,
    getSelectedCompanyListId,
    setSelectedCompanyListId,
    // deleteCompany,
    // setCompaniesParams,
    companiesList,
    getUserCompanyById,
  } = useCompaniesStore();
  const {
    getOrganizationsByTypeId,
    getOrganizationParams,
    setOrganizationParams,
  } = useOrganizationStore((state) => ({
    getOrganizationsByTypeId: state.getOrganizationsByTypeId,
    getOrganizationParams: state.getOrganizationParams,
    setOrganizationParams: state.setOrganizationParams,
  }));
  const { getCoinsByTruckerData } = useCoinsStore();

  //Local State
  const [dataList, setDataList] = useState<IFactoriesAndCompaniesData[]>([]);
  const [selectedData, setSelectedData] = useState<IOrganization>();
  const [selectedListId, setSelectedListId] = useState<
    IFactoriesAndCompaniesData[]
  >([]);
  // const [transactionCoins, setTransactionCoins] = useState<ICoinsByTruckerId>();
  const [allUserAdminList, setAllUserAdminList] = useState<
    IUserFactoriesAndCompanies[]
  >([]);

  const [sorting, setSorting] = useState<ISort>({
    sortBy: "",
    sortDirection: "",
  });
  const [openLatLngModal, setOpenLatLngModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedOrg, setSelectedOrg] = useState<IOrganization>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [dataById, setDataById] = useState<IOrganization>();

  // Hook
  const router = useRouter();
  const pathName = usePathname();
  const headerList = useMemo(() => {
    switch (true) {
      case pathName.includes(EAdminPathName.COMPANIES):
        return [
          // { key: "selected", label: "#", width: "4%", sortable: false },
          {
            key: "display_code",
            label: "รหัสบริษัทขนส่ง",
            width: "15%",
          },
          { key: "name", label: "ชื่อบริษัทขนส่ง", width: "14%" },
          { key: "admin", label: "ผู้ดูแล", width: "12%", sortable: false },
          { key: "package", label: "แพ็คเก็จ", width: "15%", sortable: false },
          {
            key: "phone",
            label: "เบอร์โทรศัพท์",
            width: "12%",
            sortable: false,
          },
          { key: "email", label: "อีเมล", width: "18%" },
          {
            key: "address",
            label: "พิกัดสถานที่",
            width: "14%",
            sortable: false,
          },
          { key: "actions", label: "", width: "10%", sortable: false },
        ];
      case pathName.includes(EAdminPathName.FACTORIES):
        return [
          // { key: "selected", label: "#", width: "4%", sortable: false },
          {
            key: "display_code",
            label: "รหัสโรงงาน",
            width: "15%",
          },
          { key: "name", label: "ชื่อโรงงาน", width: "14%" },
          { key: "admin", label: "ผู้ดูแล", width: "12%", sortable: false },
          { key: "package", label: "แพ็คเก็จ", width: "15%", sortable: false },
          {
            key: "phone",
            label: "เบอร์โทรศัพท์",
            width: "12%",
            sortable: false,
          },
          { key: "email", label: "อีเมล", width: "18%" },
          {
            key: "address",
            label: "พิกัดสถานที่",
            width: "14%",
            sortable: false,
          },
          { key: "actions", label: "", width: "10%", sortable: false },
        ];
      default:
        return [];
    }
  }, [pathName]);

  // const { handleUpdate } = useFactoriesAndCompaniesForm();

  //Function
  const fetchDataList = async () => {
    await getOrganizationsByTypeId({
      page: 1,
      limit: 10,
      typeId: pathName === EAdminPathName.FACTORIES ? 1 : 2,
      sort: sorting.sortBy,
      order: sorting.sortDirection,
    });
  };

  const handleSort = (key: keyof keyHeaderListProps | "") => {
    // const isNotSortable =
    //   headerList.find((header) => header.key === key)?.sortable === false;

    // if (isNotSortable) {
    //   setSorting(() => ({
    //     sortBy: "",
    //     sortDirection: ESortDirection.ASC,
    //   }));
    // } else {
    setSorting((prev) => ({
      sortBy: key,
      sortDirection:
        prev.sortBy === key
          ? prev.sortDirection === ESortDirection.ASC
            ? ESortDirection.DESC
            : ESortDirection.ASC
          : prev.sortBy === ""
            ? ESortDirection.DESC
            : ESortDirection.ASC,
    }));

    // }
  };

  // const handleFetchTransactionCoins = async (truckerId: string) => {
  //   const response = await getCoinsByTruckerId(truckerId);
  //   setTransactionCoins(response.data);
  // };

  const handleClickViewIcon = async (id: number) => {
    try {
      const response = await organizationApi.getOrganizationById(id);
      // await handleFetchTransactionCoins(data.truckerId);
      if (response.statusCode === EHttpStatusCode.SUCCESS) {
        const data = response.data;
        setDataById(data);
        setOpenDetailModal(true);
      }
    } catch (error) {
      console.error("Failed to fetch details:", error);
    }
  };

  const handleClickEditIcon = (id: number) => {
    router.push(`${pathName}/${id}`);
  };

  const handleSelectListId = (
    data: IFactoriesAndCompaniesData,
    checked: boolean
  ) => {
    const isCompany = pathName.includes(EAdminPathName.COMPANIES);
    const getSelectedListId = isCompany
      ? getSelectedCompanyListId
      : getSelectedFactoryListId;
    const updatedList = checked
      ? [...getSelectedListId(), data]
      : getSelectedListId().filter((item) => item.id !== data.id);
    pathName.includes(EAdminPathName.COMPANIES)
      ? setSelectedCompanyListId(updatedList)
      : setSelectedFactoryListId(updatedList);

    setSelectedListId(updatedList);
  };

  const handleClickAddUserAdmin = async (data: IOrganization) => {
    const getAllUserAdminList = pathName.includes(EAdminPathName.COMPANIES)
      ? getUserCompanyById
      : getUserFactoryById;
    const response = await getAllUserAdminList(data.id.toString());
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      setAllUserAdminList(response.data);
    }
    setSelectedData(data);
    setOpenModal(true);
  };

  const handleClickBinIcon = (data: IOrganization) => {
    setSelectedOrg(data);
    setOpenDeleteModal(true);
  };

  const handleClickConfirmDelete = async (id: number) => {
    const response = await organizationApi.deleteOrganizationById(id);

    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "การลบรายการเสร็จสมบูรณ์",
      });
      fetchDataList();
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: "การลบรายการไม่สำเร็จ โปรดลองอีกครั้ง",
      });
    }
  };

  const handleChangePage = (page: number) => {
    const paginationUpdated = {
      ...getOrganizationParams(),
      page,
    };
    setOrganizationParams(paginationUpdated);
    getOrganizationsByTypeId(paginationUpdated);
  };

  const handleChangeLimit = (limit: number) => {
    const paginationUpdated = {
      ...getOrganizationParams(),
      page: 1,
      limit,
    };
    setOrganizationParams(paginationUpdated);
    getOrganizationsByTypeId(paginationUpdated);
  };

  const handleClickOpenLatLngModal = (data: IOrganization) => {
    setSelectedData(data);
    setOpenLatLngModal(true);
  };

  const handleClickAddAdminUser = async (userAdminId: string) => {
    console.log(userAdminId);
    // const form: FactoriesAndCompaniesFormInputs = {
    //   ...selectedData,
    //   latitude: selectedData?.address?.latitude
    //     ? selectedData?.address?.latitude.toString()
    //     : "",
    //   longitude: selectedData?.address?.longitude
    //     ? selectedData?.address?.longitude.toString()
    //     : "",
    //   dialCode: selectedData?.dialCode || "",
    //   province: selectedData?.address?.province || "",
    //   district: selectedData?.address?.district || "",
    //   subDistrict: selectedData?.address?.subDistrict || "",
    //   addressLine1: selectedData?.address?.addressLine1 || "",
    //   image: "",
    //   postalCode: selectedData?.address?.postalCode || "",
    //   logoImage: "",
    //   documents: selectedData?.documentUrls || [],
    //   adminUserId: userAdminId,
    //   name: selectedData?.name || "",
    //   businessType: selectedData?.businessType || "",
    //   phone: selectedData?.phone || "",
    //   email: selectedData?.email || "",
    // };
    // // await handleUpdate(form, selectedData!.id, true);
    // await fetchDataList();
    // // setSelectedData({
    // //   ...selectedData,
    // //   admin: { adminUserId: userAdminId, fullName: "" },
    // // });
  };

  const handleSearchAdminUser = (search: string) => {
    if (search) {
      const userAdminList = allUserAdminList.filter(
        (userAdmin) =>
          userAdmin.firstName.toLowerCase().includes(search.toLowerCase()) ||
          userAdmin.lastName.toLowerCase().includes(search.toLowerCase())
      );
      setAllUserAdminList(userAdminList);
    } else {
      handleClickAddUserAdmin(selectedData!);
    }
  };

  return {
    headerList,
    factorysList,
    deleteFactory,
    openDeleteModal,
    setOpenDeleteModal,
    selectedOrg,
    setSelectedOrg,
    handleClickBinIcon,
    getFactoriesById,
    handleClickEditIcon,
    handleSelectListId,
    handleClickAddUserAdmin,
    openDetailModal,
    setOpenDetailModal,
    handleSort,
    pathName,
    handleClickViewIcon,
    getFactoriesData,
    handleSearchAdminUser,
    getAllCompanysList,
    getCompaniesParams,
    dataList,
    setDataList,
    fetchDataList,
    getCompaniesData,
    openModal,
    setOpenModal,
    selectedListId,
    handleClickConfirmDelete,
    setSelectedListId,
    openLatLngModal,
    setOpenLatLngModal,
    handleChangePage,
    handleChangeLimit,
    setSelectedCompanyListId,
    setSelectedFactoryListId,
    handleClickOpenLatLngModal,
    companiesList,
    sorting,
    selectedData,
    handleClickAddAdminUser,
    getCoinsByTruckerData,
    allUserAdminList,
    getFactoriesParams,
    setAllUserAdminList,
    dataById,
  };
}
