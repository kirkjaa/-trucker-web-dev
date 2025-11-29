"use client";

import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import clsx from "clsx";

import usePackageForm from "../hooks/usePackageForm";

import { Button } from "@/app/components/ui/button";
import { DatePicker } from "@/app/components/ui/DatePicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Switch } from "@/app/components/ui/switch";
import { Textarea } from "@/app/components/ui/textarea";
import { Icons } from "@/app/icons";
import { usePackageStore } from "@/app/store/package/packageStore";

type PackageModalProps = {
  open: boolean;
  setOpenChange: (open: boolean) => void;
  title: string;
  disabledForm?: boolean;
};

export default function PackageModal({
  open,
  setOpenChange,
  title,
}: PackageModalProps) {
  // Global State
  const { packageById, getDisabled } = usePackageStore((state) => ({
    packageById: state.packageById,
    getDisabled: state.getDisabled,
  }));

  // Hook
  const {
    register,
    errors,
    control,
    setValue,
    watch,
    reset,
    onSubmit,
    handleSubmit,
  } = usePackageForm();

  // Use Effect
  useEffect(() => {
    if (!open) {
      reset({
        is_active: false,
        name_th: "",
        description_th: "",
        period: "",
        price: "",
        start_date: undefined,
        end_date: undefined,
      });
    }
  }, [open, reset]);

  useEffect(() => {
    if (packageById) {
      setValue("id", packageById.id);
      setValue("is_active", packageById.is_active === "Y" ? true : false);
      setValue("name_th", packageById.name_th);
      setValue("description_th", packageById.description_th);
      setValue("period", packageById.period.toString());
      setValue("price", packageById.price.toString());
      setValue("start_date", new Date(packageById.start_date));
      setValue("end_date", new Date(packageById.end_date));
    }
  }, [packageById]);

  return (
    <Dialog open={open} onOpenChange={setOpenChange}>
      <DialogContent className="max-w-[900px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap">
          <div className="w-full p-2 flex items-center">
            <Controller
              name="is_active"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  checked={value}
                  onCheckedChange={(val) => onChange(val)}
                  disabled={getDisabled()}
                />
              )}
            />

            <span className="ml-2">เปิดใช้งาน</span>
          </div>
          <div className="w-full  p-2">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-sm font-semibold text-neutral-08">
                ชื่อแพ็กเกจ <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.name_th,
                })}
                placeholder="ชื่อแพ็กเกจ"
                {...register("name_th")}
                disabled={getDisabled()}
              />
              {errors.name_th && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.name_th.message}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full p-2">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-sm font-semibold text-neutral-08">
                ระยะเวลาใช้งาน <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.period,
                })}
                type="number"
                placeholder="ระยะเวลาใช้งาน"
                {...register("period")}
                disabled={getDisabled()}
              />
              {errors.period && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.period.message}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full p-2">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-sm font-semibold text-neutral-08">
                ราคาแพ็คเกจ <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.price,
                })}
                placeholder="0.00"
                {...register("price")}
                disabled={getDisabled()}
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
          <div className="w-full flex p-2">
            <div className="flex flex-col gap-1 w-1/2">
              <div className="flex gap-1 text-sm font-semibold ">
                <p className="text-neutral-08">วันที่เริ่มต้นใช้งาน</p>
              </div>

              <Controller
                name="start_date"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    value={value}
                    onChange={onChange}
                    disabled={getDisabled()}
                    primary={false}
                    disableDateAfter={watch("end_date") || undefined}
                    disableDateBefore={new Date()}
                  />
                )}
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm">
                  {errors.start_date.message}
                </p>
              )}
            </div>
            <div className="h-0  p-4 mt-auto w-[80px] ">
              <hr />
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <div className="flex gap-1 text-sm font-semibold">
                <p className="text-neutral-08">วันที่สิ้นสุดใช้งาน</p>
              </div>
              <Controller
                name="end_date"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    value={value}
                    onChange={onChange}
                    disabled={getDisabled()}
                    primary={false}
                    disableDateBefore={watch("start_date") || undefined}
                  />
                )}
              />

              {errors.end_date && (
                <p className="text-red-500 text-sm">
                  {errors.end_date.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full p-2">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-neutral-08 text-sm font-semibold">
                รายละเอียด
              </p>
              <Textarea
                {...register("description_th")}
                className="h-24 w-full border border-neutral-03 resize-none"
                disabled={getDisabled()}
              />
            </div>
          </div>
          {/* <div className="w-full p-2"> */}
          {/*   <div className="flex flex-col gap-1 w-full"> */}
          {/*     <p className="text-sm font-semibold text-neutral-08"> */}
          {/*       รูปแบบธีม <span className="text-urgent-fail-02">*</span> */}
          {/*     </p> */}
          {/*     <Select */}
          {/*       disabled={getDisabled()} */}
          {/*       onValueChange={(val: EPackagesType) => { */}
          {/*         setSelectedPackageType(val); */}
          {/*       }} */}
          {/*       value={selectedPackageType} */}
          {/*     > */}
          {/*       <SelectTrigger */}
          {/*         className={clsx("py-2 px-5 bg-white border-neutral-03", { */}
          {/*           " border-red-500 ": errors.type, */}
          {/*         })} */}
          {/*       > */}
          {/*         <SelectValue placeholder="กรุณาเลือก" /> */}
          {/*       </SelectTrigger> */}
          {/*       <SelectContent> */}
          {/*         <SelectGroup> */}
          {/*           {optionPackageType.map((item) => ( */}
          {/*             <SelectItem key={item} value={item}> */}
          {/*               {item} */}
          {/*             </SelectItem> */}
          {/*           ))} */}
          {/*         </SelectGroup> */}
          {/*       </SelectContent> */}
          {/*     </Select> */}
          {/*   </div> */}
          {/* </div> */}
          {!getDisabled() && (
            <div className="w-full py-4 flex justify-end">
              <div className="mr-4 ">
                <Button
                  variant="main-light"
                  className="w-40"
                  onClick={() => setOpenChange(false)}
                >
                  <p>ยกเลิก</p>
                </Button>
              </div>

              <Button className="w-40" onClick={handleSubmit(onSubmit)}>
                <p>ยืนยัน</p>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
