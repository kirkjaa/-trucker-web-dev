import { useState } from "react";

import { useQuotationsStore } from "@/app/store/quotationsStore";
import { ESortDirection } from "@/app/types/enum";
import { IMeta, ISort } from "@/app/types/global";
import { IQuotationContractCompany } from "@/app/types/quotationsType";

interface keyHeaderListProps {
  displayCode: string;
  name: string;
  contract: string;
  contractTime: string;
  phone: string;
  email: string;
  address: string;
  actions: string;
}
export default function useShippingCompanyListTable() {
  //#region State
  const headerList = [
    { key: "contractCompany.displayCode", label: "รหัสโรงงาน", width: "12%" },
    { key: "contractCompany.name", label: "ชื่อโรงงาน", width: "14%" },
    { key: "contract", label: "ระยะเวลาสัญญา", width: "13%", sortable: false },
    { key: "contractTime", label: "อายุสัญญา", width: "10%" },
    { key: "phone", label: "เบอร์โทรศัพท์", width: "10%", sortable: false },
    { key: "contractCompany.email", label: "อีเมล", width: "20%" },
    { key: "address", label: "พิกัดสถานที่", width: "16%", sortable: false },
    { key: "actions", label: "", width: "5%", sortable: false },
  ];

  const [sorting, setSorting] = useState<ISort>({
    sortBy: "",
    sortDirection: ESortDirection.ASC,
  });
  const [openModal, setOpenModal] = useState<boolean>(false);
  //#endregion State

  const [dataList, setDataList] = useState<IQuotationContractCompany[]>([]);
  const [selectedData, setSelectedData] = useState<IQuotationContractCompany>();
  const [pagination, setPagination] = useState<IMeta>({
    page: 1,
    limit: 10,
    totalPages: 10,
    total: 0,
  });
  const [openLatLngModal, setOpenLatLngModal] = useState<boolean>(false);
  //#region Store
  const {
    getContractCompanyList,
    getQuotationSearchParams,
    setQuotationSearchParams,
    contractCompanyList,
  } = useQuotationsStore();
  //#endregion Store
  //#region Function
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

  const fetchDataList = async () => {
    const response = await getContractCompanyList(
      getQuotationSearchParams(),
      undefined,
      sorting
    );
    setPagination(response.meta);
    setDataList(response.data);
  };
  const handleClickShowPasswordIcon = (data: IQuotationContractCompany) => {
    setSelectedData(data);
    setOpenModal(true);
  };
  const handleClickOpenLatLngModal = (data: IQuotationContractCompany) => {
    setSelectedData(data);
    setOpenLatLngModal(true);
  };

  const onPaginationChange = (pagination: IMeta) => {
    setQuotationSearchParams({ ...getQuotationSearchParams(), ...pagination });
    fetchDataList();
  };
  const handleChangePage = (page: number) => {
    const paginationUpdated = {
      ...pagination,
      page,
    };
    setPagination(paginationUpdated);
    onPaginationChange(paginationUpdated);
  };

  const handleChangeLimit = (limit: number) => {
    const paginationUpdated = {
      ...pagination,
      limit,
      page: 1,
    };
    setPagination(paginationUpdated);
    onPaginationChange(paginationUpdated);
  };
  //#endregion Function
  return {
    headerList,
    handleSort,
    openModal,
    setOpenModal,
    fetchDataList,
    dataList,
    handleClickShowPasswordIcon,
    selectedData,
    openLatLngModal,
    setOpenLatLngModal,
    handleClickOpenLatLngModal,
    sorting,
    handleChangePage,
    handleChangeLimit,
    pagination,
    getQuotationSearchParams,
    contractCompanyList,
    setDataList,
  };
}
