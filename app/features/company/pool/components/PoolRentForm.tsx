"use client";

import React, { useEffect } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import clsx from "clsx";

import { DatePicker } from "@/app/components/ui/DatePicker";
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
import { IProvince } from "@/app/types/addressType";
import { ETruckSize, truckSizeLabel } from "@/app/types/enum";
import { PoolFormInputs } from "@/app/utils/validate/pool-validate";

// UseFormSetValue
type PoolRentFormProps = {
  setValue: UseFormSetValue<PoolFormInputs>;
  startDate?: Date;
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  endDate?: Date;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  errors: FieldErrors<PoolFormInputs>;
  provinces: IProvince[];
  selectedOriginProvince: string;
  setSelectedOriginProvince: React.Dispatch<React.SetStateAction<string>>;
  selectedDestinationProvince: string;
  setSelectedDestinationProvince: React.Dispatch<React.SetStateAction<string>>;
  selectedTruckSize: ETruckSize | undefined;
  setSelectedTruckSize: React.Dispatch<
    React.SetStateAction<ETruckSize | undefined>
  >;
  register: UseFormRegister<PoolFormInputs>;
  setOpenDragMapModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTypeLatLng: React.Dispatch<
    React.SetStateAction<"origin" | "destination" | undefined>
  >;

  setStartAddress?: React.Dispatch<React.SetStateAction<string | undefined>>;
  setEndAddress?: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export default function PoolRentForm({
  setValue,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  errors,
  provinces,
  selectedOriginProvince,
  setSelectedOriginProvince,
  selectedDestinationProvince,
  setSelectedDestinationProvince,
  selectedTruckSize,
  setSelectedTruckSize,
  register,
  setOpenDragMapModal,
  setTypeLatLng,
  setStartAddress,
  setEndAddress,
}: PoolRentFormProps) {
  useEffect(() => {
    if (startDate)
      setValue("jobDetailJobStartAt", startDate.toISOString().split("T")[0]);
  }, [startDate]);

  useEffect(() => {
    if (endDate)
      setValue("jobDetailJobEnd", endDate.toISOString().split("T")[0]);
  }, [endDate]);

  useEffect(() => {
    setValue("jobDetailOriginProvince", selectedOriginProvince);
    if (selectedOriginProvince) {
      setOpenDragMapModal(true);
      setTypeLatLng("origin");
      if (setStartAddress) setStartAddress(selectedOriginProvince);
    }
  }, [selectedOriginProvince]);

  useEffect(() => {
    setValue("jobDetailDestinationProvince", selectedDestinationProvince);
    if (selectedDestinationProvince) {
      setOpenDragMapModal(true);
      setTypeLatLng("destination");
      if (setEndAddress) setEndAddress(selectedDestinationProvince);
    }
  }, [selectedDestinationProvince]);

  useEffect(() => {
    setValue("jobDetailTruckSize", selectedTruckSize);
  }, [selectedTruckSize]);

  return (
    <div className="bg-modal-01 p-2 rounded-xl">
      <div className="flex justify-start w-1/2"></div>
      <div className="flex flex-col gap-1 w-full p-2">
        <p className="text-sm font-semibold text-neutral-08">
          ต้นทาง<span className="text-urgent-fail-02">*</span>
        </p>

        <Select
          value={selectedOriginProvince}
          onValueChange={(val) => setSelectedOriginProvince(val)}
        >
          <SelectTrigger
            className={clsx("py-2 px-5 bg-white border-neutral-03", {
              " border-red-500 ": errors.jobDetailOriginProvince,
            })}
          >
            <SelectValue placeholder="กรุณาเลือก" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {provinces.map((item) => (
                <SelectItem key={item.id} value={item.name_th}>
                  {item.name_th}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1 w-full p-2">
        <p className="text-sm font-semibold text-neutral-08">
          ปลายทาง <span className="text-urgent-fail-02">*</span>
        </p>

        <Select
          value={selectedDestinationProvince}
          onValueChange={(val) => {
            setSelectedDestinationProvince(val);
          }}
        >
          <SelectTrigger
            className={clsx("py-2 px-5 bg-white border-neutral-03", {
              " border-red-500 ": errors.jobDetailDestinationProvince,
            })}
          >
            <SelectValue placeholder="กรุณาเลือก" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {provinces.map((item) => (
                <SelectItem key={item.id} value={item.name_th}>
                  {item.name_th}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full flex flex-row p-2 rounded-xl bg-modal-01 flex-wrap ">
        <div className="w-1/2 pr-2">
          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold text-neutral-08">
              วันที่ <span className="text-urgent-fail-02">*</span>
            </p>

            <DatePicker
              onChange={(date) => {
                setStartDate(date);
              }}
              value={startDate}
              primary={false}
              disableDateAfter={endDate || undefined}
              disableDateBefore={new Date()}
              className={clsx({
                " border-red-500 ": errors.jobDetailJobStartAt,
              })}
            />
            {errors.jobDetailJobStartAt && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.jobDetailJobStartAt.message}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="w-1/2 pl-2">
          <div className="flex flex-col gap-1 w-full">
            <DatePicker
              onChange={(date) => {
                setEndDate(date);
              }}
              value={endDate}
              primary={false}
              disableDateBefore={startDate || undefined}
              className={clsx("mt-[1.50rem]", {
                " border-red-500 ": errors.jobDetailJobEnd,
              })}
            />
            {errors.jobDetailJobEnd && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.jobDetailJobEnd.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex w-full">
        <div className="flex flex-col gap-1 w-1/2 p-2">
          <p className="text-sm font-semibold text-neutral-08">
            ประเภทรถ <span className="text-urgent-fail-02">*</span>
          </p>

          <Select
            value={selectedTruckSize}
            onValueChange={(val: ETruckSize) => {
              setSelectedTruckSize(val);
            }}
          >
            <SelectTrigger
              className={clsx("py-2 px-5 bg-white border-neutral-03", {
                " border-red-500 ": errors.jobDetailTruckSize,
              })}
            >
              <SelectValue placeholder="กรุณาเลือก" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(ETruckSize).map((item) => (
                  <SelectItem key={item} value={item}>
                    {truckSizeLabel[item]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.jobDetailTruckSize && (
            <div className="flex gap-2 items-center">
              <Icons name="ErrorLogin" className="w-4 h-4" />
              <p className="text-sm text-red-500 text-start pt-1">
                {errors.jobDetailTruckSize.message}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 w-1/2 p-2">
          <p className="text-sm font-semibold text-neutral-08">
            จำนวนรถ
            <span className="text-urgent-fail-02">*</span>
          </p>
          <Input
            className={clsx("h-10 w-full border border-neutral-03", {
              "border-red-500": errors.jobDetailTruckQuantity,
            })}
            placeholder="จำนวนรถ"
            {...register("jobDetailTruckQuantity", { required: true })}
            type="number"
          />
          {errors.jobDetailTruckQuantity && (
            <div className="flex gap-2 items-center">
              <Icons name="ErrorLogin" className="w-4 h-4" />
              <p className="text-sm text-red-500 text-start pt-1">
                {errors.jobDetailTruckQuantity.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
