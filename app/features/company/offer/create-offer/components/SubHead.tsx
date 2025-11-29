import { useEffect } from "react";

import BreadCrumb from "../../../../../components/ui/featureComponents/BreadCrumb";

import { Button } from "@/app/components/ui/button";
import { CardDetail } from "@/app/components/ui/featureComponents/CardDetail";
import { DownloadButton } from "@/app/components/ui/featureComponents/DownloadButton";
import { Icons } from "@/app/icons";
import { useGlobalStore } from "@/app/store/globalStore";
import { useRfqStore } from "@/app/store/rfq/rfqStore";
import { IPriceOffer } from "@/app/types/offer/offerType";
import { handleExportImage, handleExportPdf } from "@/app/utils/exportFile";

interface ISubHeadProps {
  priceOffers: IPriceOffer[];
  handleClickCreateBid: () => void;
}

export default function SubHead({
  priceOffers,
  handleClickCreateBid,
}: ISubHeadProps) {
  // Global State
  const { currentStep, handleNextStep, handleBackStep, setCurrentStep } =
    useGlobalStore((state) => ({
      currentStep: state.currentStep,
      handleNextStep: state.handleNextStep,
      handleBackStep: state.handleBackStep,
      setCurrentStep: state.setCurrentStep,
    }));
  const rfqReceivedById = useRfqStore((state) => state.rfqReceivedById);

  // Use Effect
  useEffect(() => {
    setCurrentStep(1);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-modal-01 px-5 py-3 rounded-lg flex justify-between items-center">
        <div className="text-base font-bold flex items-center gap-2">
          <BreadCrumb step={1} step2={2} step3={3} title="รายการเสนอราคา" />
          <BreadCrumb step={2} step2={3} title="เรทราคาน้ำมัน" />
          <BreadCrumb step={3} title="ยืนยันการเสนอราคา" isLast />
        </div>

        {currentStep !== 3 && (
          <div className="flex gap-4 items-center">
            {currentStep !== 1 && (
              <Button variant="main-light" onClick={handleBackStep}>
                <Icons name="ChevronLeft" className="w-6 h-6" />
                ย้อนกลับ
              </Button>
            )}
            <Button
              variant="secondary"
              className="px-8"
              onClick={handleNextStep}
              disabled={priceOffers.length !== rfqReceivedById?.routes.length}
            >
              <p className="button">ถัดไป</p>
              <Icons name="ChevronRight" className="w-6 h-6" />
            </Button>
          </div>
        )}
        {currentStep === 3 && (
          <div className="flex gap-4 items-center">
            <DownloadButton
              icon="JpgDownload"
              title="ดาวโหลด .jpg"
              onClick={() =>
                handleExportImage(
                  "confirmBidPricePrint",
                  "quotation-detail.jpg"
                )
              }
            />
            <DownloadButton
              icon="PdfDownload"
              title="ดาวโหลด .pdf"
              onClick={() =>
                handleExportPdf("confirmBidPricePrint", "quotation-detail.pdf")
              }
            />

            <div className="border-l-2 border-neutral-04 h-[2.5rem]"></div>

            <Button variant="main-light" onClick={handleBackStep}>
              <Icons name="ChevronLeft" className="w-6 h-6" />
              ย้อนกลับ
            </Button>
            <Button variant="main-light" disabled>
              บันทึกร่าง
            </Button>
            <Button onClick={handleClickCreateBid}>ยืนยันการเสนอราคา</Button>
          </div>
        )}
      </div>

      {currentStep !== 3 && (
        <div className="flex gap-4 justify-between">
          <CardDetail
            iconName="TruckType"
            title="ประเภทของรถ"
            value={
              rfqReceivedById?.truck_type.name_th
                ? rfqReceivedById?.truck_type.name_th
                : "-"
            }
          />
          <CardDetail
            iconName="OilPrice"
            title="ราคาน้ำมันวันที่ 1-15"
            value={
              rfqReceivedById?.fuel_price
                ? rfqReceivedById?.fuel_price + " " + "บาท"
                : "-"
            }
            value2="/ลิตร"
          />

          {currentStep === 2 && (
            <>
              <CardDetail
                iconName="OilUpPrice"
                title="ราคาผันขึ้น"
                value={
                  rfqReceivedById?.price_changes_up
                    ? rfqReceivedById?.price_changes_up + " " + "%"
                    : "-"
                }
                iconName2="ChevronUpBulk"
                oilUp
              />
              <CardDetail
                iconName="OilDownPrice"
                title="ราคาผันลง"
                value={
                  rfqReceivedById?.price_changes_down
                    ? rfqReceivedById?.price_changes_down + " " + "%"
                    : "-"
                }
                iconName2="ChevronDownBulk"
                oilDown
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
