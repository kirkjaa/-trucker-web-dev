import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { organizationApi } from "@/app/services/organization/organizationApi";
import { templateApi } from "@/app/services/template/templateApi";
import { useRouteStore } from "@/app/store/routeStore";
import { EAdminPathName, EHttpStatusCode } from "@/app/types/enum";
import { IOrganization } from "@/app/types/organization/organizationType";
import { IUploadTemplateCsvDetailData, parseCSV } from "@/app/utils/parseCsv";
import { RouteFormInputs } from "@/app/utils/validate/route-validate";

export default function useCreateRouteModal() {
  // Global State
  const { setFormCreate, setOpenCreateModal, getFormCreate, setDuplicateData } =
    useRouteStore();

  // Local State
  const [formType, setFormType] = useState<"import" | "form">();
  const [optionFactory, setOptionFactory] = useState<IOrganization[]>([]);
  const [selectedFactory, setSelectedFactory] = useState<IOrganization>();
  const [headerImport, setHeaderImport] = useState<
    {
      key: string;
      label: string;
      width: string;
    }[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [dataImport, setDataImport] = useState<Record<string, any>[]>([]);
  const [disabledImportBtn, setDisabledImportBtn] = useState<boolean>(true);
  const [warningImport, setWarningImport] = useState<boolean>(false);
  const [searchFactory, setSearchFactory] = useState<string>("");

  // Hook
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const pathName = usePathname();

  // Function
  const fetchOptionFactory = async () => {
    const response = await organizationApi.getOrganizationsByTypeId({
      page: 1,
      limit: 10,
      search: searchFactory,
    });
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      setOptionFactory(response.data);
    }
  };

  const handleSetFormType = async (formType: "import" | "form") => {
    if (formType === "import") {
      handleClickImport();
    } else {
      setFormType(formType);
    }
  };

  const onClickCancel = () => {
    setFormType(undefined);
  };

  const handleClickImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    fileInputRef.current?.click();
  };

  const onFactoryIdChange = async (id: string) => {
    const factory = optionFactory?.find(
      (item) => String(item.id) === String(id)
    );
    setSelectedFactory(factory);

    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      setWarningImport(true);
      setDisabledImportBtn(true);
      return;
    }

    const validateTemplate = await templateApi.getTemplateByOrganization(
      "ROUTE",
      numericId
    );
    if (validateTemplate !== null) {
      setWarningImport(false);
      setDisabledImportBtn(false);
    } else {
      setWarningImport(true);
      setDisabledImportBtn(true);
    }
  };

  const handlePrepareColumn = async (data: IUploadTemplateCsvDetailData) => {
    console.log(data);
    /* console.log("handlePrepareColumn", data); */
    /* const factoryId = selectedFactory */
    /*   ? selectedFactory.id */
    /*   : getFormCreate()[0].factoryId!; */
    /* console.log(getFormCreate()); */
    /* const response = await getTemplate(factoryId); */
    /* if (!response) return; */
    /* console.log(response); */
    /* const { customerColumns, mappedColumns } = response.data; */
    /**/
    /* // ตรวจสอบว่าหัวข้อไฟล์ตรงกัน */
    /* const csvHeaders = Object.keys(data.data[0]); */
    /* const isValid = customerColumns.every((col) => csvHeaders.includes(col)); */
    /* if (!isValid) { */
    /*   setErrorMessage("CSV headers do not match template"); */
    /*   return; */
    /* } */
    /**/
    /* // ทำการ map ข้อมูลจาก CSV */
    /* const mappedData = data.data.map((row) => { */
    /*   const mappedRow: Record<string, any> = {}; */
    /*   customerColumns.forEach((col, index) => { */
    /*     const mappedKey = mappedColumns[index]; */
    /*     if (mappedKey) { */
    /*       mappedRow[mappedKey] = row[col]; */
    /*     } */
    /*   }); */
    /*   return mappedRow; */
    /* }); */
    /* console.log("Mapped Data:", mappedData); */
    /**/
    /* setDataImport([...dataImport, ...mappedData]); */
    /* if (pathName.includes("create")) { */
    /*   const formCreate: RouteFormInputs[] = [ */
    /*     ...dataImport, */
    /*     ...mappedData, */
    /*   ] as RouteFormInputs[]; */
    /*   const validatedData = await validateBuildDataCreate(formCreate); */
    /*   if (validatedData.length > 0) { */
    /*     setFormCreate(validatedData); */
    /*   } */
    /*   if (getDuplicateData().length > 0) { */
    /*     setErrorMessage( */
    /*       `${getDuplicateData() */
    /*         .map((d) => d.routeFactoryCode) */
    /*         .join(",")} มีอยู่ในระบบแล้ว` */
    /*     ); */
    /*   } */
    /* } */
    /* console.log("Mapped Data:", mappedData); */
    /**/
    /* if (mappedData.length > 0) { */
    /*   // สร้าง header โดยใช้ mapping ระหว่าง customerColumns -> mappedColumns */
    /*   const headers = mappedColumns */
    /*     .map((mappedKey, index) => ({ */
    /*       key: mappedKey, // key ที่ map ได้ */
    /*       label: customerColumns[index], // หัว column จาก CSV */
    /*       width: "150px", */
    /*     })) */
    /*     .filter((header) => header.key); // ตัด key ที่เป็น undefined ออก */
    /**/
    /*   console.log("Headers:", headers); */
    /*   setHeaderImport(headers); */
    /* } */
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      setFormType("import");
      setDuplicateData([]);
      const content = e.target?.result as string;
      const parsedData = parseCSV(content);

      await handlePrepareColumn(parsedData);
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    reader.readAsText(file);
  };

  const handleClickCreate = () => {
    const CREATE_PATH = "create";
    console.log("Form data:", dataImport);
    dataImport.map((data) => {
      data.factoryId = selectedFactory?.id;
    });
    setFormCreate(dataImport as RouteFormInputs[]);
    setOpenCreateModal(false);
    router.push(`${pathName}/${CREATE_PATH}`);
  };

  const handleClickImportCsv = () => {
    setOpenCreateModal(false);
    router.push(EAdminPathName.UPLOADTEMPLATECSV);
  };

  const resetFormState = () => {
    setFormType(undefined);
    setErrorMessage("");
    setDataImport([]);
    setHeaderImport([]);
  };

  const updateSelectedFactory = (idFactory: string | undefined) => {
    console.log(idFactory);
    /* const factory = idFactory */
    /*   ? optionFactory?.find((item) => item.id === idFactory) */
    /*   : getFormCreate()?.[0]?.factoryId */
    /*     ? optionFactory?.find( */
    /*         (item) => item.id === getFormCreate()[0].factoryId */
    /*       ) */
    /*     : undefined; */
    /**/
    /* setSelectedFactory(factory); */
  };

  return {
    formType,
    setFormType,
    fileInputRef,
    handleSetFormType,
    onClickCancel,
    fetchOptionFactory,
    setSelectedFactory,
    optionFactory,
    setOptionFactory,
    selectedFactory,
    handleFileUpload,
    headerImport,
    dataImport,
    handleClickCreate,
    disabledImportBtn,
    onFactoryIdChange,
    warningImport,
    handleClickImportCsv,
    errorMessage,
    setErrorMessage,
    setDataImport,
    setHeaderImport,
    getFormCreate,
    resetFormState,
    updateSelectedFactory,
    setFormCreate,
    pathName,
    setWarningImport,
    searchFactory,
    setSearchFactory,
  };
}
