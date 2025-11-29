import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useOfferStore } from "@/app/store/offer/offerStore";
import { EComPathName } from "@/app/types/enum";
import { EOfferStatus } from "@/app/types/offer/offerEnum";
import { ERfqSendTo } from "@/app/types/rfq/rfqEnum";

export default function useAllOffers() {
  // Global State
  const { getOfferByStatus, getOfferParams, setOfferParams } = useOfferStore(
    (state) => ({
      getOfferByStatus: state.getOfferByStatus,
      getOfferParams: state.getOfferParams,
      setOfferParams: state.setOfferParams,
    })
  );

  // Hooks
  const pathName = usePathname();

  // Use Effect
  useEffect(() => {
    if (
      pathName === EComPathName.QUOFAC_OFFERED ||
      pathName === EComPathName.QUOMAR_OFFERED
    ) {
      getOfferByStatus({
        page: getOfferParams().page,
        limit: getOfferParams().limit,
        type: pathName.includes(EComPathName.QUOFAC)
          ? ERfqSendTo.DIRECT
          : ERfqSendTo.BOTH,
        status: EOfferStatus.OFFER,
      });
    } else if (
      pathName === EComPathName.QUOFAC_REJECTED ||
      pathName === EComPathName.QUOMAR_REJECTED
    ) {
      getOfferByStatus({
        page: getOfferParams().page,
        limit: getOfferParams().limit,
        type: pathName.includes(EComPathName.QUOFAC)
          ? ERfqSendTo.DIRECT
          : ERfqSendTo.BOTH,
        status: EOfferStatus.REJECTED,
      });
    } else if (
      pathName === EComPathName.QUOFAC_CANCELED ||
      pathName === EComPathName.QUOMAR_CANCELED
    ) {
      getOfferByStatus({
        page: getOfferParams().page,
        limit: getOfferParams().limit,
        type: pathName.includes(EComPathName.QUOFAC)
          ? ERfqSendTo.DIRECT
          : ERfqSendTo.BOTH,
        status: EOfferStatus.CANCELED,
      });
    }
  }, []);

  // Functions
  const setPage = (page: number) => {
    const newGlobalParams = {
      ...getOfferParams(),
      page,
    };
    setOfferParams(newGlobalParams);
    getOfferByStatus(newGlobalParams);
  };

  const setLimit = (limit: number) => {
    const newGlobalParams = {
      ...getOfferParams(),
      limit,
    };
    setOfferParams(newGlobalParams);
    getOfferByStatus(newGlobalParams);
  };

  return {
    setPage,
    setLimit,
  };
}
