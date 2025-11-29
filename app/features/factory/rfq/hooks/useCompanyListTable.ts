import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { offerApi } from "@/app/services/offer/offerApi";
import { quotationApi } from "@/app/services/quotation/quotationApi";
import { rfqApi } from "@/app/services/rfq/rfqApi";
import { useGlobalStore } from "@/app/store/globalStore";
import { useOfferStore } from "@/app/store/offer/offerStore";
import { EFacPathName, EHttpStatusCode } from "@/app/types/enum";
import { EOfferStatus } from "@/app/types/offer/offerEnum";
import { IRfqById } from "@/app/types/rfq/rfqType";

export default function useCompanyListTable() {
  // Global State
  const setOfferById = useOfferStore((state) => state.setOfferById);
  const setCurrentStep = useGlobalStore((state) => state.setCurrentStep);

  // Local State
  const [rfqById, setRfqById] = useState<IRfqById>();
  const [modalStates, setModalStates] = useState({
    offerDetail: { isOpen: false },
    selectedCompany: {
      isOpen: false,
      offerId: 0,
      companyName: "",
    },
    deleteCompany: {
      isOpen: false,
      offerId: 0,
      companyName: "",
    },
  });
  const [expandedTables, setExpandedTables] = useState<number[]>([]);

  // Hook
  const router = useRouter();
  const { rfqId } = useParams();
  const { toast } = useToast();

  // Use Effect
  useEffect(() => {
    if (rfqId) {
      const fetchDataById = async () => {
        const response = await rfqApi.getRfqById(Number(rfqId));
        if (response.statusCode === EHttpStatusCode.SUCCESS) {
          setRfqById(response.data);
          setCurrentStep(1);
        } else {
          router.replace(EFacPathName.RFQLIST);
        }
      };

      fetchDataById();
    }
  }, [rfqId]);

  // Function
  const handleNavigation = {
    back: () => router.push(EFacPathName.RFQLIST),

    openOfferModal: async (offerId: number) => {
      const response = await offerApi.getOfferById(offerId);

      if (response.statusCode === EHttpStatusCode.SUCCESS)
        setOfferById(response.data);
      setModalStates((prev) => ({
        ...prev,
        offerDetail: { isOpen: true },
      }));
    },

    toggleTableExpansion: async (offerId: number) => {
      if (expandedTables.includes(offerId)) {
        setExpandedTables(expandedTables.filter((id) => id !== offerId));
      } else {
        const response = await offerApi.getOfferById(offerId);

        if (response.statusCode === EHttpStatusCode.SUCCESS) {
          setOfferById(response.data);
          setExpandedTables([...expandedTables, offerId]);
        }
      }
    },

    selectCompany: (offerId: number, companyName: string) => {
      setModalStates((prev) => ({
        ...prev,
        selectedCompany: { isOpen: true, offerId, companyName },
      }));
    },

    deleteCompany: (offerId: number, companyName: string) => {
      setModalStates((prev) => ({
        ...prev,
        deleteCompany: { isOpen: true, offerId, companyName },
      }));
    },
  };

  const handleCompanyAction = {
    approve: async (rfqId: number, offerId: number) => {
      try {
        const response = await quotationApi.createQuotation(rfqId, offerId);

        if (response.statusCode === EHttpStatusCode.CREATED) {
          router.push(EFacPathName.RFQLIST);
          toast({
            icon: "ToastSuccess",
            variant: "success",
            description: "เลือกบริษัทขนส่งสำเร็จตรวจสอบได้ที่",
            descriptionTwo: "'รายการรอดำเนินการ'",
          });
        }
      } catch (error) {
        toast({
          icon: "ToastError",
          variant: "error",
          description: "เลือกบริษัทขนส่งไม่สำเร็จ โปรดลองอีกครั้ง",
        });
      }
    },

    reject: async (offerId: number) => {
      try {
        const response = await offerApi.updateOfferStatus(
          offerId,
          EOfferStatus.REJECTED
        );
        if (response.statusCode === EHttpStatusCode.SUCCESS) {
          router.push(EFacPathName.RFQLIST);
          toast({
            icon: "ToastSuccess",
            variant: "success",
            description: "ยกเลิกบริษัทขนส่งสำเร็จ",
          });
        }
      } catch (error) {
        toast({
          icon: "ToastError",
          variant: "error",
          description: "ยกเลิกบริษัทขนส่งไม่สำเร็จ โปรดลองอีกครั้ง",
        });
      }
    },
  };

  return {
    rfqById,
    modalStates,
    setModalStates,
    expandedTables,
    handleNavigation,
    handleCompanyAction,
  };
}
