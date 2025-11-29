import { useState } from "react";

import { useGlobalStore } from "@/app/store/globalStore";
import { useRfqStore } from "@/app/store/rfqStore";

export default function useModalDetailById() {
  // Global State
  const { getRfqById, getRfqSearchParams, setRfqSearchParams } = useRfqStore();
  const { setCurrentStep } = useGlobalStore();

  // Local State
  const [isModalDetailOpen, setIsModalDetailOpen] = useState<boolean>(false);
  const [bidIdModal, setBidIdModal] = useState<string>("");
  const [quotationIdModal, setQuotationIdModal] = useState<string>("");

  // Functions
  const handleClickViewIcon = (quotationId: string, bidIdModal?: string) => {
    getRfqById(quotationId);
    setQuotationIdModal(quotationId);
    setIsModalDetailOpen(true);
    setCurrentStep(1);
    setBidIdModal(bidIdModal || "");
  };

  const setPage = (page: number) => {
    const newSearchParams = {
      ...getRfqSearchParams(),
      page,
    };
    setRfqSearchParams(newSearchParams);
    getRfqById(quotationIdModal);
  };

  const setLimit = (limit: number) => {
    const newSearchParams = {
      ...getRfqSearchParams(),
      page: getRfqSearchParams().page,
      limit,
    };
    setRfqSearchParams(newSearchParams);
    getRfqById(quotationIdModal);
  };

  return {
    isModalDetailOpen,
    setIsModalDetailOpen,
    handleClickViewIcon,
    bidIdModal,
    setPage,
    setLimit,
  };
}
