import { useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { useDriversStore } from "@/app/store/driversStore";
import { useTruckStore } from "@/app/store/truckStore";
import { useUsersPositionStore } from "@/app/store/usersPositionStore";
import { useUsersStore } from "@/app/store/usersStore";
import { EComPathName, EHttpStatusCode } from "@/app/types/enum";
import { TrucksListTable } from "@/app/types/truckType";
import { IUsersPositionListTable } from "@/app/types/usersPositionType";
import { IUsersDetail } from "@/app/types/usersType";
import formatPhoneNumber, {
  formatPhoneNumberWithDialCode,
} from "@/app/utils/formatPhoneNumber";
import { ChangePasswordFormInputs } from "@/app/utils/validate/auth-validate";
import {
  DriverAddTruckFormInputs,
  DriverCompanyInternalFormInputs,
} from "@/app/utils/validate/drivers-validate";
import {
  UsersFormInputs,
  UsersSchema,
} from "@/app/utils/validate/users-validate";

export default function useUsersForm() {
  //#region State
  const [image, setImage] = useState<any[]>([]);
  const [openChangePassword, setOpenChangePassword] = useState<boolean>(false);
  const [optionTruck, setOptionTruck] = useState<TrucksListTable[]>([]);
  const [optionPosition, setOptionPosition] = useState<
    IUsersPositionListTable[]
  >([]);
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false);
  const router = useRouter();
  const pathName = usePathname();
  const { toast } = useToast();

  //#endregion State

  //#region Store
  const { createUsersCompany, createUsersFactory, updateUsers, getUsersById } =
    useUsersStore();

  const { getAllCompanyTruckList, getAllFactoryTruckList } = useTruckStore();
  const { getListUsersPositionMe } = useUsersPositionStore();
  const { createDriverCompanyInternal, addTruckDriver } = useDriversStore();
  //#endregion Store

  //#region  Form
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
  } = useForm<UsersFormInputs>({
    resolver: zodResolver(UsersSchema),
    defaultValues: {
      dialCode: "+66",
    },
  });
  //#endregion  Form

  //#region Function
  const handleUpdate = async (data: UsersFormInputs, id: string) => {
    data.phone = formatPhoneNumberWithDialCode(data.phone, data.dialCode);
    const response = await updateUsers(data, id);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
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
  const handleCreate = async (data: UsersFormInputs) => {
    let response = null;
    data.phone = formatPhoneNumberWithDialCode(data.phone, data.dialCode);
    if (pathName.includes(EComPathName.USERSDRIVER)) {
      response = await handleCreateDriver(data);
    } else {
      response = await handleCreateUser(data);
    }

    if (
      response &&
      (response.statusCode === EHttpStatusCode.CREATED ||
        response.statusCode === EHttpStatusCode.SUCCESS)
    ) {
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
        description: response ? response?.message.th : "บันทึกไม่สำเร็จ",
      });
    }
  };
  const handleCreateUser = async (data: UsersFormInputs) => {
    data.phone = getValues("dialCode") + getValues("phone");
    const createFunction =
      pathName === EComPathName.CREATEUSERS
        ? createUsersCompany
        : createUsersFactory;
    const response = await createFunction(data);
    return response;
  };

  const handleCreateDriver = async (data: UsersFormInputs) => {
    const driverCompanyFormData: DriverCompanyInternalFormInputs = {
      ...data,
    };
    const response = await createDriverCompanyInternal(driverCompanyFormData);
    return response;
  };

  const handleClickBack = () => {
    router.back();
  };

  const setFormByData = (data: IUsersDetail) => {
    setValue("username", data.username);

    setValue("phone", data.phone && formatPhoneNumber(data.phone));
    setValue("email", data.email);
    setValue("dialCode", data.dialCode);
    setValue("firstName", data.firstName);
    setValue("lastName", data.lastName);
    if (data.imageUrl) {
      setImage([{ name: data.imageUrl }]);
    }
    if (data.position) setSelectedPosition(data.position.id);
  };

  const fetchFormById = async (id: string) => {
    const response = await getUsersById(id);
    console.log(response);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      const { data } = response;
      setFormByData(data);
    } else {
      router.back();
    }
  };
  const handleClickChangePassword = () => {
    setOpenChangePassword(true);
  };

  const onSubmitChangePassword = (data: ChangePasswordFormInputs) => {
    setValue("password", data.password);
    setValue("confirmPassword", data.confirmPassword);
  };

  const fetchOptionTruck = async () => {
    const fetchOptionFunction = pathName.includes(EComPathName.USERSDRIVER)
      ? getAllCompanyTruckList
      : getAllFactoryTruckList;
    const response = await fetchOptionFunction();
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      setOptionTruck(response.data);
    }
  };

  const fetchOptionUsersPosition = async () => {
    const response = await getListUsersPositionMe();
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      const { data } = response;
      if (data) {
        const activePosition = data.filter((item) => item.isActive);
        setOptionPosition(activePosition);
      }
    }
  };

  const handleAddTruckDriver = async (data: DriverAddTruckFormInputs) => {
    const response = await addTruckDriver(data);
    if (response && response.statusCode === EHttpStatusCode.SUCCESS) {
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
        description: response ? response?.message.th : "บันทึกไม่สำเร็จ",
      });
    }
    return response;
  };
  //#endregion Function
  return {
    register,
    errors,
    handleSubmit,
    handleCreate,
    image,
    setImage,
    handleClickBack,
    getValues,
    setValue,
    fetchFormById,
    pathName,
    handleUpdate,
    openChangePassword,
    setOpenChangePassword,
    handleClickChangePassword,
    onSubmitChangePassword,
    fetchOptionTruck,
    optionTruck,
    fetchOptionUsersPosition,
    optionPosition,
    selectedPosition,
    setSelectedPosition,
    addTruckDriver,
    handleAddTruckDriver,
    clearErrors,
    isShowPassword,
    setIsShowPassword,
    isShowConfirmPassword,
    setIsShowConfirmPassword,
  };
}
