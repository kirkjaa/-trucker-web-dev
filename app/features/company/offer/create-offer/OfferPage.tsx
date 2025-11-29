"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ConfirmBidPrice from "./components/ConfirmBidPrice";
import OfferList from "./components/OfferList";
import OilRate from "./components/OilRate";
import SubHead from "./components/SubHead";

import HeaderWithBackStep from "@/app/components/ui/featureComponents/HeaderWithBackStep";
import ModalNotification from "@/app/components/ui/ModalNotification";
import { useToast } from "@/app/components/ui/toast/use-toast";
import { Icons } from "@/app/icons";
import { offerApi } from "@/app/services/offer/offerApi";
import { rfqApi } from "@/app/services/rfq/rfqApi";
import { useGlobalStore } from "@/app/store/globalStore";
import { useRfqStore } from "@/app/store/rfq/rfqStore";
import { EHttpStatusCode } from "@/app/types/enum";
import { IPriceColumn, IPriceOffer } from "@/app/types/offer/offerType";

export default function OfferPage() {
  // Global State
  const currentStep = useGlobalStore((state) => state.currentStep);
  const setRfqReceivedById = useRfqStore((state) => state.setRfqReceivedById);

  // Local State
  const [offerOilRange, setOfferOilRange] = useState<string>("2");
  const [columnRanges, setColumnRanges] = useState<Omit<IPriceColumn, "id">[]>(
    []
  );
  const [priceOffers, setPriceOffers] = useState<IPriceOffer[]>([]);
  const [offerReason, setOfferReason] = useState<string>("");
  const [isBidPriceModalOpen, setIsBidPriceModalOpen] =
    useState<boolean>(false);
  const [selectedBidPriceIndex, setSelectedBidPriceIndex] = useState<number>(0);
  const [isConfirmCreateBidModalOpen, setIsConfirmCreateBidModalOpen] =
    useState<boolean>(false);
  const [selectedSignature, setSelectedSignature] = useState<number | null>(
    null
  );

  // Hook
  const router = useRouter();
  const { toast } = useToast();
  const { rfqId } = useParams();

  // Use Effect
  useEffect(() => {
    if (rfqId) {
      const fetchDataById = async () => {
        const response = await rfqApi.getRfqReceivedById(Number(rfqId));
        if (response.statusCode === EHttpStatusCode.SUCCESS) {
          setRfqReceivedById(response.data);
        } else {
          router.back();
        }
      };

      fetchDataById();
    }
  }, [rfqId]);

  // Function
  const handleClickBidPrice = (index: number) => {
    setSelectedBidPriceIndex(index);
    setIsBidPriceModalOpen(true);
  };

  const handleClickCreateBid = () => {
    if (selectedSignature) {
      setIsConfirmCreateBidModalOpen(true);
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: "กรุณาเลือกลายเซ็นต์ก่อนกดยืนยัน",
      });
    }
  };

  const handleConfirmCreateBid = async () => {
    const res = await offerApi.createOffer({
      rfq_id: Number(rfqId),
      range_fuel_price: Number(offerOilRange),
      remark: offerReason,
      signature_id: selectedSignature ?? 0,
      column_ranges: columnRanges,
      price_offers: priceOffers,
    });
    if (res.statusCode === EHttpStatusCode.CREATED) {
      router.back();
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: res.message.th,
      });
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: res.message.th,
      });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <HeaderWithBackStep
          onClick={() => router.back()}
          iconTitle="SidebarCashBulk"
          title="เสนอราคา"
        />

        <SubHead
          priceOffers={priceOffers}
          handleClickCreateBid={handleClickCreateBid}
        />

        {currentStep === 1 && (
          <OfferList
            priceOffers={priceOffers}
            setPriceOffers={setPriceOffers}
            handleClickBidPrice={handleClickBidPrice}
            isBidPriceModalOpen={isBidPriceModalOpen}
            setIsBidPriceModalOpen={setIsBidPriceModalOpen}
            selectedBidPriceIndex={selectedBidPriceIndex ?? 0}
          />
        )}

        {currentStep === 2 && (
          <OilRate
            priceOffers={priceOffers}
            setPriceOffers={setPriceOffers}
            setOfferReason={setOfferReason}
            offerOilRange={offerOilRange}
            setOfferOilRange={setOfferOilRange}
            columnRanges={columnRanges}
            setColumnRanges={setColumnRanges}
          />
        )}

        {currentStep === 3 && (
          <ConfirmBidPrice
            offerReason={offerReason}
            priceOffers={priceOffers}
            selectedSignature={selectedSignature}
            setSelectedSignature={setSelectedSignature}
          />
        )}
      </div>

      <ModalNotification
        open={isConfirmCreateBidModalOpen}
        setOpen={setIsConfirmCreateBidModalOpen}
        title="ยืนยันการเสนอราคา"
        description="เมื่อคุณกด ยืนยัน ระบบจะทำการหัก 300 coin"
        description2="โปรดตรวจสอบข้อมูลและรายละเอียดให้ถูกต้อง"
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        icon={<Icons name="ThreeCoin" className="w-16 h-16" />}
        onConfirm={() => {
          handleConfirmCreateBid();
        }}
      />
    </>
  );
}
