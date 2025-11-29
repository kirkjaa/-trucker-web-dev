import React from "react";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import CoppyToClipboardButton from "@/app/components/ui/featureComponents/CoppyToClipboardButton";
import { Icons } from "@/app/icons";

type FactoriesAndCompaniesLatLngModalProps = {
  lattitude: string;
  longitude: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function FactoriesAndCompaniesLatLngModal({
  lattitude,
  longitude,
  open,
  setOpen,
}: FactoriesAndCompaniesLatLngModalProps) {
  const handleClickNavigate = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lattitude},${longitude}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[500px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>ดูพิกัดสถานที่</DialogTitle>
        </DialogHeader>
        <div className="bg-modal-01 p-4 rounded-lg">
          <p>ละติจูด, ลองติจูด</p>
          <div className="flex w-full justify-between items-center border-2 border-gray-300 min-h-16 mt-2 rounded-lg bg-gray-100 px-4">
            <p className="">
              {lattitude}, {longitude}
            </p>
            <CoppyToClipboardButton text={`${lattitude}, ${longitude}`} />
          </div>
        </div>
        <Button variant="main" className="w-full" onClick={handleClickNavigate}>
          <Icons name="Route" className="w-6 h-6 cursor-pointer" />
          นำทาง
        </Button>
      </DialogContent>
    </Dialog>
  );
}
