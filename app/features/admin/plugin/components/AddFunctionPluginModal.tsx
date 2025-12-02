import React, { useState } from "react";

import { PluginFeatureForm } from "../hooks/usePluginForm";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { useToast } from "@/app/components/ui/toast/use-toast";

type AddFunctionPluginModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (feature: PluginFeatureForm) => void;
};

export default function AddFunctionPluginModal({
  open,
  setOpen,
  onSave,
}: AddFunctionPluginModalProps) {
  const { toast } = useToast();
  const [featureName, setFeatureName] = useState("");
  const [description, setDescription] = useState("");
  const [limitedPrice, setLimitedPrice] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [yearlyPrice, setYearlyPrice] = useState("");

  const resetForm = () => {
    setFeatureName("");
    setDescription("");
    setLimitedPrice("");
    setMonthlyPrice("");
    setYearlyPrice("");
  };

  const handleSave = () => {
    if (!featureName.trim()) {
      toast({
        icon: "ToastError",
        variant: "error",
        description: "กรุณากรอกชื่อฟังก์ชั่น",
      });
      return;
    }

    onSave({
      featureName: featureName.trim(),
      description: description || undefined,
      limitedPrice: limitedPrice ? Number(limitedPrice) : null,
      monthlyPrice: monthlyPrice ? Number(monthlyPrice) : null,
      yearlyPrice: yearlyPrice ? Number(yearlyPrice) : null,
    });
    resetForm();
  };

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
                className="h-10 w-full border border-neutral-03"
                placeholder="ชื่อฟังก์ชั่น"
                value={featureName}
                onChange={(e) => setFeatureName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="bg-modal-01 p-4 rounded-xl mt-4 ">
          <p>ข้อมูลฟังก์ชั่นการใช้งาน</p>
          <div className="py-2 w-full flex flex-col gap-2">
            <Input
              className="h-10 w-full border border-neutral-03"
              placeholder="รายละเอียดเพิ่มเติม"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex flex-col gap-1 w-full">
              <p className="text-sm font-semibold text-neutral-08">
                ราคาจำกัดจำนวน (เหรียญ)
              </p>
              <Input
                className="h-10 w-full border border-neutral-03"
                placeholder="0.00"
                type="number"
                value={limitedPrice}
                onChange={(e) => setLimitedPrice(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <p className="text-sm font-semibold text-neutral-08">
                ราคาแบบรายเดือน (เหรียญ)
              </p>
              <Input
                className="h-10 w-full border border-neutral-03"
                placeholder="0.00"
                type="number"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <p className="text-sm font-semibold text-neutral-08">
                ราคาแบบรายปี (เหรียญ)
              </p>
              <Input
                className="h-10 w-full border border-neutral-03"
                placeholder="0.00"
                type="number"
                value={yearlyPrice}
                onChange={(e) => setYearlyPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="w-full flex justify-end gap-2">
            <Button variant={"outline"} onClick={() => setOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSave}>บันทึก</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
