import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useQuotationStore } from "@/app/store/quotation/quotationStore";
import { EComPathName, EFacPathName } from "@/app/types/enum";
import { EQuotationStatus } from "@/app/types/quotation/quotationEnum";

export default function useAllQuotation() {
  // Global State
  const { getQuotationsByStatus, getQuotationParams, setQuotationParams } =
    useQuotationStore((state) => ({
      getQuotationsByStatus: state.getQuotationsByStatus,
      getQuotationParams: state.getQuotationParams,
      setQuotationParams: state.setQuotationParams,
    }));

  // Hook
  const pathName = usePathname();

  // Use Effect
  useEffect(() => {
    if (
      pathName === EFacPathName.QUOPENDING ||
      pathName === EComPathName.QUOPENDING
    ) {
      getQuotationsByStatus({
        page: getQuotationParams().page,
        limit: getQuotationParams().limit,
        status: EQuotationStatus.PENDING,
      });
    } else if (
      pathName === EFacPathName.QUOEXPIRED ||
      pathName === EComPathName.QUOEXPIRED
    ) {
      getQuotationsByStatus({
        page: getQuotationParams().page,
        limit: getQuotationParams().limit,
        status: EQuotationStatus.EXPIRED,
      });
    } else if (
      pathName === EFacPathName.QUOAPPROVED ||
      pathName === EComPathName.QUOAPPROVED
    ) {
      getQuotationsByStatus({
        page: getQuotationParams().page,
        limit: getQuotationParams().limit,
        status: EQuotationStatus.SUCCESS,
      });
    }
  }, []);

  // Funcation
  const setPage = (page: number) => {
    const newSearchParams = {
      ...getQuotationParams(),
      page,
    };
    setQuotationParams(newSearchParams);
    getQuotationsByStatus(newSearchParams);
  };

  const setLimit = (limit: number) => {
    const newSearchParams = {
      ...getQuotationParams(),
      page: getQuotationParams().page,
      limit,
    };
    setQuotationParams(newSearchParams);
    getQuotationsByStatus(newSearchParams);
  };

  return {
    setPage,
    setLimit,
  };
}
