import React, { useEffect } from "react";
import clsx from "clsx";

import usePriceEntryForm from "../hooks/usePriceEntryForm";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Icons } from "@/app/icons";
import { EHttpStatusCode, ETruckSize } from "@/app/types/enum";

type AddPriceEntryModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  address?: string;
  masterRouteId?: string;
  fetchData?: () => void;
};

export default function AddPriceEntryModal({
  open,
  setOpen,
  address,
  masterRouteId,
  fetchData,
}: AddPriceEntryModalProps) {
  const {
    register,
    errors,
    handleCreate,
    handleSubmit,
    selectedTruckSize,
    setSelectedTruckSize,
    setValue,
    handleResetForm,
  } = usePriceEntryForm();

  useEffect(() => {
    if (selectedTruckSize) setValue("truckSize", selectedTruckSize);
    if (masterRouteId) setValue("masterRouteId", masterRouteId);
  }, [selectedTruckSize, masterRouteId]);
  useEffect(() => {
    if (!open) {
      handleResetForm();
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[600px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>เพิ่มข้อมูลประเภทและราคา</DialogTitle>
        </DialogHeader>
        <div className="p-4 flex flex-wrap w-full">
          <div className="w-full text-secondary-indigo-main font-bold">
            {address}
          </div>
          <div className="w-full py-4">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-sm font-semibold text-neutral-08">
                ประเภทรถ <span className="text-urgent-fail-02">*</span>
              </p>

              <Select
                onValueChange={(val: ETruckSize) => setSelectedTruckSize(val)}
                value={selectedTruckSize}
              >
                <SelectTrigger
                  className={clsx(
                    "py-2 px-5 bg-white text-neutral-04 border-neutral-03",
                    {
                      "border-red-500": errors.truckSize,
                    }
                  )}
                >
                  <SelectValue placeholder="กรุณาเลือกประเภทรถ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(ETruckSize).map(([key, value]) => (
                      <SelectItem key={key} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.truckSize && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.truckSize.message}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full">
            <div className="flex flex-col gap-1 ">
              <p className="text-sm font-semibold text-neutral-08">
                ราคา (บาท)
                <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                type="number"
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.price,
                })}
                placeholder="0.00"
                {...register("price")}
              />
              {errors.price && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.price.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="w-full flex justify-end gap-2">
            <Button variant={"outline"} onClick={() => setOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              onClick={handleSubmit(async (data) => {
                const response = await handleCreate(data);
                if (response.statusCode === EHttpStatusCode.CREATED) {
                  fetchData && fetchData();
                  setOpen(false);
                }
              })}
            >
              ยืนยัน
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
