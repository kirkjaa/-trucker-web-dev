import { useState } from "react";

import { useCompanyStore } from "@/app/store/companyStore";
import { useFactoryStore } from "@/app/store/factoryStore";
import { useGlobalStore } from "@/app/store/globalStore";

export default function useMyProfile() {
  //#region State
  const [openProfileModal, setOpenProfileModal] = useState(false);
  //#endregion State

  //#region Store
  const { getCompanyMe, getMyCompany } = useCompanyStore();
  const { getFactoryMe, getMyFactory } = useFactoryStore();
  const { currentStep } = useGlobalStore();

  //#endregion Store

  //#region Function
  const handleOpenProfileModal = async (factory?: boolean) => {
    if (factory) {
      await getFactoryMe();
    } else {
      await getCompanyMe();
    }

    setOpenProfileModal(true);
  };

  //#endregion Function

  return {
    openProfileModal,
    setOpenProfileModal,
    handleOpenProfileModal,
    getCompanyMe,
    currentStep,
    getMyCompany,
    getMyFactory,
  };
}
