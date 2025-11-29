import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { usePriceEntryStore } from "@/app/store/priceEntryStore";
import { EHttpStatusCode, ETruckSize } from "@/app/types/enum";
import {
  PriceEntryFormInputs,
  PriceEntryFormListInputs,
  PriceEntryFormSchema,
} from "@/app/utils/validate/price-entry-validate";

export default function usePriceEntryForm() {
  //#region State
  const [selectedTruckSize, setSelectedTruckSize] = useState<ETruckSize>();
  const [priceEntriesList, setPriceEntriesList] = useState<
    PriceEntryFormInputs[]
  >([]);
  const { toast } = useToast();
  //#endregion State

  //#region Form
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<PriceEntryFormInputs>({
    resolver: zodResolver(PriceEntryFormSchema),
    defaultValues: {},
  });

  const {
    control,
    register: registerList,
    setValue: setValueList,
    getValues: getValueList,
    formState: { errors: errorList },
  } = useForm<PriceEntryFormListInputs>();
  const { fields, remove } = useFieldArray({
    control,
    name: "payload",
  });

  //#endregion Form

  //#region Store
  const { createPriceEntry, updatePriceEntry } = usePriceEntryStore();
  //#endregion Store

  //#region Function
  const handleCreate = async (data: PriceEntryFormInputs) => {
    const response = await createPriceEntry(data);
    if (response.statusCode === EHttpStatusCode.CREATED) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "บันทึกสำเร็จ",
        descriptionTwo: "'รายการดำเนินการอยู่'",
      });
      handleResetForm();
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: response.message.th,
      });
    }
    return response;
  };

  const handleUpdate = async () => {
    const response = await updatePriceEntry({
      payload: getValueList("payload"),
    });
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "บันทึกสำเร็จ",
        descriptionTwo: "'รายการดำเนินการอยู่'",
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

  const handleResetForm = () => {
    reset();
    setSelectedTruckSize(undefined);
  };
  //#endregion Function
  return {
    register,
    errors,
    handleCreate,
    handleSubmit,
    selectedTruckSize,
    setSelectedTruckSize,
    setValue,
    handleUpdate,
    handleResetForm,
    priceEntriesList,
    setPriceEntriesList,
    setValueList,
    fields,
    registerList,
    getValueList,
    errorList,
    remove,
  };
}
