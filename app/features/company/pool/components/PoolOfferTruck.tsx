import React from "react";
import clsx from "clsx";

import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { ETruckSize, truckSizeLabel } from "@/app/types/enum";
import { TrucksListTable } from "@/app/types/truckType";

type PoolOfferTruckProps = {
  optionTruckOffer: TrucksListTable[];
  truckQuantity?: number;
  onTruckOfferChange?: (value: string, index: number) => void;
  selectedTruckOffer?: string[];
  truckSize?: ETruckSize;
};

export default function PoolOfferTruck({
  optionTruckOffer,
  truckQuantity = 1,
  onTruckOfferChange,
  selectedTruckOffer,
  truckSize,
}: PoolOfferTruckProps) {
  return (
    <div className="bg-modal-01 p-2 flex flex-row flex-wrap justify-between items-center">
      <div className="w-1/2 px-2">
        <p className="text-md font-bold text-primary-blue-04">
          {truckSize &&
            "ประเภทที่ 1 : " +
              truckSizeLabel[truckSize] +
              " " +
              truckQuantity +
              " คัน"}
        </p>
      </div>
      <div className="w-1/2 flex justify-end">
        <Button variant="secondary">เลือกรถอัตโนมัติ</Button>
      </div>
      {Array.from({ length: truckQuantity }).map((_, index) => (
        <div className="flex flex-col gap-1 w-1/2 p-2" key={index}>
          <Select
            value={selectedTruckOffer?.[index]}
            onValueChange={(value) => onTruckOfferChange?.(value, index)}
          >
            <SelectTrigger
              className={clsx(
                "py-2 px-5 bg-white text-neutral-04 border-neutral-03",
                {
                  // " border-red-500 ": errors.jobDetailDestinationProvince,
                }
              )}
            >
              <SelectValue placeholder="เลือกรถของคุณ" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {optionTruckOffer.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.licensePlate.province} {item.licensePlate.value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
