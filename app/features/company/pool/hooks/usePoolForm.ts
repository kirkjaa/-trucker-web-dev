import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/app/components/ui/toast/use-toast";
import useAddress from "@/app/hooks/useAddress";
import { usePoolStore } from "@/app/store/poolStore";
import { useTruckStore } from "@/app/store/truckStore";
import { EHttpStatusCode, EPostOfferType, ETruckSize } from "@/app/types/enum";
import { IPoolLatLng } from "@/app/types/poolType";
import { TrucksListTable } from "@/app/types/truckType";
import {
  PoolFormInputs,
  PoolFormSchema,
  PoolOfferFormInputs,
  PoolOfferFormSchema,
} from "@/app/utils/validate/pool-validate";

export default function usePoolForm() {
  //#region State
  const [image, setImage] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  const [stepOffer, setStepOffer] = useState(1);
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedOriginProvince, setSelectedOriginProvince] = useState("");
  const [selectedDestinationProvince, setSelectedDestinationProvince] =
    useState("");
  const [optionTruckOffer, setOptionTruckOffer] = useState<TrucksListTable[]>(
    []
  );
  const [selectedTruckOffer, setSelectedTruckOffer] = useState<string[]>([]);

  const [selectedTruckSize, setSelectedTruckSize] = useState<ETruckSize>();
  const [openDragMapModal, setOpenDragMapModal] = useState(false);
  const [typeLatLng, setTypeLatLng] = useState<"origin" | "destination">();
  const [latLng, setLatLng] = useState<IPoolLatLng>();
  const [startAddress, setStartAddress] = useState<string>();
  const [endAddress, setEndAddress] = useState<string>();
  const stepers = ["รายละเอียด", "การเช่า"];
  const stepersOffer = ["เสนอราคา", "เลือกรถถ"];

  const { toast } = useToast();
  //#endregion State

  //#region  Hooks
  const { provinces } = useAddress();
  //#endregion Hooks

  //#region Store
  const { createPool, offerPool } = usePoolStore();
  const { getAllCompanyTruckList } = useTruckStore();
  //#endregion Store

  //#region Form
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    setError,
    getValues,
    reset,
  } = useForm<PoolFormInputs>({
    resolver: zodResolver(PoolFormSchema),
    defaultValues: {
      isCreateFromOrder: false,
    },
  });

  const {
    register: registerOffer,
    formState: { errors: errorsOffer },
    setValue: setValueOffer,
    handleSubmit: handleSubmitOffer,
    setError: setErrorOffer,
    getValues: getValuesOffer,
    reset: resetOffer,
  } = useForm<PoolOfferFormInputs>({
    resolver: zodResolver(PoolOfferFormSchema),
    defaultValues: {
      type: EPostOfferType.COMPANY,
    },
  });
  //#endregion Form

  //#region Functions
  const handleClickNextStep = (offerFlag = false) => {
    if (offerFlag) {
      const offerPrice = getValuesOffer("offeringPrice");
      if (!offerPrice || offerPrice <= 0)
        setErrorOffer("offeringPrice", { message: "กรุณาใส่ราคา" });
      else setStepOffer(stepOffer + 1);
    } else {
      const subject = getValues("subject");
      const description = getValues("description");
      if (!subject || !description) {
        setError("subject", { message: "กรุณาใส่หัวข้อ" });
        setError("description", { message: "กรุณาใส่รายละเอียด" });
      } else {
        setStep(step + 1);
      }
    }
  };

  const handleClickCancel = (offerFlag = false) => {
    if (offerFlag) {
      setStepOffer(stepOffer - 1);
    } else {
      setStep(step - 1);
    }
  };
  const handleConfirm = async (data: PoolFormInputs) => {
    const response = await createPool(data);

    if (response.statusCode === EHttpStatusCode.CREATED) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "สร้างรายการโพสเสร็จสมบูรณ์",
      });
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: response.message.th,
      });
    }
    return response;
  };
  const handleConfirmOffer = async (data: PoolOfferFormInputs) => {
    const response = await offerPool(data);
    if (response.statusCode === EHttpStatusCode.CREATED) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "สร้างรายการเสนอราคาเสร็จสมบูรณ์",
      });
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: response.message.th,
      });
    }
    return response;
  };

  const fetchTruckList = async () => {
    const response = await getAllCompanyTruckList(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      true
    );

    setOptionTruckOffer(response.data);
  };

  const onTruckOfferChange = (value: string, index: number) => {
    const newSelectedTruckOffer = [...selectedTruckOffer];
    newSelectedTruckOffer[index] = value;
    setSelectedTruckOffer(newSelectedTruckOffer);
  };

  //#endregion Functions

  return {
    image,
    setImage,
    step,
    handleClickNextStep,
    stepers,
    handleClickCancel,
    register,
    errors,
    description,
    setDescription,
    setValue,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    provinces,
    selectedOriginProvince,
    setSelectedOriginProvince,
    selectedDestinationProvince,
    setSelectedDestinationProvince,
    handleSubmit,
    handleConfirm,
    stepersOffer,
    stepOffer,
    fetchTruckList,
    optionTruckOffer,
    registerOffer,
    setValueOffer,
    errorsOffer,
    onTruckOfferChange,
    selectedTruckOffer,
    handleConfirmOffer,
    handleSubmitOffer,
    selectedTruckSize,
    setSelectedTruckSize,
    setStep,
    setStepOffer,
    resetOffer,
    reset,
    openDragMapModal,
    setOpenDragMapModal,
    latLng,
    setLatLng,
    typeLatLng,
    setTypeLatLng,
    getValues,
    startAddress,
    setStartAddress,
    endAddress,
    setEndAddress,
  };
}
