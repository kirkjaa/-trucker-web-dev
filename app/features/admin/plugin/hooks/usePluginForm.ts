import { useState } from "react";
import { useRouter } from "next/navigation";

export default function usePluginForm() {
  //#region State
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [openAddFunctionModal, setOpenAddFunctionModal] =
    useState<boolean>(false);

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
  //#endregion State

  //#region Function
  const handleClickBackStep = () => {
    router.back();
  };

  const handleClickNextStep = () => {
    if (step < steps.length) setStep(step + 1);
    else setStep(step - 1);
  };

  const handleClickAddFunction = () => {
    setOpenAddFunctionModal(!openAddFunctionModal);
  };
  //#endregion Function
  return {
    handleClickBackStep,
    headerList,
    handleClickNextStep,
    step,
    steps,
    handleClickAddFunction,
    openAddFunctionModal,
    setOpenAddFunctionModal,
  };
}
