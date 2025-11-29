import { useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { DriverForm, driverSchema } from "../validate/drivers";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { driverApi } from "@/app/services/driver/driverApi";
import { organizationApi } from "@/app/services/organization/organizationApi";
import { useDriversStore } from "@/app/store/driversStore";
import { IDriver } from "@/app/types/driver/driverType";
import { EAdminPathName, EHttpStatusCode } from "@/app/types/enum";
import { IOrganization } from "@/app/types/organization/organizationType";

export default function useDriversForm() {
  //Global State
  const { getDriverById } = useDriversStore();

  //Local State
  const [option, setOption] = useState<IOrganization[]>([]);
  const [driverCompanyId, setDriverCompanyId] = useState<string>("");
  const [image, setImage] = useState<any>();
  const [idCardImage, setIdCardImage] = useState<any>();
  const [vehicleRegistrationImage, setVehicleRegistrationImage] =
    useState<any>();
  const [vehicleLicenseImage, setVehicleLicenseImage] = useState<any>();
  const [searchOption, setSearchOption] = useState<string>("");
  const [tempData, setTempData] = useState<DriverForm>();
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);

  //Hook
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    watch,
    control,
    clearErrors,
  } = useForm<DriverForm>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone: "",
      organization_id: "",
      image: undefined,
      image_id_card: undefined,
      image_truck_registration: undefined,
      image_driving_license_card: undefined,
    },
  });
  const { toast } = useToast();
  const router = useRouter();
  const pathName = usePathname();

  //Function
  const setFormByData = (data: IDriver) => {
    setValue("first_name", data.user.first_name ?? "");
    setValue("last_name", data.user.last_name ?? "");
    setValue("username", data.user.username ?? "");
    setValue("email", data.user.email ?? "");
    setValue("phone", data.user.phone ?? "");
    setValue("organization_id", data.user.organization?.id?.toString() ?? "");

    setValue("image", data.user.image_url ?? undefined);
    setValue("image_id_card", data.image_id_card_url ?? undefined);
    setValue(
      "image_truck_registration",
      data.truck?.image_truck_registration_url ?? undefined
    );
    setValue(
      "image_driving_license_card",
      data.image_driving_license_card_url ?? undefined
    );
  };

  const handleGetDriverById = async (id: number) => {
    const response = await driverApi.getDriverById(id);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      setFormByData(response.data);
    } else {
      router.back();
    }
  };

  const handleClickBackStep = () => {
    router.back();
  };

  /* const buildFormFreeLanceData = (data: DriversFormInputs) => { */
  /*   delete data.driverCompanyId; */
  /*   if (data.image && data.image.length > 0) { */
  /*     data.image = data.image[0]; */
  /*   } */
  /*   if (data.idCardImage && data.idCardImage.length > 0) { */
  /*     data.idCardImage = data.idCardImage[0]; */
  /*   } */
  /*   if ( */
  /*     data.vehicleRegistrationImage && */
  /*     data.vehicleRegistrationImage.length > 0 */
  /*   ) { */
  /*     data.vehicleRegistrationImage = data.vehicleRegistrationImage[0]; */
  /*   } */
  /*   if (data.vehicleLicenseImage && data.vehicleLicenseImage.length > 0) { */
  /*     data.vehicleLicenseImage = data.vehicleLicenseImage[0]; */
  /*   } */
  /* }; */

  const handleConfirm = () => {
    const data = getValues();
    setOpenModalConfirm(true);
    setTempData(data);
  };

  const handleCreate = async () => {
    if (!tempData) return;

    const formData = new FormData();

    const commonFields = [
      "first_name",
      "last_name",
      "username",
      "email",
      "phone",
      "image",
    ] as const;

    for (const key of commonFields) {
      let value = tempData[key];
      if (Array.isArray(value)) {
        value = value[0];
      }
      if (value instanceof File || typeof value === "string") {
        formData.set(key, value);
      }
    }

    let response;

    const isInternal = pathName.includes(EAdminPathName.DRIVERSINTERNAL);

    if (isInternal) {
      if (tempData.organization_id)
        formData.set("organization_id", tempData.organization_id);

      response = await driverApi.createDriverInternal(formData);
    } else {
      if (tempData.image_id_card) {
        const imageIdCard =
          Array.isArray(tempData.image_id_card) && tempData.image_id_card[0];
        tempData.image_id_card;

        if (imageIdCard) formData.set("image_id_card", imageIdCard);
      }
      if (tempData.image_truck_registration) {
        const truckRegistration =
          Array.isArray(tempData.image_truck_registration) &&
          tempData.image_truck_registration[0];
        tempData.image_truck_registration;

        if (truckRegistration)
          formData.set("image_truck_registration", truckRegistration);
      }
      if (tempData.image_driving_license_card) {
        const drivingLicenseCard =
          Array.isArray(tempData.image_driving_license_card) &&
          tempData.image_driving_license_card[0];

        if (drivingLicenseCard)
          formData.set("image_driving_license_card", drivingLicenseCard);
      }

      response = await driverApi.createDriverFreelance(formData);
    }

    if (response?.statusCode === EHttpStatusCode.CREATED) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: `สร้างพนักงานขับรถ${isInternal ? "ภายใน" : "อิสระ"}สำเร็จ`,
      });
      router.back();
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: response?.message.th,
      });
    }
  };

  const handleUpdate = async (id: number) => {
    if (!tempData) return;
    const formData = new FormData();

    const commonFields = [
      "first_name",
      "last_name",
      "username",
      "email",
      "phone",
      "image",
    ] as const;

    for (const key of commonFields) {
      const value = tempData[key];

      if (value instanceof File || typeof value === "string") {
        formData.set(key, value);
      }
    }

    const isInternal = pathName.includes(EAdminPathName.DRIVERSINTERNAL);

    let response;

    if (isInternal) {
      if (tempData.organization_id)
        formData.set("organization_id", tempData.organization_id);

      response = await driverApi.updateDriverInternal(id, formData);
    } else {
      if (tempData.image_id_card instanceof File) {
        formData.set("image_id_card", tempData.image_id_card);
      }

      if (tempData.image_truck_registration instanceof File) {
        formData.set(
          "image_truck_registration",
          tempData.image_truck_registration
        );
      }

      if (tempData.image_driving_license_card instanceof File) {
        formData.set(
          "image_driving_license_card",
          tempData.image_driving_license_card
        );
      }

      response = await driverApi.updateDriverFreelance(id, formData);
    }

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

  const getOptionList = async () => {
    const response = await organizationApi.getOrganizationsByTypeId({
      page: 1,
      limit: 10,
      search: searchOption,
    });
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      setOption(response.data);
    }
  };

  const onDriverCompanyIdChange = (value: string) => {
    setDriverCompanyId(value);
  };

  return {
    handleClickBackStep,
    pathName,
    getOptionList,
    option,
    register,
    errors,
    handleCreate,
    handleUpdate,
    handleSubmit,
    setValue,
    watch,
    control,
    clearErrors,
    driverCompanyId,
    onDriverCompanyIdChange,
    image,
    setImage,
    idCardImage,
    setIdCardImage,
    vehicleRegistrationImage,
    setVehicleRegistrationImage,
    vehicleLicenseImage,
    setVehicleLicenseImage,
    getValues,
    getDriverById,
    handleGetDriverById,
    searchOption,
    setSearchOption,
    handleConfirm,
    tempData,
    openModalConfirm,
    setOpenModalConfirm,
  };
}
