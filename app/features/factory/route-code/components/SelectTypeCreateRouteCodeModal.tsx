import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import useImportRouteCode from "../hooks/useImportRouteCode";

import ImportCsvModal from "./ImportCsvModal";
import ManualCreateRouteCodeModal from "./ManualCreateRouteCodeModal";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { CardModal } from "@/app/components/ui/featureComponents/CardModal";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { useUploadTemplateCsvStore } from "@/app/store/uploadTemplateCsvStore";
import { useUserStore } from "@/app/store/userStore";
import {
  EFacPathName,
  ERouteShippingType,
  EUploadTemplateType,
} from "@/app/types/enum";

interface SelectTypeCreateRouteCodeModalProps {
  isSelectTypeCreateRouteCodeModalOpen: boolean;
  setIsSelectTypeCreateRouteCodeModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export default function SelectTypeCreateRouteCodeModal({
  isSelectTypeCreateRouteCodeModalOpen,
  setIsSelectTypeCreateRouteCodeModalOpen,
}: SelectTypeCreateRouteCodeModalProps) {
  // Global State
  const { userMe } = useUserStore();
  const { getTemplateByFactoryId } = useUploadTemplateCsvStore();

  // Local State
  const [
    isManualCreateRouteCodeModalOpen,
    setIsManualCreateRouteCodeModalOpen,
  ] = useState<boolean>(false);
  const [selectedShippingType, setSelectedShippingType] =
    useState<ERouteShippingType>(ERouteShippingType.SEAFREIGHT);

  // Hook
  const pathName = usePathname();
  const {
    isImportCsvModalOpen,
    setIsImportCsvModalOpen,
    csvData,
    fileInputRef,
    transformedData,
    handleClickImportCsv,
    handleFileUpload,
  } = useImportRouteCode();

  // Use Effect
  useEffect(() => {
    if (userMe?.factory?.id && isSelectTypeCreateRouteCodeModalOpen) {
      getTemplateByFactoryId(
        userMe?.factory?.id,
        EUploadTemplateType.CREATEROUTE
      );
      setSelectedShippingType(ERouteShippingType.SEAFREIGHT);
    }
  }, [isSelectTypeCreateRouteCodeModalOpen]);

  // Function
  const handleClickBranch = () => {
    setIsSelectTypeCreateRouteCodeModalOpen(false);
    setIsManualCreateRouteCodeModalOpen(true);
  };

  return (
    <>
      <Dialog
        open={isSelectTypeCreateRouteCodeModalOpen}
        onOpenChange={setIsSelectTypeCreateRouteCodeModalOpen}
      >
        <DialogContent className="w-modal bg-white/80" outlineCloseButton>
          <DialogHeader>
            <DialogTitle>
              <p className="text-lg font-bold">
                {pathName === EFacPathName.DOMESTIC_ROUTE
                  ? "เพิ่มรหัสเส้นทางในประเทศ"
                  : "เพิ่มรหัสเส้นทางต่างประเทศ"}
              </p>
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          {pathName === EFacPathName.INTERNATIONAL_ROUTE && (
            <RadioGroup
              className="flex gap-10 full-hd:gap-14 bg-modal-01 px-5 py-3 rounded-lg"
              value={selectedShippingType}
              onValueChange={(value) =>
                setSelectedShippingType(value as ERouteShippingType)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={ERouteShippingType.SEAFREIGHT}
                  id={ERouteShippingType.SEAFREIGHT}
                />
                <p className="02:text-sm full-hd:body2">ส่งทางเรือ</p>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={ERouteShippingType.AIRFREIGHT}
                  id={ERouteShippingType.AIRFREIGHT}
                />
                <p className="02:text-sm full-hd:body2">ส่งทางเครื่องบิน</p>
              </div>
            </RadioGroup>
          )}

          <div className="flex justify-between items-center gap-6">
            <CardModal
              iconCard="ImportCsv"
              title="นำเข้า CSV"
              title2="สร้างรหัสเส้นทาง"
              onClick={handleClickImportCsv}
            />
            <CardModal
              iconCard="BranchIcon"
              title="กำหนดเอง"
              title2="สร้างรหัสเส้นทาง"
              onClick={handleClickBranch}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* CSV */}
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
      />
      <ImportCsvModal
        csvData={csvData || []}
        transformedData={transformedData || []}
        isImportCsvModalOpen={isImportCsvModalOpen}
        setIsImportCsvModalOpen={setIsImportCsvModalOpen}
        selectedShippingType={selectedShippingType}
        setIsSelectTypeCreateRouteCodeModalOpen={
          setIsSelectTypeCreateRouteCodeModalOpen
        }
      />

      {/* Manual Create Route Code Modal */}
      <ManualCreateRouteCodeModal
        isManualCreateRouteCodeModalOpen={isManualCreateRouteCodeModalOpen}
        setIsManualCreateRouteCodeModalOpen={
          setIsManualCreateRouteCodeModalOpen
        }
        selectedShippingType={selectedShippingType}
        setSelectedShippingType={setSelectedShippingType}
      />
    </>
  );
}
