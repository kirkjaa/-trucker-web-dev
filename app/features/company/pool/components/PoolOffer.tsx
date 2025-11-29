import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import clsx from "clsx";

import { Input } from "@/app/components/ui/input";
import { Icons } from "@/app/icons";
import { ETruckSize, truckSizeLabel } from "@/app/types/enum";
import { getDateDiffInDays } from "@/app/utils/formatDate";
import { PoolOfferFormInputs } from "@/app/utils/validate/pool-validate";

type PoolOfferProps = {
  destinationProvince: string;
  originProvince: string;
  register: UseFormRegister<PoolOfferFormInputs>;
  errors: FieldErrors<PoolOfferFormInputs>;
  truckQuantity?: number;
  truckSize?: ETruckSize;
  jobStartAt?: Date;
  jobEndAt?: Date;
};

export default function PoolOffer({
  destinationProvince,
  originProvince,
  register,
  errors,
  truckQuantity,
  truckSize,
  jobStartAt,
  jobEndAt,
}: PoolOfferProps) {
  return (
    <React.Fragment>
      <div className="border rounded-xl p-4 flex flex-col gap-4">
        <div className="w-full flex flex-row gap-2 border-b-2 pb-4">
          <Icons name="PinLight" />
          <p>
            {originProvince} {destinationProvince && "/ " + destinationProvince}
          </p>
        </div>

        {jobStartAt && jobEndAt && (
          <div className="w-full flex flex-row gap-2 border-b-2 pb-4">
            <Icons name="ClockLight" />
            <p>{getDateDiffInDays(jobStartAt, jobEndAt)} วัน</p>
          </div>
        )}

        {truckSize && (
          <div className="w-full flex flex-row gap-2 border-b-2 pb-4">
            <Icons name="TruckLight" />
            <p>
              {truckSizeLabel[truckSize]} {truckQuantity} คัน
            </p>
          </div>
        )}
      </div>
      <div className="bg-modal-01 p-2 rounded-xl">
        <div className="flex flex-col gap-1 w-full p-2">
          <p className="text-sm font-semibold text-neutral-08">
            ราคา <span className="text-urgent-fail-02">*</span>
          </p>
          <Input
            className={clsx("h-10 w-full border border-neutral-03", {
              "border-red-500": errors.offeringPrice,
            })}
            placeholder="ราคา"
            {...register("offeringPrice")}
          />
          {errors.offeringPrice && (
            <div className="flex gap-2 items-center">
              <Icons name="ErrorLogin" className="w-4 h-4" />
              <p className="text-sm text-red-500 text-start pt-1">
                {errors.offeringPrice.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
