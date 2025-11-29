import { useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { organizationApi } from "../../../../services/organization/organizationApi";
import { IOrganization } from "../../../../types/organization/organizationType";
import { OrganizationForm, organizationSchema } from "../validate/organization";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { EAdminPathName, EHttpStatusCode } from "@/app/types/enum";

export default function useFactoriesAndCompaniesForm() {
  //Local State
  // const [optionUserAdmin, setOptionUserAdmin] = useState<IUserAdmin[]>([]);
  // const [adminId, setAdminId] = useState<string>("");
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
  const [data, setData] = useState<OrganizationForm>();
  const [documentDeleteIds, setDocumentDeleteIds] = useState<number[]>([]);

  //Hook
  const router = useRouter();
  const pathName = usePathname();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    getValues,
    clearErrors,
  } = useForm<OrganizationForm>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      dial_code: "+66",
      phone: "",
      email: "",
      type_id: 0,
      business_type_id: "",
      address: "",
      province_id: "",
      district_id: "",
      sub_district_id: "",
      zip_code: "",
      latitude: "",
      longitude: "",
      cover: undefined,
      logo: undefined,
      documents: [],
    },
  });

  //Function
  const onSubmit = async () => {
    if (data) {
      const formData = new FormData();
      formData.set("name", data.name);
      formData.set("dial_code", data.dial_code);
      formData.set("phone", data.phone);
      formData.set("email", data.email);
      formData.set("type_id", String(data.type_id));
      formData.set("business_type_id", String(data.business_type_id));
      formData.set("address", data.address);
      formData.set("province_id", String(data.province_id));
      formData.set("district_id", String(data.district_id));
      formData.set("sub_district_id", String(data.sub_district_id));
      formData.set("zip_code", String(data.zip_code));
      formData.set("latitude", data.latitude);
      formData.set("longitude", data.longitude);

      if (data.cover) formData.set("cover", data.cover);
      if (data.logo) formData.set("logo", data.logo);

      data.documents?.forEach((file: File | string) => {
        formData.append("documents", file);
      });

      const res = await organizationApi.createOrganization(formData);

      if (res.statusCode === EHttpStatusCode.CREATED) {
        toast({
          icon: "ToastSuccess",
          variant: "success",
          description: pathName.startsWith(EAdminPathName.FACTORIES)
            ? "สร้างโรงงานสำเร็จ"
            : "สร้างบริษัทสำเร็จ",
        });
        router.back();
      } else {
        toast({
          icon: "ToastError",
          variant: "error",
          description: res.message.th,
        });
      }
    }
  };

  const setFormByData = (data: IOrganization) => {
    setValue("name", data.name);
    setValue("phone", data.phone);
    setValue("business_type_id", data.business_type.id.toString());
    setValue("email", data.email);

    if (data.image_url) {
      setValue("cover", data.image_url);
    }
    if (data.image_logo_url) {
      setValue("logo", data.image_logo_url);
    }
    if (data.documents && data.documents.length > 0) {
      const fileObjs = data.documents.map((doc, idx) => ({
        id: doc.id,
        name: `File ${idx + 1}`,
        url: doc.file_url,
      }));
      setValue("documents", fileObjs);
    }
    if (data.addresses) {
      const {
        address,
        province,
        district,
        subdistrict,
        zip_code,
        latitude,
        longitude,
      } = data.addresses[0];
      setValue("address", address);
      setValue("province_id", province.id.toString());
      setValue("district_id", district.id.toString());
      setValue("sub_district_id", subdistrict.id.toString());
      setValue("zip_code", zip_code);
      setValue("latitude", latitude);
      setValue("longitude", longitude);
    }
  };

  const getOrganizationById = async (id: number) => {
    const res = await organizationApi.getOrganizationById(id);
    if (res.statusCode === EHttpStatusCode.SUCCESS) {
      setFormByData(res.data);
    } else {
      router.back();
    }
  };

  const handleUpdate = async (id: string) => {
    if (data) {
      const formData = new FormData();
      formData.set("name", data.name);
      formData.set("dial_code", data.dial_code);
      formData.set("phone", data.phone);
      formData.set("email", data.email);
      formData.set("type_id", String(data.type_id));
      formData.set("business_type_id", String(data.business_type_id));
      formData.set("address", data.address);
      formData.set("province_id", String(data.province_id));
      formData.set("district_id", String(data.district_id));
      formData.set("sub_district_id", String(data.sub_district_id));
      formData.set("zip_code", String(data.zip_code));
      formData.set("latitude", data.latitude);
      formData.set("longitude", data.longitude);
      if (documentDeleteIds && documentDeleteIds.length > 0) {
        documentDeleteIds.forEach((id) => {
          formData.append("document_delete_ids", String(id));
        });
      }
      if (data.cover) formData.set("cover", data.cover);
      if (data.logo) formData.set("logo", data.logo);

      data.documents?.forEach((file: File | string) => {
        formData.append("documents", file);
      });
      const response = await organizationApi.updateOrganization(
        Number(id),
        formData
      );
      if (response.statusCode === EHttpStatusCode.SUCCESS) {
        toast({
          icon: "ToastSuccess",
          variant: "success",
          description: "บันทึกสำเร็จ",
        });
        router.back();
      } else {
        toast({
          icon: "ToastError",
          variant: "error",
          description: response.message.th,
        });
      }
    }
  };

  const handleConfirm = () => {
    const latestData = getValues();
    setOpenModalConfirm(true);
    setData(latestData);
  };

  const handleClickBackStep = () => {
    router.back();
  };

  // const getOptionUsersAdmin = async () => {
  //   // const response = await getAllUserAdminList();
  //   // if (response.statusCode === EHttpStatusCode.SUCCESS) {
  //   //   setOptionUserAdmin(response.data);
  //   // }
  // };

  return {
    errors,
    register,
    handleSubmit,
    handleConfirm,
    handleClickBackStep,
    handleUpdate,
    setValue,
    onSubmit,
    openModalConfirm,
    setOpenModalConfirm,
    watch,
    control,
    getOrganizationById,
    setDocumentDeleteIds,
    clearErrors,
  };
}
