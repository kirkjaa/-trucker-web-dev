import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { masterApi } from "@/app/services/master/masterApi";
import { organizationApi } from "@/app/services/organization/organizationApi";
import { templateApi } from "@/app/services/template/templateApi";
import { EAdminPathName, EHttpStatusCode } from "@/app/types/enum";
import { ITemplateField } from "@/app/types/master/masterType";
import { IOrganization } from "@/app/types/organization/organizationType";
import { ITemplateRequest } from "@/app/types/template/templateType";

export default function useUploadTemplateCsvForm() {
  // Local State
  const [templateFields, setTemplateFields] = useState<ITemplateField[]>([]);
  const [optionFactory, setOptionFactory] = useState<IOrganization[]>([]);
  const [organizationId, setOrganizationId] = useState<string>("");
  const [selectedTemplateType, setSelectedTemplateType] = useState<string>("");
  const [mappedColumns, setMappedColumns] = useState<
    { field_id: number; match_field: string }[]
  >([]);
  const [searchOption, setSearchOption] = useState<string>("");

  /* const [optionMasterColumns, setOptionMasterColumns] = useState< */
  /*   ECreateRouteTemplate[] */
  /* >(Object.values(ECreateRouteTemplate)); */
  /* const [selectedColumns, setSelectedColumns] = useState< */
  /*   (string | undefined)[] */
  /* >([]); */

  // Hook
  const { toast } = useToast();
  const router = useRouter();
  const { templateId } = useParams();

  // Function
  const headerList = [
    {
      key: "columns",
      label: "คอลัมน์",
      width: "18%",
    },
    {
      key: "columnsFile",
      label: "ไฟล์คอลัมน์",
      width: "18%",
    },
    {
      key: "space",
      label: "",
      width: "18%",
    },
    {
      key: "fields",
      label: "ฟิลด์รายการ",
      width: "18%",
    },
    {
      key: "space2",
      label: "",
      width: "18%",
    },
  ];

  const fetchOptionFactory = async () => {
    const response = await organizationApi.getOrganizationsByTypeId({
      page: 1,
      limit: 10,
      search: searchOption,
    });
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      setOptionFactory(response.data);
    }
  };

  const fetchTemplateField = async (type: string) => {
    const response = await masterApi.getTemplateFields(type);

    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      setTemplateFields(response.data);
    }
  };

  /* const validateMappedColumns = ( */
  /*   data: UploadTemplateCsvFormInputs */
  /* ): boolean => { */
  /*   if (!data.mappedColumns || data.mappedColumns.length === 0) { */
  /*     return showError("กรุณาเลือกฟิลด์รายการ"); */
  /*   } */
  /**/
  /*   const filteredColumns = data.mappedColumns.filter((item) => item != null); */
  /*   console.log("Filtered Columns:", filteredColumns); */
  /**/
  /*   if (hasDuplicateColumns(filteredColumns)) { */
  /*     return showError("คุณเลือกฟิลด์รายการซ้ำในรายการ"); */
  /*   } */
  /**/
  /*   if (!hasAllRequiredFields(filteredColumns)) { */
  /*     return showError("กรุณาเลือกฟิลด์รายการให้ครบถ้วน"); */
  /*   } */
  /**/
  /*   if (isInvalidDestinationSelection(filteredColumns)) { */
  /*     return showError( */
  /*       "หากเลือกจังหวัดหรืออำเภอปลายทาง ห้ามเลือกจุดหมายปลายทาง" */
  /*     ); */
  /*   } */
  /*   if (isInvalidOriginSelection(filteredColumns)) { */
  /*     return showError("หากเลือกจังหวัดหรืออำเภอต้นทาง ห้ามเลือกจุดหมายต้นทาง"); */
  /*   } */
  /**/
  /*   return false; // ไม่มี error */
  /* }; */

  /* const hasDuplicateColumns = (columns: string[]): boolean => { */
  /*   return new Set(columns).size !== columns.length; */
  /* }; */
  /**/
  /* const hasAllRequiredFields = (columns: string[]): boolean => { */
  /*   const requiredFields = Object.values(ECreateRouteTemplateRequried); */
  /*   return requiredFields.every((field) => */
  /*     columns.map((col) => col.toLowerCase()).includes(field.toLowerCase()) */
  /*   ); */
  /* }; */
  /**/
  /* const isInvalidDestinationSelection = (columns: string[]): boolean => { */
  /*   const hasDestination = columns.includes(ECreateRouteTemplate.DESTINATION); */
  /*   const hasProvince = columns.includes( */
  /*     ECreateRouteTemplate.DESTINATION_PROVINCE */
  /*   ); */
  /*   const hasDistrict = columns.includes( */
  /*     ECreateRouteTemplate.DESTINATION_DISTRICT */
  /*   ); */
  /*   return (hasProvince || hasDistrict) && hasDestination; */
  /* }; */
  /**/
  /* const isInvalidOriginSelection = (columns: string[]): boolean => { */
  /*   const hasOrigin = columns.includes(ECreateRouteTemplate.ORIGIN); */
  /*   const hasProvince = columns.includes(ECreateRouteTemplate.ORIGIN_PROVINCE); */
  /*   const hasDistrict = columns.includes(ECreateRouteTemplate.ORIGIN_DISTRICT); */
  /*   return (hasProvince || hasDistrict) && hasOrigin; */
  /* }; */
  /**/
  /* const showError = (message: string): boolean => { */
  /*   toast({ */
  /*     icon: "ToastError", */
  /*     variant: "error", */
  /*     description: message, */
  /*   }); */
  /*   return true; // isError */
  /* }; */
  /**/
  /* const filterNullMappedColumns = (data: UploadTemplateCsvFormInputs) => { */
  /*   const filteredCustomerColumns: string[] = []; */
  /*   const filteredMappedColumns: string[] = []; */
  /**/
  /*   const customerColumns = data.customerColumns ?? []; // ป้องกัน undefined */
  /*   const mappedColumns = data.mappedColumns ?? []; */
  /**/
  /*   mappedColumns.forEach((col, index) => { */
  /*     console.log(col); */
  /*     if (col !== null && col !== undefined) { */
  /*       filteredCustomerColumns.push(customerColumns[index] ?? ""); // ป้องกัน undefined */
  /*       filteredMappedColumns.push(col!); */
  /*     } */
  /*   }); */
  /**/
  /*   return { */
  /*     customerColumns: filteredCustomerColumns, */
  /*     mappedColumns: filteredMappedColumns, */
  /*   }; */
  /* }; */

  const onMappedColumnsChange = (field_id: number, match_field: string) => {
    setMappedColumns((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((col) => col.match_field === match_field);

      if (index !== -1) {
        updated[index].field_id = field_id;
      } else {
        updated.push({ match_field, field_id });
      }

      return updated;
    });
  };

  const hasDuplicateFieldIds = (
    columns: { field_id: number; match_field: string }[]
  ) => {
    const seen = new Set<number>();
    for (const col of columns) {
      if (seen.has(col.field_id)) {
        return true;
      }
      seen.add(col.field_id);
    }
    return false;
  };

  const onClickConfirm = () => {
    if (hasDuplicateFieldIds(mappedColumns)) {
      toast({
        variant: "error",
        icon: "ToastError",
        description: "มีฟิลด์ที่ถูกเลือกซ้ำกัน",
      });
      return;
    }
    const payload: ITemplateRequest = {
      organization_id: Number(organizationId),
      template_type: selectedTemplateType,
      fields: mappedColumns,
    };

    if (templateId) {
      handleUpdate(payload);
    } else {
      handleCreateTemplateCsv(payload);
    }
  };

  const handleCreateTemplateCsv = async (data: ITemplateRequest) => {
    const response = await templateApi.createTemplate(data);

    if (response.statusCode === EHttpStatusCode.CREATED) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "บันทึกสำเร็จ",
      });
      router.replace(EAdminPathName.UPLOADTEMPLATECSV);
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: response.message.th,
      });
    }
  };

  const fetchFormById = async (id: string) => {
    const response = await templateApi.getTemplateById(Number(id));
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      const { data } = response;
      setOrganizationId(data.organization.id.toString());
      setSelectedTemplateType(data.template_type);

      const mapped = data.fields.map((field) => ({
        field_id: field.field.id,
        match_field: field.match_field,
      }));
      setMappedColumns(mapped);
    } else {
      router.back();
    }
  };

  const handleUpdate = async (data: ITemplateRequest) => {
    const response = await templateApi.updateTemplate(Number(templateId), data);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "บันทึกสำเร็จ",
      });
      router.replace(EAdminPathName.UPLOADTEMPLATECSV);
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: response.message.th,
      });
    }
  };

  return {
    optionFactory,
    fetchOptionFactory,
    fetchTemplateField,
    templateFields,
    headerList,
    selectedTemplateType,
    setSelectedTemplateType,
    organizationId,
    setOrganizationId,
    onMappedColumnsChange,
    onClickConfirm,
    fetchFormById,
    searchOption,
    setSearchOption,
    mappedColumns,
    setMappedColumns,
  };
}
