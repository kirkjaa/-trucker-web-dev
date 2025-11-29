import { useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { organizationApi } from "../../../../services/organization/organizationApi";
import { userApi } from "../../../../services/user/userApi";
import { IOrganization } from "../../../../types/organization/organizationType";

import { useToast } from "@/app/components/ui/toast/use-toast";
import {
  SystemUsersFormInputs,
  SystemUsersFormSchema,
} from "@/app/features/admin/system-users/validate/system-users-validate";
import { EAdminPathName, EHttpStatusCode } from "@/app/types/enum";
import { IUser } from "@/app/types/user/userType";

export default function useSystemUsersForm() {
  //Local  State
  const [option, setOption] = useState<IOrganization[]>([]);
  const [searchOption, setSearchOption] = useState<string>("");
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
  const [data, setData] = useState<SystemUsersFormInputs>();

  //Hook
  const router = useRouter();
  const pathName = usePathname();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch,
    control,
    clearErrors,
  } = useForm<SystemUsersFormInputs>({
    resolver: zodResolver(SystemUsersFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone: "",
      organization_id: "",
      image: undefined,
      pathName: pathName,
    },
  });

  //Function
  const setFormByData = (data: IUser) => {
    setValue("first_name", data.first_name);
    setValue("last_name", data.last_name);
    setValue("username", data.username);
    setValue("email", data.email);
    setValue("phone", data.phone);
    setValue("organization_id", data.organization.id.toString());
    setValue("image", data.image_url);
  };

  const fetchFormById = async (id: number) => {
    const res = await userApi.getUserById(id);
    if (res.statusCode === EHttpStatusCode.SUCCESS) {
      setFormByData(res.data);
    } else {
      router.back();
    }
  };

  const handleConfirm = () => {
    const latestData = getValues();
    setOpenModalConfirm(true);
    setData(latestData);
  };

  const onSubmit = async () => {
    if (data) {
      const formData = new FormData();
      formData.set("first_name", data.first_name);
      formData.set("last_name", data.last_name);
      formData.set("username", data.username);
      formData.set("email", data.email);
      formData.set("phone", data.phone);
      formData.set("organization_id", data.organization_id);
      if (data.image) formData.set("image", data.image);

      const res = await userApi.createUser(formData);

      if (res.statusCode === EHttpStatusCode.CREATED) {
        toast({
          icon: "ToastSuccess",
          variant: "success",
          description: "สร้างผู้ใช้ระบบสำเร็จ",
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

  const handleUpdate = async (id: string) => {
    if (data) {
      const formData = new FormData();
      formData.set("first_name", data.first_name);
      formData.set("last_name", data.last_name);
      formData.set("username", data.username);
      formData.set("email", data.email);
      formData.set("phone", data.phone);
      formData.set("organization_id", data.organization_id);

      if (data.image) formData.set("image", data.image);

      const response = await userApi.editUser(Number(id), formData);
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

  const handleClickBackStep = () => {
    router.back();
  };

  const getOptionList = async () => {
    const typeId = pathName.startsWith(EAdminPathName.SYSTEMUSERSFACTORIES)
      ? 1
      : 2;
    const response = await organizationApi.getOrganizationsByTypeId({
      page: 1,
      limit: 10,
      typeId,
      search: searchOption,
    });
    setOption(response.data);
  };

  return {
    handleClickBackStep,
    register,
    handleSubmit,
    onSubmit,
    errors,
    setValue,
    getValues,
    fetchFormById,
    pathName,
    handleUpdate,
    option,
    searchOption,
    setSearchOption,
    getOptionList,
    openModalConfirm,
    setOpenModalConfirm,
    handleConfirm,
    watch,
    control,
    clearErrors,
  };
}
