import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import DragAndDropOneFile from "@/app/components/ui/featureComponents/DragAndDropOneFile";

interface DocumentUploadModalProps {
  isModalAddDocumentFileOpen: boolean;
  setIsModalAddDocumentFileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClickConfirmUploadDocument: () => void;
  documentFile: File | null;
  setDocumentFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function DocumentUploadModal({
  isModalAddDocumentFileOpen,
  setIsModalAddDocumentFileOpen,
  handleClickConfirmUploadDocument,
  documentFile,
  setDocumentFile,
}: DocumentUploadModalProps) {
  return (
    <Dialog
      open={isModalAddDocumentFileOpen}
      onOpenChange={setIsModalAddDocumentFileOpen}
    >
      <DialogContent
        className="text-secondary-indigo-main w-full max-w-[30rem] px-0"
        outlineCloseButton
      >
        <DialogHeader>
          <DialogTitle className="px-5">
            <p className="text-xl font-bold">เพิ่มเอกสาร</p>
          </DialogTitle>

          {/* Content */}
          <div className="px-5 flex flex-col gap-4">
            <div className="p-4 bg-modal-01 rounded-lg flex flex-col gap-2">
              <p className="font-semibold">
                อัพโหลดหนังสือสัญญาจ้างขนส่ง{" "}
                <span className="text-urgent-fail-02">*</span>
              </p>

              <DragAndDropOneFile
                file={documentFile}
                setFile={setDocumentFile}
                description="รองรับไฟล์ PDF ขนาดไฟล์ไม่เกิน 10MB"
              />
            </div>

            <div className="w-full flex justify-end gap-2">
              <Button
                variant="main-light"
                className="w-28 h-8"
                onClick={() => {
                  setIsModalAddDocumentFileOpen(false);
                  setDocumentFile(null);
                }}
              >
                ยกเลิก
              </Button>
              <Button
                className="w-28 h-8"
                onClick={() => handleClickConfirmUploadDocument()}
              >
                ยืนยัน
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
