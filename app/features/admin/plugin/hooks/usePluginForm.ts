import { useState } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { usePluginStore } from "@/app/store/pluginStore";
import { EAdminPathName } from "@/app/types/enum";
import { IPluginPayload } from "@/app/types/plugin/pluginType";

export type PluginFeatureForm = {
  featureName: string;
  description?: string;
  limitedPrice?: number | null;
  monthlyPrice?: number | null;
  yearlyPrice?: number | null;
};

const defaultFormState = {
  pluginName: "",
  companyName: "",
  companyLocation: "",
  pluginType: "",
  description: "",
  contactFirstName: "",
  contactLastName: "",
  contactPhone: "",
  contactEmail: "",
  accountUsername: "",
  accountPassword: "",
  limitedOrderQuota: "",
  limitedPrice: "",
  monthlyDurationDays: "",
  monthlyPrice: "",
  yearlyDurationDays: "",
  yearlyPrice: "",
};

export type PluginFormState = typeof defaultFormState;

export default function usePluginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const createPlugin = usePluginStore((state) => state.createPlugin);

  const [step, setStep] = useState<number>(1);
  const [openAddFunctionModal, setOpenAddFunctionModal] =
    useState<boolean>(false);
  const [formData, setFormData] = useState(defaultFormState);
  const [featureList, setFeatureList] = useState<PluginFeatureForm[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const headerList = [
    {
      key: "selected",
      label: "ฟังก์ชั่นระบบ TMS",
      width: "23%",
      sortable: false,
    },
    { key: "amount", label: "แบบจำกัดจำนวน", width: "23%", sortable: false },
    { key: "month", label: "แบบรายเดือน", width: "23%", sortable: false },
    { key: "year", label: "แบบรายปี", width: "23%", sortable: false },
    { key: "action", label: "", width: "8%", sortable: false },
  ];

  const steps = ["ข้อมูลบริษัทปลั๊กอิน", "ข้อมูลฟังก์ชันการใช้งานระบบ"];

  const handleClickBackStep = () => {
    router.back();
  };

  const handleClickNextStep = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleClickAddFunction = () => {
    setOpenAddFunctionModal(!openAddFunctionModal);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveFeature = (feature: PluginFeatureForm) => {
    setFeatureList((prev) => [...prev, feature]);
    setOpenAddFunctionModal(false);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatureList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const buildPayload = (): IPluginPayload => ({
    name: formData.pluginName,
    companyName: formData.companyName,
    companyLocation: formData.companyLocation || undefined,
    pluginType: formData.pluginType || undefined,
    description: formData.description || undefined,
    contactFirstName: formData.contactFirstName || undefined,
    contactLastName: formData.contactLastName || undefined,
    contactPhone: formData.contactPhone || undefined,
    contactEmail: formData.contactEmail || undefined,
    accountUsername: formData.accountUsername || undefined,
    accountPassword: formData.accountPassword || undefined,
    limitedOrderQuota: formData.limitedOrderQuota
      ? Number(formData.limitedOrderQuota)
      : null,
    limitedPrice: formData.limitedPrice
      ? Number(formData.limitedPrice)
      : null,
    monthlyDurationDays: formData.monthlyDurationDays
      ? Number(formData.monthlyDurationDays)
      : null,
    monthlyPrice: formData.monthlyPrice ? Number(formData.monthlyPrice) : null,
    yearlyDurationDays: formData.yearlyDurationDays
      ? Number(formData.yearlyDurationDays)
      : null,
    yearlyPrice: formData.yearlyPrice ? Number(formData.yearlyPrice) : null,
    features: featureList.map((feature) => ({
      featureName: feature.featureName,
      description: feature.description,
      limitedPrice: feature.limitedPrice ?? null,
      monthlyPrice: feature.monthlyPrice ?? null,
      yearlyPrice: feature.yearlyPrice ?? null,
    })),
    status: "active",
  });

  const validateForm = () => {
    if (!formData.pluginName || !formData.companyName) {
      toast({
        icon: "ToastError",
        variant: "error",
        description: "กรุณากรอกชื่อปลั๊กอินและชื่อบริษัท",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      const pluginId = await createPlugin(payload);
      if (pluginId) {
        toast({
          icon: "ToastSuccess",
          variant: "success",
          description: "บันทึกปลั๊กอินสำเร็จ",
        });
        router.push(EAdminPathName.PLUGIN);
      } else {
        throw new Error("ไม่สามารถสร้างปลั๊กอินได้");
      }
    } catch (error) {
      console.error(error);
      toast({
        icon: "ToastError",
        variant: "error",
        description: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleClickBackStep,
    headerList,
    handleClickNextStep,
    step,
    steps,
    handleClickAddFunction,
    openAddFunctionModal,
    setOpenAddFunctionModal,
    formData,
    handleInputChange,
    featureList,
    handleSaveFeature,
    handleRemoveFeature,
    isSubmitting,
  };
}
