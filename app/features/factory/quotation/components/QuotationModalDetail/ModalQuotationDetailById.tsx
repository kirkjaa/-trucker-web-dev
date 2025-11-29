import clsx from "clsx";

import AllRoutes from "./AllRoutes";
import OilPriceDetail from "./OilPriceDetail";
import { QuotationDetail } from "./QuotationDetail";
import ViewQuotationInfo from "./ViewQuotationInfo";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { DownloadButton } from "@/app/components/ui/featureComponents/DownloadButton";
import MenuButton from "@/app/components/ui/featureComponents/MenuButton";
import { useGlobalStore } from "@/app/store/globalStore";
import { useQuotationStore } from "@/app/store/quotation/quotationStore";
import { handleExportImage, handleExportPdf } from "@/app/utils/exportFile";
import { formatId } from "@/app/utils/formatId";

interface ModalDetailByIdProps {
  isModalDetailOpen: boolean;
  setIsModalDetailOpen: (open: boolean) => void;
}

export default function ModalQuotationDetailById({
  isModalDetailOpen,
  setIsModalDetailOpen,
}: ModalDetailByIdProps) {
  // Global State
  const currentStep = useGlobalStore((state) => state.currentStep);
  const quotationById = useQuotationStore((state) => state.quotationById);

  return (
    <Dialog open={isModalDetailOpen} onOpenChange={setIsModalDetailOpen}>
      <DialogContent className="w-full px-0" outlineCloseButton>
        <DialogHeader>
          <DialogTitle>
            <div className="font-bold text-lg flex gap-10 px-5 text-main-02 border-b">
              <MenuButton
                step={1}
                title="ข้อมูลใบเปิดประมูลงาน"
                icon1="DocumentGreen"
                icon2="DocumentBulk"
              />
              <MenuButton
                step={2}
                title="เส้นทางทั้งหมด"
                icon1="PinSolid"
                icon2="PinSolidGray"
              />
              <MenuButton
                step={3}
                title="ราคาน้ำมัน"
                icon1="ChartBulkGreen"
                icon2="ChartBulkGray"
              />

              <MenuButton
                step={4}
                title="ใบเสนอราคา"
                icon1="SidebarPriceList"
                icon2="DocumentBold"
              />
            </div>

            {currentStep === 4 && (
              <div
                className={clsx(
                  "bg-modal-01 p-5 flex items-center justify-between"
                  // {
                  //   "mt-14": pathName.startsWith(
                  //     "/factory/list-of-rfq/company-selected"
                  //   ),
                  // }
                )}
              >
                <div className="flex gap-1 text-base font-medium">
                  <p className="text-secondary-indigo-main">
                    ใบเสนอราคา เลขที่
                  </p>
                  <p className="text-secondary-teal-green-main">
                    {quotationById?.display_code
                      ? formatId(quotationById?.display_code)
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
        {currentStep === 1 && <ViewQuotationInfo />}
        {currentStep === 2 && <AllRoutes />}
        {currentStep === 3 && <OilPriceDetail />}
        {currentStep === 4 && <QuotationDetail />}
      </DialogContent>
    </Dialog>
  );
}
