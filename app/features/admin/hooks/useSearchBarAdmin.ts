import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { usePathname, useRouter } from "next/navigation";

import useDriversListTable from "../drivers/hooks/useDriversListTable";
import useFactoriesAndCompaniesListTable from "../organization/hook/useFactoriesAndCompaniesListTable";
import useSystemUserListTable from "../system-users/hooks/useSystemUserListTable";
import useUploadTemplateCsvListTable from "../upload-template/csv/hooks/useUploadTemplateCsvListTable";

import { toast } from "@/app/components/ui/toast/use-toast";
import { useCompaniesStore } from "@/app/store/companiesStore";
import { useDriverStore } from "@/app/store/driver/driverStore";
import { useDriversStore } from "@/app/store/driversStore";
import { useFactoriesStore } from "@/app/store/factoriesStore";
import { useOrganizationStore } from "@/app/store/organization/organizationStore";
import { usePackageStore } from "@/app/store/package/packageStore";
import { usePackagesStore } from "@/app/store/packagesStore";
import { usePluginStore } from "@/app/store/pluginStore";
import { useRouteStore } from "@/app/store/route/routeStore";
import { useSystemUsersCompanyStore } from "@/app/store/systemUsersCompanyStore";
import { useSystemUsersFactoryStore } from "@/app/store/systemUsersFactoryStore";
import { useTemplateStore } from "@/app/store/template/templateStore";
import { useTruckStore } from "@/app/store/truckStore";
import { useUploadTemplateCsvStore } from "@/app/store/uploadTemplateCsvStore";
import { useUserStore } from "@/app/store/user/userStore";
import { DriversStatus, EAdminPathName, ESearchKey } from "@/app/types/enum";
import { EFreightType, ERouteStatus } from "@/app/types/route/routeEnum";

