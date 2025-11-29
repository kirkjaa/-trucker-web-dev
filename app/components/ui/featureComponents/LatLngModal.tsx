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

type LatLngModalProps = {
  lattitude: string;
  longitude: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function LatLngModal({
  lattitude,
  longitude,
  open,
  setOpen,
}: LatLngModalProps) {
  // Functions
  const handleClickNavigate = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lattitude},${longitude}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[500px]" outlineCloseButton>
        <DialogHeader>
          <DialogTitle className="text-secondary-indigo-main text-xl font-bold">
            ดูพิกัดสถานที่
          </DialogTitle>
        </DialogHeader>

        <div className="bg-modal-01 p-4 rounded-lg flex flex-col gap-2">
          <p className="text-sm font-semibold">ละติจูด, ลองจิจูด</p>

          <div className="bg-neutral-02 flex w-full justify-between items-center border border-gray-300 rounded-lg bg-gray-100 px-4 py-3">
            <p className="text-neutral-09">
              {lattitude}, {longitude}
            </p>
            <CoppyToClipboardButton text={`${lattitude}, ${longitude}`} />
          </div>
        </div>

        <Button className="w-full" onClick={handleClickNavigate}>
          <Icons name="Route" className="w-6 h-6 cursor-pointer" />
          นำทาง
        </Button>
      </DialogContent>
    </Dialog>
  );
}
