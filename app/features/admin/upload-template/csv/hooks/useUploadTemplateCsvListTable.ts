import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { templateApi } from "@/app/services/template/templateApi";
import { useTemplateStore } from "@/app/store/template/templateStore";
import { useUploadTemplateCsvStore } from "@/app/store/uploadTemplateCsvStore";
import { EHttpStatusCode, ESortDirection } from "@/app/types/enum";
import { ISort } from "@/app/types/global";
import { ITemplate } from "@/app/types/template/templateType";
import { IUploadTemplateCsvData } from "@/app/types/uploadTemplateCsvType";
import { parseCSV } from "@/app/utils/parseCsv";

interface keyHeaderListProps {
  selected: string;
  name: string;
  actions: string;
}

export default function useUploadTemplateCsvListTable() {
  // Global State
  const {
    getAllTemplates,
    getTemplateParams,
    setTemplateParams,
    getUploadTemplateCsvDetailData,
    setUploadTemplateCsvDetailData,
  } = useTemplateStore((state) => ({
    getAllTemplates: state.getAllTemplates,
    getTemplateParams: state.getTemplateParams,
    setTemplateParams: state.setTemplateParams,
    getUploadTemplateCsvDetailData: state.getUploadTemplateCsvDetailData,
    setUploadTemplateCsvDetailData: state.setUploadTemplateCsvDetailData,
  }));
  const {
    // getAllUploadTemplateCsvList,
    getOpenModalUploadTemplateCsv,
    setOpenModalUploadTemplateCsv,
    /* getUploadTemplateCsvDetailData, */
    /* setUploadTemplateCsvDetailData, */
    setOpenModalUploadTemplateCsvDetail,
    getOpenModalUploadTemplateCsvDetail,
    // deleteTemplateCsv,
    // setUploadTemplateCsvParams,
    // getUploadTemplateCsvParams,
    setSelectedUploadTemplateCsvListData,
    getSelectedUploadTemplateCsvListData,
    // setUploadTemplateCsvList,
    getUploadTemplateCsvList,
  } = useUploadTemplateCsvStore();

  //Local State
  const [dataById, setDataById] = useState<ITemplate>();
  const [dataList, setDataList] = useState<IUploadTemplateCsvData[]>([]);
  const [selectedListData, setSelectedListData] = useState<
    IUploadTemplateCsvData[]
  >([]);
  const [selectedData, setSelectedData] = useState<ITemplate>();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // const [pagination, setPagination] = useState<IMeta>({
  //   page: 1,
  //   limit: 10,
  //   total: 0,
  // });
  const [sorting, setSorting] = useState<ISort>({
    sortBy: "",
    sortDirection: ESortDirection.ASC,
  });
  const [openViewModal, setOpenViewModal] = useState(false);
  const headerList = [
    /* { */
    /*   key: "selected", */
    /*   label: "#", */
    /*   width: "6%", */
    /*   sortable: false, */
    /* }, */
    {
      key: "name",
      label: "ชื่อไฟล์",
      width: "78%",
    },
    {
      key: "actions",
      label: "",
      width: "16%",
      sortable: false,
    },
  ];

  // Hook
  const router = useRouter();
  const pathName = usePathname();
  const { toast } = useToast();

  //Function
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
    await getAllTemplates({
      page: 1,
      limit: 10,
      sort: sorting.sortBy,
      order: sorting.sortDirection,
    });
  };

  const handleClickImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsedData = parseCSV(content);
      setUploadTemplateCsvDetailData(parsedData);
      setOpenModalUploadTemplateCsv(false);
      setOpenModalUploadTemplateCsvDetail(true);
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    reader.readAsText(file);
  };

  const handleClickConfirm = () => {
    setOpenModalUploadTemplateCsvDetail(false);
    router.replace(pathName + "/create");
  };

  const handleClickViewIcon = async (id: number) => {
    const response = await templateApi.getTemplateById(id);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      setOpenViewModal(true);
      setDataById(response.data);
    }
  };

  const handleClickConfirmDelete = async (id: number) => {
    const response = await templateApi.deleteTemplate(id);
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

  const handleClickBinIcon = (data: ITemplate) => {
    setSelectedData(data);
    setOpenDeleteModal(true);
  };

  const handleChangePage = (page: number) => {
    const paginationUpdated = {
      ...getTemplateParams(),
      page,
    };
    setTemplateParams(paginationUpdated);
    getAllTemplates(paginationUpdated);
  };

  const handleChangeLimit = (limit: number) => {
    const paginationUpdated = {
      ...getTemplateParams(),
      limit,
      page: 1,
    };
    setTemplateParams(paginationUpdated);
    getAllTemplates(paginationUpdated);
  };

  const hamdleClickEditIcon = (id: number) => {
    router.replace(`${pathName}/${id}`);
  };

  const handleSelectListId = (
    data: IUploadTemplateCsvData,
    checked: boolean
  ) => {
    const updatedList = checked
      ? [...getSelectedUploadTemplateCsvListData(), data]
      : getSelectedUploadTemplateCsvListData().filter(
          (item) => item.id !== data.id
        );
    setSelectedUploadTemplateCsvListData(updatedList);
    setSelectedListData(updatedList);
  };

  return {
    headerList,
    fetchDataList,
    handleSort,
    getOpenModalUploadTemplateCsv,
    setOpenModalUploadTemplateCsv,
    handleClickImport,
    handleFileUpload,
    fileInputRef,
    getUploadTemplateCsvDetailData,
    getOpenModalUploadTemplateCsvDetail,
    setOpenModalUploadTemplateCsvDetail,
    handleClickConfirm,
    dataList,
    openViewModal,
    setOpenViewModal,
    handleClickViewIcon,
    handleClickBinIcon,
    handleClickConfirmDelete,
    openDeleteModal,
    setOpenDeleteModal,
    selectedData,
    hamdleClickEditIcon,
    handleChangePage,
    handleChangeLimit,
    // pagination,
    handleSelectListId,
    selectedListData,
    getUploadTemplateCsvList,
    setDataList,
    sorting,
    dataById,
  };
}
