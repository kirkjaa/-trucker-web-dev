import { useState } from "react";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Icons } from "@/app/icons";
import { useRfqStore } from "@/app/store/rfq/rfqStore";
import { IOfferSeq, IPriceOffer } from "@/app/types/offer/offerType";
import { formatISOToDate } from "@/app/utils/formatDate";

interface ModalBidPriceProps {
  setPriceOffers: React.Dispatch<React.SetStateAction<IPriceOffer[]>>;
  isBidPriceModalOpen: boolean;
  setIsBidPriceModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBidPriceIndex: number | null;
}

export default function ModalBidPrice({
  setPriceOffers,
  isBidPriceModalOpen,
  setIsBidPriceModalOpen,
  selectedBidPriceIndex,
}: ModalBidPriceProps) {
  // Global State
  const rfqReceivedById = useRfqStore((state) => state.rfqReceivedById);

  // Local State
  const [offer, setOffer] = useState<number>(0);

  // Function
  const handleConfirm = () => {
    if (selectedBidPriceIndex !== null) {
      const selectedRoute = rfqReceivedById?.routes[selectedBidPriceIndex];
      const routeId = selectedRoute?.organization_route.id;

      if (!routeId) return;

      const offers: IOfferSeq[] = [];

      const basePrice = offer;
      const priceDown = rfqReceivedById?.price_changes_down ?? 0;
      const priceUp = rfqReceivedById?.price_changes_up ?? 0;

      const downStepAmount = basePrice * (priceDown / 100);
      const upStepAmount = basePrice * (priceUp / 100);

      for (let seq = 1; seq <= 10; seq++) {
        let price = basePrice;

        if (seq < 5) {
          const step = 5 - seq;
          price = parseFloat((basePrice - downStepAmount * step).toFixed(2));
        } else if (seq > 5) {
          const step = seq - 5;
          price = parseFloat((basePrice + upStepAmount * step).toFixed(2));
        }

        offers.push({
          sequence: seq,
          price,
          is_base_price: seq === 5,
        });
      }

      setPriceOffers((prev) => [
        ...prev.filter((o) => o.organization_route_id !== routeId),
        {
          organization_route_id: routeId,
          offers,
        },
      ]);

      setIsBidPriceModalOpen(false);
    }
  };

  return (
    <Dialog open={isBidPriceModalOpen} onOpenChange={setIsBidPriceModalOpen}>
      <DialogContent
        className="text-secondary-indigo-main w-[600px] max-w-full"
        removeCloseBtn
      >
        <DialogHeader>
          <DialogTitle>
            <p className="text-xl font-bold">เสนอราคา</p>
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="flex flex-col gap-4 text-main-01">
          <div className="border border-neutral-03 p-5 rounded-lg flex flex-col gap-4">
            <div className="flex items-start gap-2">
              <Icons name="PinLight" className="w-6 h-6" />
              <p>
                {selectedBidPriceIndex !== null &&
                  `${rfqReceivedById?.routes[selectedBidPriceIndex].organization_route.master_route.origin_province.name_th}/${rfqReceivedById?.routes[selectedBidPriceIndex].organization_route.master_route.origin_district.name_th}`}
              </p>
            </div>

            <div className="border-t border-neutral-03"></div>

            <div className="flex items-center gap-2">
              <Icons name="ClockLight" className="w-6 h-6" />
              <p>
                {rfqReceivedById?.contract_date_start &&
                  formatISOToDate.toShortFormat(
                    rfqReceivedById?.contract_date_start
                  )}
              </p>
            </div>

            <div className="border-t border-neutral-03"></div>

            <div className="flex items-center gap-2">
              <Icons name="TruckLight" className="w-6 h-6" />
              <p>
                {rfqReceivedById?.truck_size.name_th
                  ? rfqReceivedById?.truck_size.name_th
                  : "-"}
              </p>
            </div>

            <div className="border-t border-neutral-03"></div>

            <div className="flex items-start gap-2">
              <Icons name="CashLight" className="w-6 h-6" />
              <div className="flex flex-col gap-2 w-full">
                <div className="flex gap-2 bg-modal-01 p-3 rounded-lg">
                  <p>ราคาโรงงาน</p>
                  <p className="text-secondary-indigo-main font-semibold">
                    {selectedBidPriceIndex !== null &&
                      rfqReceivedById?.routes[selectedBidPriceIndex].base_price}
                  </p>
                  <p className="text-neutral-06">/ เที่ยว</p>
                </div>
                {/* <div className="flex gap-2 bg-modal-01 p-3 rounded-lg">
                  <p>ราคาโรงกลาง</p>
                  <p className="text-secondary-indigo-main font-semibold">
                    {selectedBidPriceIndex !== null &&
                      quotationById?.routesId[selectedBidPriceIndex]
                        .marketPrice}
                  </p>
                  <p className="text-neutral-06">/ เที่ยว</p>
                </div> */}
              </div>
            </div>
          </div>

          <div className="bg-modal-01 p-5 rounded-lg">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-neutral-08">
                ราคาเสนอ{" "}
                <span className="text-neutral-06">
                  (บาท/เที่ยว) <span className="text-urgent-fail-02">*</span>
                </span>
              </p>

              <Input
                type="number"
                className="h-10 w-full border border-neutral-03"
                placeholder="0.00"
                onChange={(e) => {
                  setOffer(Number(e.target.value));
                }}
              />
            </div>
          </div>

          <div className="w-full flex justify-end gap-2">
            <Button
              variant="main-light"
              className="w-40"
              onClick={() => setIsBidPriceModalOpen(false)}
            >
              ยกเลิก
            </Button>
            <Button className="w-40" onClick={() => handleConfirm()}>
              ยืนยัน
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