export default function useSearchBarAdmin() {
  //Global State
  const {
    getSelectedFactoryListId,
    getFactoriesParams,
    factorysList,
    deleteFactory,
    selectedFactoryListId,
    setSelectedFactoryListId,
    getOptionSearchFactory,
  } = useFactoriesStore();
  const {
    companiesList,
    getSelectedCompanyListId,
    deleteCompany,
    selectedCompanyListId,
    setSelectedCompanyListId,
    getCompaniesParams,
    getOptionSearchCompany,
  } = useCompaniesStore();

  const {
    getSystemUserCompanyParams,
    getSelectedSystemUsersCompanyListId,
    deleteSystemUserCompany,
    setSelectedSystemUsersCompanyListId,
    selectedSystemUsersCompanyListId,
    systemUsersCompanyList,
    getOptionSearchSystemUsersCompany,
  } = useSystemUsersCompanyStore();

  const {
    getSystemUserFactoryParams,
    getSelectedSystemUsersFactoryListId,
    deleteSystemUserFactory,
    setSelectedSystemUsersFactoryListId,
    selectedSystemUsersFactoryListId,
    systemUsersFactoryList,
    getOptionSearchSystemUsersFactory,
  } = useSystemUsersFactoryStore();

  const {
    getSelectedList,
    setSelectedList,
    deleteDriver,
    driversData,
    getDriversData,
    getDriversParams,
    getOptionSearchSystemUsersDriver,
  } = useDriversStore();

  /* const { */
  /*   setOpenCreateModal, */
  /*   getRouteList, */
  /*   getFormCreate, */
  /*   createManyRoute, */
  /*   confirmedRoute, */
  /*   getRouteParams, */
  /*   checkDuplicateRoute, */
  /*   validateBuildDataCreate, */
  /* } = useRouteStore(); */

  const {
    setSelectedUploadTemplateCsvListData,
    setOpenModalUploadTemplateCsv,
    getSelectedUploadTemplateCsvListData,
    deleteTemplateCsv,
    selectedUploadTemplateCsvListData,
    getUploadTemplateCsvList,
    // getTemplateFactoryById,
    getOptionSearchUploadTemplateCsv,
    // getAllUploadTemplateCsvList,
    getUploadTemplateCsvParams,
  } = useUploadTemplateCsvStore();

  const {
    /* setOpenPackageModal, */
    getPackagesListData,
    setDisabled,
    // getAllPackageList,
    /* getPackageParams, */
    getOptionSearchPackage,
  } = usePackagesStore();

  const { setOpenModal } = useTruckStore();

  const { getOrganizationsByTypeId, getOrganizationParams } =
    useOrganizationStore((state) => ({
      getOrganizationsByTypeId: state.getOrganizationsByTypeId,
      getOrganizationParams: state.getOrganizationParams,
    }));
  const { getAllUserByTypeId, getUserParams } = useUserStore((state) => ({
    getAllUserByTypeId: state.getAllUserByTypeId,
    getUserParams: state.getUserParams,
  }));
  const { getDriversInternal, getDriversFreelance, getDriverParams } =
    useDriverStore((state) => ({
      getDriversInternal: state.getDriversInternal,
      getDriversFreelance: state.getDriversFreelance,
      getDriverParams: state.getDriverParams,
    }));
  const { getAllPackages, getPackageParams, setOpenPackageModal } =
    usePackageStore((state) => ({
      getAllPackages: state.getAllPackages,
      getPackageParams: state.getPackageParams,
      setOpenPackageModal: state.setOpenPackageModal,
    }));
  const {
    getAllRoutes,
    getAllRoutesByStatus,
    getRouteParams,
    setOpenCreateModal,
  } = useRouteStore((state) => ({
    getAllRoutes: state.getAllRoutes,
    getAllRoutesByStatus: state.getAllRoutesByStatus,
    getRouteParams: state.getRouteParams,
    setOpenCreateModal: state.setOpenCreateModal,
  }));
  const { getAllTemplates, getTemplateParams } = useTemplateStore((state) => ({
    getAllTemplates: state.getAllTemplates,
    getTemplateParams: state.getTemplateParams,
  }));
  const { getAllPlugins, getPluginParams } = usePluginStore((state) => ({
    getAllPlugins: state.getAllPlugins,
    getPluginParams: state.getPluginParams,
  }));

  //Local State
  const [search, setSearch] = useState<string>("");
  const [openModalDeleteList, setOpenModalDeleteList] =
    useState<boolean>(false);
  const [byName, setByName] = useState<boolean>(true);
  const [byDisplayCode, setByDisplayCode] = useState<boolean>(true);
  const [dataCount, setDataCount] = useState<number>(0);
  const [selectedListId, setSelectedListId] = useState<any[]>([]);
  const [visibleBtnPlus, setVisibleBtnPlus] = useState<boolean>(true);

  const [visibleBtnFilter, setVisibleBtnFilter] = useState<boolean>(true);
  const [visibleBtnIconPlus, setVisibleBtnIconPlus] = useState<boolean>(true);
  const [btnPlusText, setBtnPlusText] = useState<string>("");
  const [visibleBtnAddRoute, setVisibleBtnAddRoute] = useState<boolean>(false);
  const [visibleImportCsv, setVisibleImportCsv] = useState<boolean>(false);
  const [visibleDowloadTemplate, setVisibleDowloadTemplate] =
    useState<boolean>(false);
  const [optionSearch, setOptionSearch] = useState<string[]>([]);
  const [searchKey, setSearchKey] = useState<string[]>([]);

  // Hook
  const { fetchDataList: fetchDataFactoriesAndCompaniesList } =
    useFactoriesAndCompaniesListTable();
  const { fetchDataList: fetchDataSystemUserList } = useSystemUserListTable();
  const { fetchDataList: fetchDataDriversList } = useDriversListTable();
  const { fetchDataList: fetchDataUploadTemplateCsvList } =
    useUploadTemplateCsvListTable();
  const router = useRouter();
  const pathName = usePathname();
  const isFirstRun = useRef(true);

  const debouncedSearch = useCallback(
    debounce(() => {
      switch (pathName) {
        case EAdminPathName.COMPANIES:
          getOrganizationsByTypeId({
            page: 1,
            limit: getOrganizationParams().limit,
            typeId: 2,
            search,
          });
          break;
        case EAdminPathName.FACTORIES:
          getOrganizationsByTypeId({
            page: 1,
            limit: getOrganizationParams().limit,
            typeId: 1,
            search,
          });
          break;
        case EAdminPathName.SYSTEMUSERSCOMPANIES:
          getAllUserByTypeId({
            page: 1,
            limit: getUserParams().limit,
            organizationTypeId: 2,
            search,
          });
          break;
        case EAdminPathName.SYSTEMUSERSFACTORIES:
          getAllUserByTypeId({
            page: 1,
            limit: getUserParams().limit,
            organizationTypeId: 1,
            search,
          });
          break;
        case EAdminPathName.DRIVERSINTERNAL:
          getDriversInternal({
            page: 1,
            limit: getDriverParams().limit,
            search,
          });
          break;
        case EAdminPathName.DRIVERSFREELANCE:
          getDriversFreelance({
            page: 1,
            limit: getDriverParams().limit,
            status: DriversStatus.APPROVE,
            search,
          });
          break;
        case EAdminPathName.DRIVERSREVIEWFREELANCE:
          getDriversFreelance({
            page: 1,
            limit: getDriverParams().limit,
            status: DriversStatus.PENDING,
            search,
          });
          break;
        case EAdminPathName.PACKAGES:
          getAllPackages({
            page: 1,
            limit: getPackageParams().limit,
            search,
          });
          break;
        case EAdminPathName.DOMESTICROUTE:
          getAllRoutes({
            page: 1,
            limit: getRouteParams().limit,
            freight_type: EFreightType.DOMESTIC,
            search,
          });
          break;
        case EAdminPathName.INTERNATIONALROUTE:
          getAllRoutes({
            page: 1,
            limit: getRouteParams().limit,
            freight_type: EFreightType.INTERNATIONAL,
            search,
          });
          break;
        case EAdminPathName.CONFIRMDOMESTICROUTE:
          getAllRoutesByStatus({
            page: 1,
            limit: getRouteParams().limit,
            freight_type: EFreightType.DOMESTIC,
            status: ERouteStatus.PENDING,
            search,
          });
          break;
        case EAdminPathName.CONFIRMINTERNATIONALROUTE:
          getAllRoutesByStatus({
            page: 1,
            limit: getRouteParams().limit,
            freight_type: EFreightType.INTERNATIONAL,
            status: ERouteStatus.PENDING,
            search,
          });
          break;
        case EAdminPathName.UPLOADTEMPLATECSV:
          getAllTemplates({
            page: 1,
            limit: getTemplateParams().limit,
            search,
          });
          break;
        case EAdminPathName.PLUGIN:
          getAllPlugins({
            page: 1,
            limit: getPluginParams().limit,
            search,
          });
          break;
      }
    }, 300),
    [search]
  );

  // Use Effect
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    /* if (search.length === 0) return; */

    debouncedSearch();
    return () => {
      debouncedSearch.cancel();
    };
  }, [search]);

  useEffect(() => {
    switch (pathName) {
      case EAdminPathName.COMPANIES:
        setDataCount(getOrganizationParams().total ?? 0);
        // optionSearchKey = getOptionSearchCompany();
        setBtnPlusText("เพิ่มบริษัทขนส่ง");
        break;
      case EAdminPathName.FACTORIES:
        setDataCount(getOrganizationParams().total ?? 0);
        setBtnPlusText("เพิ่มโรงงาน");
        // optionSearchKey = getOptionSearchFactory();
        break;
      case EAdminPathName.SYSTEMUSERSCOMPANIES:
        setDataCount(getUserParams().total ?? 0);
        setBtnPlusText("เพิ่มผู้ใช้งาน");
        // optionSearchKey = getOptionSearchSystemUsersCompany();
        break;
      case EAdminPathName.SYSTEMUSERSFACTORIES:
        setDataCount(getUserParams().total ?? 0);
        setBtnPlusText("เพิ่มผู้ใช้งาน");
        // optionSearchKey = getOptionSearchSystemUsersFactory();
        break;
      case EAdminPathName.DRIVERSINTERNAL:
        setDataCount(getDriverParams().total ?? 0);
        setBtnPlusText("เพิ่มคนขับรถภายใน");
        //   optionSearchKey = getOptionSearchSystemUsersDriver();
        break;
      case EAdminPathName.DRIVERSFREELANCE:
        setDataCount(getDriverParams().total ?? 0);
        setBtnPlusText("เพิ่มคนขับรถอิสระ");
        //   optionSearchKey = [ESearchKey.DISPLAYCODE];
        break;
      case EAdminPathName.DRIVERSREVIEWFREELANCE:
        setDataCount(getDriverParams().total ?? 0);
        setVisibleBtnFilter(false);
        setVisibleBtnPlus(false);
        //   optionSearchKey = getOptionSearchSystemUsersDriver();
        break;
      case EAdminPathName.CONFIRMDOMESTICROUTE ||
        EAdminPathName.CONFIRMINTERNATIONALROUTE:
        setDataCount(getRouteParams().total ?? 0);
        setBtnPlusText("ยืนยันการบันทึกรหัสเส้นทาง");
        setVisibleBtnIconPlus(false);
        break;
      case EAdminPathName.DOMESTICROUTE:
        setDataCount(getRouteParams().total ?? 0);
        setBtnPlusText("เพิ่มรหัสเส้นทางในประเทศ");
        setVisibleBtnIconPlus(true);
        break;
      case EAdminPathName.INTERNATIONALROUTE:
        setDataCount(getRouteParams().total ?? 0);
        setBtnPlusText("เพิ่มรหัสเส้นทางต่างประเทศ");
        setVisibleBtnIconPlus(true);
        break;
      // case pathName === EAdminPathName.CREATEDOMESTICROUTE ||
      //   pathName === EAdminPathName.CREATEINTERNATIONALROUTE:
      //   count = getFormCreate()?.length || 0;
      //   setBtnPlusText("บันทึกรหัสเส้นทาง");
      //   setVisibleBtnAddRoute(true);
      //   setVisibleImportCsv(true);
      //   setVisibleDowloadTemplate(true);
      //   setVisibleBtnFilter(false);
      //   break;
      case EAdminPathName.UPLOADTEMPLATECSV:
        setDataCount(getTemplateParams().total ?? 0);
        setBtnPlusText("เพิ่ม");
        setVisibleBtnFilter(false);
        //   optionSearchKey = getOptionSearchUploadTemplateCsv();
        break;
      case EAdminPathName.PLUGIN:
        setDataCount(getPluginParams().total ?? 0);
        setBtnPlusText("เพิ่มปลั๊กอิน");
        setVisibleBtnFilter(false);
        break;
      case EAdminPathName.PACKAGES:
        setDataCount(getPackageParams().total ?? 0);
        setBtnPlusText("เพิ่มแพ็กเกจ");
        setVisibleBtnPlus(true);
        setVisibleBtnFilter(false);
        /* optionSearchKey = getOptionSearchPackage(); */
        break;
      // case pathName === EAdminPathName.COINS:
      //   setVisibleBtnFilter(false);
      //   setVisibleBtnPlus(false);
      //   break;
      // case pathName === EAdminPathName.TRUCKTYPES:
      //   setVisibleBtnFilter(false);
      //   setBtnPlusText("เพิ่มประเภทรถบรรทุก");
      //   break;
      // case pathName === EAdminPathName.TRUCKSIZES:
      //   setVisibleBtnFilter(false);
      //   setBtnPlusText("เพิ่มขนาดรถบรรทุก");
      //   break;
      // case pathName === EAdminPathName.DATAUSERS:
      //   setVisibleBtnPlus(false);
      //   break;
      // case pathName === EAdminPathName.PLUGIN:
      //   setVisibleBtnFilter(false);
      //   setBtnPlusText("เพิ่มปลั๊กอิน");
      //   break;
      // default:
      //   count = 0;
    }
    // setOptionSearch(optionSearchKey);
    // setSearchKey(optionSearchKey);
  }, [
    pathName,
    getOrganizationParams().total,
    getUserParams().total,
    getDriverParams().total,
    getRouteParams().total,
    getPackageParams().total,
    getTemplateParams().total,
    getPluginParams().total,
  ]);

  //Function
  const handleClickOpenModalCreateRoute = () => {
    /* setOpenCreateModal(true); */
  };

  const handleClearSearch = () => {
    let optionSearchKey: ESearchKey[] = [];
    switch (true) {
      case pathName === EAdminPathName.COMPANIES:
        optionSearchKey = getOptionSearchCompany();

        break;
      case pathName === EAdminPathName.FACTORIES:
        optionSearchKey = getOptionSearchFactory();
        break;
      case pathName === EAdminPathName.SYSTEMUSERSCOMPANIES:
        optionSearchKey = getOptionSearchSystemUsersCompany();
        break;
      case pathName === EAdminPathName.SYSTEMUSERSFACTORIES:
        optionSearchKey = getOptionSearchSystemUsersFactory();
        break;
      case pathName === EAdminPathName.DRIVERSINTERNAL:
        optionSearchKey = getOptionSearchSystemUsersDriver();
        break;
      case pathName === EAdminPathName.DRIVERSFREELANCE:
        optionSearchKey = [ESearchKey.DISPLAYCODE];
        break;
      case pathName === EAdminPathName.DRIVERSREVIEWFREELANCE:
        optionSearchKey = getOptionSearchSystemUsersDriver();
        break;

      case pathName === EAdminPathName.UPLOADTEMPLATECSV:
        optionSearchKey = getOptionSearchUploadTemplateCsv();
        break;
      case pathName === EAdminPathName.PLUGIN:
        optionSearchKey = [];
        break;
      case pathName === EAdminPathName.PACKAGES:
        optionSearchKey = getOptionSearchPackage();
        break;
    }

    setSearchKey(optionSearchKey);
  };

  const createRoute = async () => {
    /* const filteredFormData = await validateBuildDataCreate(getFormCreate()); */
    /**/
    /* const response = await createManyRoute(filteredFormData); */
    /* if (response.statusCode === EHttpStatusCode.CREATED) { */
    /*   toast({ */
    /*     icon: "ToastSuccess", */
    /*     variant: "success", */
    /*     description: "บันทึกสำเร็จ", */
    /*     descriptionTwo: "'รายการดำเนินการอยู่'", */
    /*   }); */
    /**/
    /*   router.replace( */
    /*     pathName.includes(EAdminPathName.INTERNATIONALROUTE) */
    /*       ? EAdminPathName.CONFIRMINTERNATIONALROUTE */
    /*       : EAdminPathName.CONFIRMDOMESTICROUTE */
    /*   ); */
    /* } else { */
    /*   toast({ */
    /*     icon: "ToastError", */
    /*     variant: "error", */
    /*     description: response.message.th, */
    /*   }); */
    /* } */
  };

  const confirmRoute = async () => {
    /* const ids = getRouteList().map((item) => item.id); */
    /* const response = await confirmedRoute(ids); */
    /* if (response.statusCode === EHttpStatusCode.SUCCESS) { */
    /*   toast({ */
    /*     icon: "ToastSuccess", */
    /*     variant: "success", */
    /*     description: "บันทึกสำเร็จ", */
    /*     descriptionTwo: "'รายการดำเนินการอยู่'", */
    /*   }); */
    /*   if (pathName.includes(EAdminPathName.CONFIRMINTERNATIONALROUTE)) { */
    /*     router.replace(`${EAdminPathName.INTERNATIONALROUTE}`); */
    /*   } else { */
    /*     router.replace(`${EAdminPathName.DOMESTICROUTE}`); */
    /*   } */
    /* } else { */
    /*   toast({ */
    /*     icon: "ToastError", */
    /*     variant: "error", */
    /*     description: response.message.th, */
    /*   }); */
    /* } */
  };

  const getSelectedListId = () => {
    if (pathName === EAdminPathName.SYSTEMUSERSCOMPANIES) {
      return getSelectedSystemUsersCompanyListId();
    } else if (pathName === EAdminPathName.SYSTEMUSERSFACTORIES) {
      return getSelectedSystemUsersFactoryListId();
    } else if (pathName === EAdminPathName.COMPANIES) {
      return getSelectedCompanyListId();
    } else if (pathName === EAdminPathName.FACTORIES) {
      return getSelectedFactoryListId();
    } else if (
      pathName === EAdminPathName.DRIVERSINTERNAL ||
      pathName === EAdminPathName.DRIVERSFREELANCE
    ) {
      return getSelectedList();
    } else if (pathName === EAdminPathName.UPLOADTEMPLATECSV) {
      return getSelectedUploadTemplateCsvListData();
    }

    return [];
  };

  const handleClickCreate = () => {
    if (
      pathName.includes(EAdminPathName.CONFIRMDOMESTICROUTE) ||
      pathName.includes(EAdminPathName.CONFIRMINTERNATIONALROUTE)
    ) {
      confirmRoute();
    } else if (
      pathName.includes(EAdminPathName.CREATEDOMESTICROUTE) ||
      pathName.includes(EAdminPathName.CREATEINTERNATIONALROUTE)
    ) {
      createRoute();
    } else if (
      pathName.includes(EAdminPathName.DOMESTICROUTE) ||
      pathName.includes(EAdminPathName.INTERNATIONALROUTE)
    ) {
      setOpenCreateModal(true);
    } else if (pathName.includes(EAdminPathName.UPLOADTEMPLATECSV)) {
      setOpenModalUploadTemplateCsv(true);
    } else if (pathName.includes(EAdminPathName.PACKAGES)) {
      setDisabled(false);
      setOpenPackageModal(true);
    } else if (
      pathName.includes(EAdminPathName.TRUCKTYPES) ||
      pathName.includes(EAdminPathName.TRUCKSIZES)
    ) {
      setOpenModal(true);
    } else {
      router.push(`${pathName}/create`);
    }
  };

  const handleClickConfirmDelete = async (ids: string[]) => {
    let response = null;

    if (pathName === EAdminPathName.COMPANIES) {
      response = await deleteCompany(ids);
      if (response?.statusCode === 200) {
        await fetchDataFactoriesAndCompaniesList();
      }
    } else if (pathName === EAdminPathName.FACTORIES) {
      response = await deleteFactory(ids);
      if (response?.statusCode === 200) {
        await fetchDataFactoriesAndCompaniesList();
      }
    } else if (pathName === EAdminPathName.SYSTEMUSERSCOMPANIES) {
      response = await deleteSystemUserCompany(ids);
      if (response?.statusCode === 200) {
        await fetchDataSystemUserList();
      }
    } else if (pathName === EAdminPathName.SYSTEMUSERSFACTORIES) {
      response = await deleteSystemUserFactory(ids);
      if (response?.statusCode === 200) {
        await fetchDataSystemUserList();
      }
    } else if (
      pathName === EAdminPathName.DRIVERSINTERNAL ||
      pathName === EAdminPathName.DRIVERSFREELANCE
    ) {
      response = await deleteDriver(ids);
      if (response?.statusCode === 200) {
        await fetchDataDriversList();
      }
    } else if (pathName === EAdminPathName.UPLOADTEMPLATECSV) {
      response = await deleteTemplateCsv(ids);
      if (response?.statusCode === 200) {
        await fetchDataUploadTemplateCsvList();
      }
    }
    if (response?.statusCode === 200) {
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
    setSelectedListId([]);
    setSelectedFactoryListId([]);
    setSelectedCompanyListId([]);
    setSelectedSystemUsersCompanyListId([]);
    setSelectedSystemUsersFactoryListId([]);
    setSelectedList([]);
    setSelectedUploadTemplateCsvListData([]);
  };

  const onClickDeleteList = () => {
    if (pathName === EAdminPathName.COMPANIES) {
      setSelectedListId(selectedCompanyListId);
    } else if (pathName === EAdminPathName.FACTORIES) {
      setSelectedListId(selectedFactoryListId);
    } else if (pathName === EAdminPathName.SYSTEMUSERSCOMPANIES) {
      setSelectedListId(selectedSystemUsersCompanyListId);
    } else if (pathName === EAdminPathName.SYSTEMUSERSFACTORIES) {
      setSelectedListId(selectedSystemUsersFactoryListId);
    } else if (
      pathName === EAdminPathName.DRIVERSINTERNAL ||
      pathName === EAdminPathName.DRIVERSFREELANCE
    ) {
      setSelectedListId(selectedSystemUsersFactoryListId);
    } else if (pathName === EAdminPathName.UPLOADTEMPLATECSV) {
      setSelectedListId(selectedUploadTemplateCsvListData);
    }

    setOpenModalDeleteList(true);
  };

  const handleCheckSearchKey = (key: string) => {
    const newKey = searchKey.includes(key)
      ? searchKey.filter((e) => e !== key)
      : [...searchKey, key];
    setSearchKey(newKey);
  };

  const handleClearFilter = () => {
    setSearch("");
    setSearchKey([]);
    setByName(false);
    setByDisplayCode(false);
  };

  const handleDownloadTemplate = async () => {
    /* const formCreate = getFormCreate(); */
    /**/
    /* if (!Array.isArray(formCreate) || formCreate.length === 0) { */
    /*   console.warn("getFormCreate returned an empty or invalid array"); */
    /*   return; */
    /* } */
    /**/
    /* const { factoryId } = formCreate[0]; */
    /**/
    /* if (!factoryId) { */
    /*   console.warn("Factory ID is missing"); */
    /*   return; */
    /* } */
    /**/
    /* try { */
    /*   const response = await getTemplateFactoryById(factoryId); */
    /**/
    /*   const templateRow = response.data.customerColumns.reduce( */
    /*     (acc, key) => { */
    /*       acc[key] = ""; */
    /*       return acc; */
    /*     }, */
    /*     {} as Record<string, string> */
    /*   ); */
    /**/
    /*   const worksheet = XLSX.utils.json_to_sheet([templateRow]); */
    /*   const workbook = XLSX.utils.book_new(); */
    /*   XLSX.utils.book_append_sheet(workbook, worksheet, "Template"); */
    /**/
    /*   XLSX.writeFile(workbook, `template-${response.data.factory.name}.xlsx`); */
    /*   console.log("Excel template generated successfully"); */
    /* } catch (error) { */
    /*   console.error("Error in handleDownloadTemplate:", error); */
    /* } */
  };

  return {
    handleClickCreate,
    search,
    setSearch,
    pathName,
    dataCount,
    getSelectedListId,
    handleClickConfirmDelete,
    openModalDeleteList,
    setOpenModalDeleteList,
    onClickDeleteList,
    selectedListId,
    handleCheckSearchKey,
    byDisplayCode,
    byName,
    // handleSearch,
    setDataCount,
    getFactoriesParams,
    getCompaniesParams,
    companiesList,
    factorysList,
    handleClearFilter,
    systemUsersFactoryList,
    systemUsersCompanyList,
    driversData,
    visibleBtnPlus,
    setVisibleBtnPlus,
    visibleBtnFilter,
    setVisibleBtnFilter,
    getDriversData,
    btnPlusText,
    setBtnPlusText,
    /* getRouteList, */
    /* getFormCreate, */
    visibleBtnIconPlus,
    setVisibleBtnIconPlus,
    getUploadTemplateCsvList,
    visibleBtnAddRoute,
    setVisibleBtnAddRoute,
    handleClickOpenModalCreateRoute,
    visibleImportCsv,
    setVisibleImportCsv,
    visibleDowloadTemplate,
    setVisibleDowloadTemplate,
    handleDownloadTemplate,
    getPackagesListData,
    setDisabled,
    optionSearch,
    setOptionSearch,
    getOptionSearchFactory,
    searchKey,
    setSearchKey,
    getOptionSearchCompany,

    getOptionSearchSystemUsersFactory,
    getOptionSearchSystemUsersCompany,
    getOptionSearchSystemUsersDriver,
    getOptionSearchPackage,
    getOptionSearchUploadTemplateCsv,
    getSystemUserCompanyParams,
    getSystemUserFactoryParams,
    getDriversParams,
    getRouteParams,
    getUploadTemplateCsvParams,
    getPackageParams,
    handleClearSearch,
  };
}
