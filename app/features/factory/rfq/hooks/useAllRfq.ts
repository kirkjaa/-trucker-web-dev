import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useRfqStore } from "@/app/store/rfq/rfqStore";
import { EComPathName, EFacPathName } from "@/app/types/enum";
import { ERfqSendTo } from "@/app/types/rfq/rfqEnum";

export default function useAllRfq() {
  // Global State
  const { getRfqs, getRfqsRecieved, getRfqParams, setRfqParams } = useRfqStore(
    (state) => ({
      getRfqs: state.getRfqs,
      getRfqsRecieved: state.getRfqsReceived,
      getRfqParams: state.getRfqParams,
      setRfqParams: state.setRfqParams,
    })
  );

  // Hook
  const pathName = usePathname();

  // Use Effect
  useEffect(() => {
    if (pathName === EFacPathName.RFQLIST) {
      getRfqs({
        page: getRfqParams().page,
        limit: getRfqParams().limit,
      });
    } else if (
      pathName === EComPathName.QUOFAC ||
      pathName === EComPathName.QUOMAR
    ) {
      getRfqsRecieved({
        page: getRfqParams().page,
        limit: getRfqParams().limit,
        type: pathName.includes(EComPathName.QUOFAC)
          ? ERfqSendTo.DIRECT
          : ERfqSendTo.BOTH,
      });
    }
  }, [pathName]);

  // Function
  const setPage = (page: number) => {
    const newSearchParams = {
      ...getRfqParams(),
      page,
    };
    setRfqParams(newSearchParams);
    if (pathName === EFacPathName.RFQLIST) {
      getRfqs(newSearchParams);
    } else if (
      pathName === EComPathName.QUOFAC ||
      pathName === EComPathName.QUOMAR
    ) {
      getRfqsRecieved(newSearchParams);
    }
  };

  const setLimit = (limit: number) => {
    const newSearchParams = {
      ...getRfqParams(),
      page: 1,
      limit,
    };
    setRfqParams(newSearchParams);
    if (pathName === EFacPathName.RFQLIST) {
      getRfqs(newSearchParams);
    } else if (
      pathName === EComPathName.QUOFAC ||
      pathName === EComPathName.QUOMAR
    ) {
      getRfqsRecieved(newSearchParams);
    }
  };

  return {
    setPage,
    setLimit,
  };
}
