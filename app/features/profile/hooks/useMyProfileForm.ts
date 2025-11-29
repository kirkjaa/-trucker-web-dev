import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { useCompanyStore } from "@/app/store/companyStore";
import { useFactoryStore } from "@/app/store/factoryStore";
import { ICompanyMe } from "@/app/types/companyType";
import { EHttpStatusCode, ERoles } from "@/app/types/enum";
import { IFactoryMe } from "@/app/types/factoryType";
import formatPhoneNumber from "@/app/utils/formatPhoneNumber";
import {
  CompanyMeFormInputs,
  CompanyMeFormSchema,
} from "@/app/utils/validate/company-validate";
import { FactoryMeFormInputs } from "@/app/utils/validate/factory-validate";

export default function useMyProfileForm() {
  const [image, setImage] = useState<any>();

  const { updateCompanyMe, getCompanyMe } = useCompanyStore();
  const { updateFactoryMe, getFactoryMe } = useFactoryStore();

  const { toast } = useToast();
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    getValues,
  } = useForm<CompanyMeFormInputs>({
    resolver: zodResolver(CompanyMeFormSchema),
  });

  const handleSetForm = (data: ICompanyMe | IFactoryMe) => {
    setValue("phone", formatPhoneNumber(data.phone).substring(1));
    setValue("addressLine1", data.address.addressLine1);
    setValue("name", data.name);
    setValue("businessType", data.businessType);
    setValue("email", data.email);
    setValue("dialCode", data.dialCode);
  };

  const onSubmit = async (
    data: CompanyMeFormInputs | FactoryMeFormInputs,
    type: ERoles
  ) => {
    data.phone = getValues("dialCode") + getValues("phone");
    const response =
      type === ERoles.COMPANY
        ? await updateCompanyMe(data)
        : await updateFactoryMe(data);

    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "บันทึกสำเร็จ",
        descriptionTwo: "'รายการดำเนินการอยู่'",
      });
      type === ERoles.COMPANY ? await getCompanyMe() : await getFactoryMe();
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: response.message.th,
      });
    }
    return response;
  };

  return {
    image,
    setImage,
    register,
    errors,
    handleSetForm,
    setValue,
    onSubmit,
    handleSubmit,
  };
}
