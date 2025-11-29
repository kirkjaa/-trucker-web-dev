import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Icons } from "@/app/icons";

type ViewFileModalProps = {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function ViewFileModal({
  title,
  open,
  setOpen,
}: ViewFileModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[600px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="bg-modal-01 flex justify-end">
          <div className=" w-1/3">
            <div className=" bg-modal-01 h-14 rounded-lg flex justify-end items-center px-4 ">
              <Icons
                name="ImportCsv"
                className="w-8 h-8 cursor-pointer mr-4"
                onClick={() => {}}
              />
              <p className="text-sm text-cyan-600 cursor-pointer hover:text-cyan-700">
                ดาวน์โหลด .JPG
              </p>
            </div>
          </div>
          <div className=" w-1/3">
            {" "}
            <div className=" bg-modal-01 h-14 rounded-lg flex justify-end items-center px-4 ">
              <Icons
                name="ImportCsv"
                className="w-8 h-8 cursor-pointer mr-4"
                onClick={() => {}}
              />
              <p className="text-sm text-cyan-600 cursor-pointer hover:text-cyan-700">
                ดาวน์โหลด .PDF
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
