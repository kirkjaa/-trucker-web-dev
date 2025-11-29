import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { useUsersPositionStore } from "@/app/store/usersPositionStore";
import { EHttpStatusCode } from "@/app/types/enum";
import { IUsersPositionListTable } from "@/app/types/usersPositionType";
import {
  permissionForm,
  UsersPositionFormInputs,
  UsersPositionFormSchema,
} from "@/app/utils/validate/users-position-validate";

export default function useUsersPositionForm() {
  //#region State
  const router = useRouter();
  const [permissionForm, setPermissionForm] = useState<permissionForm>({
    isManageDashboard: false,
    isManageCompany: false,
    isManageUser: false,
    isManageChat: false,
    isManageQuotaion: false,
    isManageOrder: false,
    isManageTruck: false,
    isManagePackage: false,
    isManageProfile: false,
  });
  const [isActiveForm, setIsActiveForm] = useState<boolean>(false);
  const { toast } = useToast();
  //#endregion State
  //#region Form
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
  } = useForm<UsersPositionFormInputs>({
    resolver: zodResolver(UsersPositionFormSchema),
  });
  //#endregion Form
  //#region Store
  const { createUsersPosition, getUserPositionById, updateUserPosition } =
    useUsersPositionStore();
  //#endregion Store
  //#region Function
  const handleBack = () => {
    router.back();
  };

  const handleUpdate = async (data: UsersPositionFormInputs) => {
    const response = await updateUserPosition(getValues("id")!, data);
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
  };

  const handleCreate = async (data: UsersPositionFormInputs) => {
    const response = await createUsersPosition(data);
    if (response.statusCode === EHttpStatusCode.CREATED) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "บันทึกสำเร็จ",
        descriptionTwo: "'รายการดำเนินการอยู่'",
      });
      router.back();
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: response.message.th,
      });
    }
  };
  const setFormByData = (data: IUsersPositionListTable) => {
    setValue("name", data.name);
    setValue("title", data.title);
    setIsActiveForm(data.isActive);
    setPermissionForm(data.permission);
  };

  const fetchFormData = async (id: string) => {
    const response = await getUserPositionById(id);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      const { data } = response;
      setFormByData(data);
    }
  };
  //#endregion Function
  return {
    handleBack,
    errors,
    register,
    handleCreate,
    handleSubmit,
    getValues,
    setValue,
    permissionForm,
    setPermissionForm,
    isActiveForm,
    setIsActiveForm,
    fetchFormData,
    handleUpdate,
  };
}
