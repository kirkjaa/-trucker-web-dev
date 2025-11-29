import React from "react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { DownloadButton } from "@/app/components/ui/featureComponents/DownloadButton";
import { downloadImage } from "@/app/utils/dowloadFile";
type CoinModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  imageUrl?: string;
};

export default function CoinModal({ open, setOpen, imageUrl }: CoinModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[600px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>หลักฐาน</DialogTitle>
        </DialogHeader>
        <div className="w-full bg-modal-01 flex justify-end items-center gap-1 p-4">
          <DownloadButton
            icon="JpgDownload"
            title="ดาวโหลด .jpg"
            onClick={() => downloadImage(imageUrl!)}
          />
          <DownloadButton icon="PdfDownload" title="ดาวโหลด .pdf" />
        </div>
        <div className="bg-modal-01 mt-4 min-h-60">
          {imageUrl && (
            <Image src={imageUrl} alt="image" width={300} height={300} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
