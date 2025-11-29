import AllRoutes from "./AllRoutes";
import OilPriceDetail from "./OilPriceDetail";
import ViewRfqInfo from "./ViewRfqInfo";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import MenuButton from "@/app/components/ui/featureComponents/MenuButton";
import { useGlobalStore } from "@/app/store/globalStore";

interface ModalDetailByIdProps {
  isModalDetailOpen: boolean;
  setIsModalDetailOpen: (open: boolean) => void;
}

export default function ModalRfqDetailById({
  isModalDetailOpen,
  setIsModalDetailOpen,
}: ModalDetailByIdProps) {
  // Global State
  const currentStep = useGlobalStore((state) => state.currentStep);

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
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        {currentStep === 1 && <ViewRfqInfo />}
        {currentStep === 2 && <AllRoutes />}
        {currentStep === 3 && <OilPriceDetail />}
      </DialogContent>
    </Dialog>
  );
}
