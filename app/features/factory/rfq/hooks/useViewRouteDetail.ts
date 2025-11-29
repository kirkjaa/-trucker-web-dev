import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { offerApi } from "@/app/services/offer/offerApi";
import { rfqApi } from "@/app/services/rfq/rfqApi";
import { useGlobalStore } from "@/app/store/globalStore";
import { useOfferStore } from "@/app/store/offer/offerStore";
import { EFacPathName, EHttpStatusCode } from "@/app/types/enum";
import { IRfqById } from "@/app/types/rfq/rfqType";

export default function useViewRouteDetail() {
  // Global State
  const setCurrentStep = useGlobalStore((state) => state.setCurrentStep);
  const setOfferById = useOfferStore((state) => state.setOfferById);

  // Local State
  const [rfqById, setRfqById] = useState<IRfqById>();
  const [hoveredRoutesId, setHoveredRoutesId] = useState<number | null>(null);
  const [isModalOfferOpen, setIsModalOfferOpen] = useState<boolean>(false);
  const [hoveredCaptionById, setHoveredCaptionById] = useState<number | null>(
    null
  );

  // Hook
  const { rfqId } = useParams();
  const router = useRouter();

  // Use Effect
  useEffect(() => {
    if (rfqId) {
      const fetchDataById = async () => {
        const response = await rfqApi.getRfqById(Number(rfqId));
        if (response.statusCode === EHttpStatusCode.SUCCESS) {
          setRfqById(response.data);
        } else {
          router.replace(EFacPathName.RFQLIST);
        }
      };

      fetchDataById();
    }
  }, [rfqId]);

  // Function
  const headerLeftList: {
    key: number;
    label: string;
    width: string;
  }[] = [
    { key: 1, label: "#", width: "1%" },
    { key: 2, label: "ต้นทาง", width: "30%" },
    { key: 3, label: "ปลายทาง", width: "30%" },
    { key: 4, label: "ระยะทาง(กม.)", width: "14%" },
    { key: 5, label: "ราคา(บาท)", width: "15%" },
  ];

  const handleClickOpenOfferModal = async (offerId: number) => {
    const response = await offerApi.getOfferById(offerId);

    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      setOfferById(response.data);
      setIsModalOfferOpen(true);
      setCurrentStep(1);
    }
  };

  const handleRowHover = (routesId: number | null) => {
    setHoveredRoutesId(routesId);
  };

  return {
    rfqById,
    handleRowHover,
    headerLeftList,
    hoveredRoutesId,
    hoveredCaptionById,
    setHoveredCaptionById,
    isModalOfferOpen,
    setIsModalOfferOpen,
    handleClickOpenOfferModal,
  };
}
