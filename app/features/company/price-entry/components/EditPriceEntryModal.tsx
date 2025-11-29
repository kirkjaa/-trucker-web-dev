"use client";

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
import { IRoutePriceEntry } from "@/app/types/routesType";
import { PriceEntryFormListInputs } from "@/app/utils/validate/price-entry-validate";

type EditPriceEntryModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  priceEntriesListProp?: IRoutePriceEntry[];
  address?: string;
  fetchData?: () => void;
};

export default function EditPriceEntryModal({
  open,
  setOpen,
  priceEntriesListProp,
  address,
  fetchData,
}: EditPriceEntryModalProps) {
  const {
    errorList,
    handleUpdate,
    setPriceEntriesList,
    setValueList,
    priceEntriesList,
    getValueList,
    fields,
    registerList,
    remove,
  } = usePriceEntryForm();
  useEffect(() => {
    setPriceEntriesList(priceEntriesListProp || []);
    const data = priceEntriesListProp?.map((priceEntry) => ({
      id: priceEntry.id,
      truckSize: priceEntry.truckSize,
      price: priceEntry.price,
    }));

    const form: PriceEntryFormListInputs = {
      payload: data || [],
    };

    setValueList("payload", form.payload);
  }, [priceEntriesListProp]);

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
          {fields.map((priceEntry, index) => (
            <React.Fragment key={index}>
              <div className="w-full py-4 flex gap-1 items-center">
                <div className="flex flex-col gap-1 w-[45%]">
                  <p className="text-sm font-semibold text-neutral-08">
                    ประเภทรถ <span className="text-urgent-fail-02">*</span>
                  </p>

                  <Select
                    value={getValueList("payload")?.[index]?.truckSize}
                    onValueChange={(val: ETruckSize) => {
                      setPriceEntriesList(
                        priceEntriesList.map((priceEntry) => {
                          if (priceEntry.id === priceEntry.id) {
                            return {
                              ...priceEntry,
                              truckSize: val,
                            };
                          }
                          return priceEntry;
                        })
                      );
                      setValueList("payload", {
                        ...getValueList("payload"),
                        [index]: {
                          ...getValueList("payload")?.[index],
                          truckSize: val,
                        },
                      });
                    }}
                  >
                    <SelectTrigger
                      className={clsx(
                        "py-2 px-5 bg-white text-neutral-04 border-neutral-03",
                        {
                          "border-red-500":
                            errorList &&
                            errorList.payload &&
                            errorList.payload[index]?.truckSize,
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
                  {errorList && errorList.payload && (
                    <div className="flex gap-2 items-center">
                      <Icons name="ErrorLogin" className="w-4 h-4" />
                      <p className="text-sm text-red-500 text-start pt-1">
                        {errorList.payload[index]?.truckSize?.message}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 w-[45%]">
                  <p className="text-sm font-semibold text-neutral-08">
                    ราคา (บาท)
                    <span className="text-urgent-fail-02">*</span>
                  </p>
                  <Input
                    type="number"
                    className={clsx("h-10 w-full border border-neutral-03", {
                      "border-red-500":
                        errorList &&
                        errorList.payload &&
                        errorList.payload[index]?.price,
                    })}
                    placeholder="0.00"
                    {...registerList(`payload.${index}.price`)}
                  />
                  {errorList && errorList.payload && (
                    <div className="flex gap-2 items-center">
                      <Icons name="ErrorLogin" className="w-4 h-4" />
                      <p className="text-sm text-red-500 text-start pt-1">
                        {errorList.payload[index]?.price?.message}
                      </p>
                    </div>
                  )}
                </div>
                <div className="w-[10%] flex mt-4 ml-4 justify-self-end">
                  <Icons
                    name="Bin"
                    className="w-4 h-4 hover:cursor-pointer text-red-500"
                    onClick={() => remove(index)}
                  />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
        <DialogFooter>
          <div className="w-full flex justify-end gap-2">
            <Button variant={"outline"} onClick={() => setOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              onClick={async () => {
                const response = await handleUpdate();
                if (response.statusCode === EHttpStatusCode.SUCCESS) {
                  fetchData && fetchData();
                  setOpen(false);
                }
              }}
            >
              ยืนยัน
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
