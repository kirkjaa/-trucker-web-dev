import clsx from "clsx";
import { usePathname } from "next/navigation";

import OilPriceDetail from "./OilPriceDetail";
import { QuotationDetail } from "./QuotationDetail";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { DownloadButton } from "@/app/components/ui/featureComponents/DownloadButton";
import { useGlobalStore } from "@/app/store/globalStore";
import { useOfferStore } from "@/app/store/offer/offerStore";
import { EFacPathName } from "@/app/types/enum";
import { handleExportImage, handleExportPdf } from "@/app/utils/exportFile";
import { formatId } from "@/app/utils/formatId";

interface OfferDetailModalProps {
  isModalOfferOpen: boolean;
  setIsModalOfferOpen: (open: boolean) => void;
}

export default function OfferDetailModal({
  isModalOfferOpen,
  setIsModalOfferOpen,
}: OfferDetailModalProps) {
  // Global State
  const offerById = useOfferStore((state) => state.offerById);
  const { currentStep, setCurrentStep } = useGlobalStore((state) => ({
    currentStep: state.currentStep,
    setCurrentStep: state.setCurrentStep,
  }));

  // Hook
  const pathName = usePathname();

  return (
    <Dialog open={isModalOfferOpen} onOpenChange={setIsModalOfferOpen}>
      <DialogContent className="w-full px-0" outlineCloseButton>
        <DialogHeader>
          <DialogTitle>
            <div
              className={clsx(
                "font-bold text-lg  flex gap-6 px-5 text-primary-blue-main",
                {
                  "border-b": currentStep === 2,
                },
                {
                  hidden: pathName.startsWith(EFacPathName.COMPANY_SELECTED),
                }
              )}
            >
              <p
                className={clsx("pb-4 cursor-pointer", {
                  "border-b-2 border-primary-blue-main": currentStep === 1,
                })}
                onClick={() => setCurrentStep(1)}
              >
                ใบเสนอราคา
              </p>
              <p
                className={clsx("pb-4 cursor-pointer", {
                  "border-b-2 border-primary-blue-main": currentStep === 2,
                })}
                onClick={() => setCurrentStep(2)}
              >
                ราคาน้ำมัน
              </p>
            </div>
            {currentStep === 1 && (
              <div
                className={clsx(
                  "bg-modal-01 p-5 flex items-center justify-between",
                  {
                    "mt-14": pathName.startsWith(EFacPathName.COMPANY_SELECTED),
                  }
                )}
              >
                <div className="flex gap-1 text-base font-medium">
                  <p className="text-secondary-indigo-main">
                    ใบเสนอราคา เลขที่
                  </p>
                  <p className="text-secondary-teal-green-main">
                    {offerById && offerById.display_code
                      ? formatId(offerById.display_code)
                      : "-"}
                  </p>
                </div>
                <div className="flex gap-3 text-secondary-indigo-main">
                  <DownloadButton
                    icon="JpgDownload"
                    title="ดาวโหลด .jpg"
                    onClick={() =>
                      handleExportImage(
                        "quotationDetailPrint",
                        "quotation-detail.jpg"
                      )
                    }
                  />
                  <DownloadButton
                    icon="PdfDownload"
                    title="ดาวโหลด .pdf"
                    onClick={() =>
                      handleExportPdf(
                        "quotationDetailPrint",
                        "quotation-detail.pdf"
                      )
                    }
                  />
                </div>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        {currentStep === 1 && <QuotationDetail />}
        {currentStep === 2 && <OilPriceDetail />}
      </DialogContent>
    </Dialog>
  );
}
