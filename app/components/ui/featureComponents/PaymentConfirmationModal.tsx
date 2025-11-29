import React from "react";
import clsx from "clsx";

import { Button } from "../button";
import { DatePicker } from "../DatePicker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { Input } from "../input";

import { Icons } from "@/app/icons";

type PaymentConfirmationModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
};

export default function PaymentConfirmationModal({
  open,
  setOpen,
  title,
}: PaymentConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="flex flex-col justify-center">
          <div className="w-full px-20">
            <Icons name="PaymentConfirm" className="" />
          </div>
          <div className="w-full">
            <p className="text-center pt-10 title3">{title}</p>
          </div>
          <div className="w-full p-2">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-sm font-semibold text-neutral-08">
                ราคาแพ็คเกจ <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  //   "border-red-500": errors.price,
                })}
                placeholder="0.00"
                BackIcon={<Icons name="Clip" className="w-5" />}
                type="file"
                // {...register("price")}
                // disabled={getDisabled()}
              />
              {/* {errors.price && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.price.message}
                  </p>
                </div>
              )} */}
            </div>
          </div>
          <div className="w-full p-2">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-sm font-semibold text-neutral-08">
                วันที่จ่าย <span className="text-urgent-fail-02">*</span>
              </p>

              <DatePicker onChange={() => {}} primary={false} />
              {/* {errors.price && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.price.message}
                  </p>
                </div>
              )} */}
            </div>
          </div>
          <div className="w-full text-center text-sm text-gray-500">
            <p>กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนดำเนินการ</p>
            <p>การจ่ายเงินนี้ไม่สามารถยกเลิกได้หลังจากยืนยัน</p>
          </div>
        </div>
        <DialogFooter>
          <div className="w-full flex justify-center gap-3">
            <Button>ยืนยัน</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              ยกเลิก
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
