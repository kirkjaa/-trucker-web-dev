"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { zodResolver } from "@hookform/resolvers/zod";

import useUsersForm from "../hooks/useUsersForm";

import { Button } from "@/app/components/ui/button";
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
import { Icons } from "@/app/icons";
import { EHttpStatusCode } from "@/app/types/enum";
import { formatLicensePlate } from "@/app/utils/formatTruck";
import {
  DriverAddTruckFormInputs,
  DriverAddTruckFormSchema,
} from "@/app/utils/validate/drivers-validate";

type UsersDriverTruckModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  id?: string;
  fetchDataList?: () => void;
};

export default function UsersDriverTruckModal({
  open,
  setOpen,
  id,
  fetchDataList,
}: UsersDriverTruckModalProps) {
  const [selectedTruck, setSelectedTruck] = React.useState<string>("");

  const { fetchOptionTruck, optionTruck, handleAddTruckDriver } =
    useUsersForm();

  const {
    formState: { errors },
    setValue,
    reset,
    handleSubmit,
  } = useForm<DriverAddTruckFormInputs>({
    resolver: zodResolver(DriverAddTruckFormSchema),
  });

  useEffect(() => {
    if (open) {
      fetchOptionTruck();
      if (id) setValue("id", id);
    } else {
      setSelectedTruck("");
      reset();
    }
  }, [open]);
  useEffect(() => {
    setValue("truckId", selectedTruck);
  }, [selectedTruck]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[600px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>ผูกกับรถบรรทุก</DialogTitle>
        </DialogHeader>
        <div className="bg-modal-01 p-4 rounded-xl">
          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold text-neutral-08">
              เลือกรถบรรทุก <span className="text-urgent-fail-02">*</span>
            </p>

            <Select
              value={selectedTruck}
              onValueChange={(val) => {
                setSelectedTruck(val);
              }}
            >
              <SelectTrigger
                className={clsx("py-2 px-5 bg-white border-neutral-03", {
                  "border-red-500": errors.truckId,
                })}
              >
                <SelectValue placeholder="กรุณาเลือกรถบรรทุก" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {optionTruck.map((data) => (
                    <SelectItem key={data.id} value={data.id}>
                      {formatLicensePlate(
                        data.licensePlate.value,
                        data.licensePlate.province
                      )}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors && errors.truckId && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.truckId.message}
                </p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <div className="w-full flex justify-end gap-2">
            <Button variant={"outline"} onClick={() => setOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              onClick={handleSubmit(async (data) => {
                const response = await handleAddTruckDriver(data);
                if (response.statusCode === EHttpStatusCode.SUCCESS) {
                  fetchDataList && fetchDataList();
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
