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
import { Icons } from "@/app/icons";

type AddFunctionPluginModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function AddFunctionPluginModal({
  open,
  setOpen,
}: AddFunctionPluginModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[600px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>เพิ่มฟังก์ชันการใช้งาน</DialogTitle>
        </DialogHeader>
        <div className="bg-modal-01 p-4 rounded-xl ">
          <p>เพิ่มฟังก์ชั่นการใช้งาน</p>
          <div className="flex flex-row gap-2 py-2 w-full">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-sm font-semibold text-neutral-08">
                ชื่อฟังก์ชั่น <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  // "border-red-500": errors.username,
                })}
                placeholder="ชื่อฟังก์ชั่น"
              />
            </div>
          </div>
        </div>
        <div className="bg-modal-01 p-4 rounded-xl mt-4 ">
          <p>ข้อมูลฟังก์ชั่นการใช้งาน</p>
          <div className="py-2 w-full">
            <div className="mb-2 flex gap-1">
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  // "border-red-500": errors.username,
                })}
                placeholder="กรุณากรอกข้อมูล"
              />
              <Icons name="Bin" className="w-[1.5rem] text-red-500" />
            </div>
            <div className="mb-2 flex gap-1">
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  // "border-red-500": errors.username,
                })}
                placeholder="กรุณากรอกข้อมูล"
              />
              <Icons name="Bin" className="w-[1.5rem] text-red-500" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="w-full flex justify-end gap-2">
            <Button variant={"outline"} onClick={() => setOpen(false)}>
              ยกเลิก
            </Button>
            <Button>บันทึก</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
