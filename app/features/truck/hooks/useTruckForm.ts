import { useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/app/components/ui/toast/use-toast";
import useAddress from "@/app/hooks/useAddress";
import { useDriversStore } from "@/app/store/driversStore";
import { useTruckStore } from "@/app/store/truckStore";
import { IDriversData } from "@/app/types/driversType";
import {
  EHttpStatusCode,
  ETruckContainers,
  ETruckFuelType,
  ETruckSize,
  ETruckType,
} from "@/app/types/enum";
import { TrucksListTable } from "@/app/types/truckType";
import {
  TruckFormInputs,
  truckSchema,
} from "@/app/utils/validate/truck-validate";
export default function useTruckForm() {
  //#region State
  const [province, setProvince] = useState<string>();
  const [frontImage, setFrontImage] = useState<any[]>();
  const [backImage, setBackImage] = useState<any[]>();
  const [sideImage, setSideImage] = useState<any[]>();
  const [licensePlateImage, setLicensePlateImage] = useState<any>();
  const [documents, setDocuments] = useState<any[]>([]);
  const [fuelType, setFuelType] = useState<ETruckFuelType>();
  const [truckType, setTruckType] = useState<ETruckType>();
  const [containers, setContainers] = useState<ETruckContainers[]>([]);
  const [optionDriver, setOptionDriver] = useState<IDriversData[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>();
  const [remark, setRemark] = useState<string>("");

  const [year, setYear] = useState<string>();
  //#endregion State

  //#region Store
  const { createTruck, updateTruck, getTruckById } = useTruckStore();
  const { getDriverCompanyMeList } = useDriversStore();
  //#endregion Store

  //#region Hooks
  const { provinces } = useAddress();
  const pathName = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  //#endregion Hooks

  //#region Form
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    clearErrors,
  } = useForm<TruckFormInputs>({
    resolver: zodResolver(truckSchema),
    defaultValues: {
      size: ETruckSize.FOUR_WHEEL,
    },
  });
  //#endregion Form

  //#region Function
  const onProvinceChange = (val: string) => {
    setProvince(val);
  };
  const handleCreate = async (data: TruckFormInputs) => {
    const response = await createTruck(data);
    if (response.statusCode === EHttpStatusCode.CREATED) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "บันทึกสำเร็จ",
        descriptionTwo: "'รายการดำเนินการอยู่'",
      });

      handleBack();
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: response.message.th,
      });
    }
  };
  const handleUpdate = async (data: TruckFormInputs, id: string) => {
    const response = await updateTruck(data, id);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "บันทึกสำเร็จ",
        descriptionTwo: "'รายการดำเนินการอยู่'",
      });
      handleBack();
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: response.message.th,
      });
    }
  };
  const handleSelectContainer = (data: ETruckContainers, checked: boolean) => {
    const updatedList = checked
      ? [...containers, data]
      : containers.filter((item) => item !== data);

    setContainers(updatedList);
  };

  const handleBack = () => {
    router.back();
  };

  const setFormByData = (data: TrucksListTable) => {
    const {
      licensePlate,
      year,
      type,
      fuelType,
      sideImageUrl,
      licensePlateImageUrl,
      frontImageUrl,
      backImageUrl,
      capacity,
      documentUrls,
      driverId,
      remark,
    } = data;
    setYear(year);
    setTruckType(type);
    setFuelType(fuelType);
    if (sideImageUrl) {
      setSideImage([{ name: sideImageUrl }]);
    }
    if (licensePlateImageUrl) {
      setLicensePlateImage([{ name: licensePlateImageUrl }]);
    }

    if (frontImageUrl) {
      setFrontImage([{ name: frontImageUrl }]);
    }

    if (backImageUrl) {
      setBackImage([{ name: backImageUrl }]);
    }
    if (documentUrls && documentUrls.length > 0) {
      const files = documentUrls.map((url) => {
        return { name: url };
      });
      setDocuments(files);
    }

    if (licensePlate) {
      setProvince(licensePlate.province);
      setValue("licensePlateValue", licensePlate.value);
    }

    if (capacity) {
      setContainers(capacity.containers);
      setValue("weight", capacity.weight);
      const { size } = capacity;
      setValue("width", size.width);
      setValue("length", size.length);
      setValue("height", size.height);
    }
    if (driverId) {
      setSelectedDriver(driverId);
    }
    if (remark) {
      setRemark(remark);
    }
    Object.entries(data).forEach(([key, value]: any) => {
      setValue(key, value);
    });
  };

  const fetchFormData = async (id: string) => {
    const response = await getTruckById(id);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      const { data } = response;
      setFormByData(data);
    }
  };

  const fetchOptionDriver = async () => {
    const response = await getDriverCompanyMeList();
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      const { data } = response;
      setOptionDriver(data);
    }
  };
  //#endregion Function
  return {
    register,
    errors,
    provinces,
    onProvinceChange,
    province,
    setValue,
    frontImage,
    setFrontImage,
    backImage,
    setBackImage,
    sideImage,
    setSideImage,
    licensePlateImage,
    setLicensePlateImage,
    documents,
    setDocuments,
    fuelType,
    setFuelType,
    year,
    setYear,
    truckType,
    setTruckType,
    handleCreate,
    handleSubmit,
    pathName,
    handleUpdate,
    containers,
    handleBack,
    handleSelectContainer,
    fetchFormData,
    fetchOptionDriver,
    optionDriver,
    selectedDriver,
    setSelectedDriver,
    clearErrors,
    remark,
    setRemark,
  };
}
