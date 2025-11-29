import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Icons } from "@/app/icons";

type UploadTemplateCsvModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  handleClick?: () => void;
};

export default function UploadTemplateCsvModal({
  open,
  setOpen,
  title,
  handleClick,
}: UploadTemplateCsvModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[300px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <button
          className="rounded-3xl flex flex-wrap justify-center items-center border border-neutral-03 px-5 py-2 w-full"
          onClick={handleClick}
        >
          <div className="flex items-center py-4">
            <Icons name="ImportCsv" className="w-20 h-20" />
          </div>
          <p className="title3 w-full">นำเข้า CSV</p>
          <p className="text-primary-oxley-green-01 text-sm py-1">
            อัพโหลด Template CSV
          </p>
          <Icons name="ArrowRight" className="w-6 h-6" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
