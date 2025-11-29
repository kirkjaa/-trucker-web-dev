"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { DriversStatus, ReviewDriverReason } from "@/app/types/enum";
import placeHolderPerson from "@/public/placeHolderPerson.png";

type DriversReviewModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  onSubmit: (reason?: ReviewDriverReason, remark?: string) => void;
  status?: DriversStatus;
  imageUrl?: string;
  name?: string;
};

export default function DriversReviewModal({
  open,
  setOpen,
  title,
  onSubmit,
  status,
  imageUrl,
  name,
}: DriversReviewModalProps) {
  const [reason, setReason] = React.useState<ReviewDriverReason>();
  const [remark, setRemark] = React.useState<string>("");
  const [errorReason, setErrorReason] = React.useState<boolean>(false);

  const handleSubmit = () => {
    if (status === DriversStatus.REJECTED && reason === undefined) {
      setErrorReason(true);
      return;
    }
    setErrorReason(false);
    onSubmit(reason, remark);
    setOpen(false);
  };
  useEffect(() => {
    if (reason && status === DriversStatus.REJECTED) {
      setErrorReason(false);
    }
  }, [reason]);
  useEffect(() => {
    setErrorReason(false);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[400px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>
          <div className="flex flex-wrap">
            <div className="h-2/3 w-full flex justify-center items-center mb-4">
              <Image
                src={imageUrl || placeHolderPerson}
                alt="user image"
                width={80}
                height={80}
                className="w-fit h-fit rounded-full border"
              />
            </div>

            <div className="flex justify-center w-full">
              <div className="text-center text-gray-600">{name}</div>
            </div>
          </div>

          {status === DriversStatus.REJECTED && (
            <div className="py-4 h-2/4 flex flex-col gap-3">
              <p>
                เหตุผล <span className="text-urgent-fail-02">*</span>
              </p>
              <Select
                onValueChange={(val: ReviewDriverReason) => setReason(val)}
              >
                <SelectTrigger
                  className={clsx("py-2 px-5 bg-white border-neutral-03", {
                    "border-urgent-fail-02": errorReason,
                  })}
                >
                  <SelectValue placeholder="กรุณาเลือก" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(ReviewDriverReason).map(([key, value]) => (
                      <SelectItem key={key} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Textarea
                className="h-28 w-full border border-neutral-03"
                disabled={reason !== ReviewDriverReason.อื่นๆ}
                placeholder="แสดงความคิดเห็น"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setRemark(e.target.value);
                }}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <div className="w-full">
            <button
              className={clsx(
                "w-full text-white px-6 py-2 rounded-lg focus:ring",
                {
                  "bg-green-700 hover:bg-green-900 focus:ring-green-700":
                    status === DriversStatus.APPROVE,
                  "bg-red-700 hover:bg-red-900 focus:ring-red-700":
                    status === DriversStatus.REJECTED,
                }
              )}
              onClick={handleSubmit}
            >
              {status === DriversStatus.APPROVE ? "ยืนยัน" : "ปฏิเสธ"}คนขับ
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
