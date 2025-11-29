import React from "react";
import clsx from "clsx";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { EAdminPathName } from "@/app/types/enum";

type TruckModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  feature: EAdminPathName;
};

export default function TruckModal({
  open,
  setOpen,
  feature,
}: TruckModalProps) {
  const textDisplay =
    feature === EAdminPathName.TRUCKSIZES ? "ขนาด (ล้อ)" : "ชื่อประเภทรถบรรทุก";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[500px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>เพิ่ม{textDisplay}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1 ">
          <p className="text-sm font-semibold text-neutral-08">
            {textDisplay}
            <span className="text-urgent-fail-02">*</span>
          </p>
          <Input
            className={clsx("h-10 w-full border border-neutral-03", {
              // "border-red-500": errors.businessType,
            })}
            placeholder={textDisplay}
            // {...register("businessType")}
          />
        </div>
        <DialogFooter>
          <div className="flex gap-1">
            <Button variant="outline" onClick={() => setOpen(false)}>
              ยกเลิก
            </Button>

            <Button>บันทึก</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
