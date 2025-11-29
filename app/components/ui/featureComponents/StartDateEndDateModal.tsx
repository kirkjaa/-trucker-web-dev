import React from "react";

import { Button } from "../button";
import { DatePicker } from "../DatePicker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";

type StartDateEndDateModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  startDateLabel: string;
  endDateLabel: string;
};

export default function StartDateEndDateModal({
  open,
  setOpen,
  title,
  startDateLabel,
  endDateLabel,
}: StartDateEndDateModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col p-2 rounded-xl bg-modal-01">
          <div className="w-full p-2">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-sm font-semibold text-neutral-08">
                {startDateLabel} <span className="text-urgent-fail-02">*</span>
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
          <div className="w-full p-2">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-sm font-semibold text-neutral-08">
                {endDateLabel} <span className="text-urgent-fail-02">*</span>
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
        </div>
        <DialogFooter>
          <div className="w-full flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              ยกเลิก
            </Button>
            <Button>ดาวน์โหลด</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
