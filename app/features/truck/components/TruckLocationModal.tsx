import React, { useEffect } from "react";
import clsx from "clsx";

import useTruckTableList from "../hooks/useTruckTableList";

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
import useAddress from "@/app/hooks/useAddress";
import { Icons } from "@/app/icons";
import { ITruckLocation } from "@/app/types/truckType";

type TruckLocationModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  licensePlate?: string;
  code?: string;
  value?: string;

  location?: ITruckLocation;
  id?: string;
};

export default function TruckLocationModal({
  open,
  setOpen,
  licensePlate,
  code,
  value,

  location,
  id,
}: TruckLocationModalProps) {
  const { provinces } = useAddress();
  const [isError, setIsError] = React.useState(false);
  const [province, setProvince] = React.useState<string>("");
  const { onSubmitModalLocation } = useTruckTableList();
  useEffect(() => {
    if (value && provinces.some((item) => item.name_th === value)) {
      setProvince(value);
    } else {
      setProvince("");
    }
  }, [value, provinces]);

  useEffect(() => {
    if (province) {
      setIsError(false);
    }
  }, [province]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[500px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>ตำแหน่งของรถบรรทุก</DialogTitle>
        </DialogHeader>
        <div className="border min-h-64 rounded-lg">
          <div className="flex flex-col h-full p-4">
            <div className="h-1/2 w-full">
              <div className="flex justify-start gap-2 ">
                <Icons name="PinLight" />
                <p>ตำแหน่ง</p>
              </div>
              <div className="flex flex-col justify-start gap-2 mt-2">
                <p className="w-full">
                  จังหวัด : {location && location?.currentLocation}
                </p>
                <p className="w-full">
                  ละติจูด ลองจิจูด :{" "}
                  {location && location?.latitude + ", " + location?.longitude}
                </p>
              </div>
            </div>
            <hr className="py-2" />
            <div className="h-1/2 w-full">
              <div className="flex justify-start gap-2 ">
                <Icons name="TruckLight" />
                <p>ข้อมูลรถบรรทุก</p>
              </div>
              <div className="flex flex-col justify-start gap-2 mt-2 ">
                <p className=" w-full flex justify-start">
                  <span className="w-1/3">รหัสรถบรรทุก</span>
                  <span className=" w-1/12">:</span>
                  <span className="w-full">{code}</span>
                </p>
                <p className=" w-full flex justify-start">
                  <span className="w-1/3 break-words">ป้ายทะเบียน</span>
                  <span className=" w-1/12">:</span>{" "}
                  <span className="w-full break-words">{licensePlate}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className=" bg-modal-01 min-h-26 py-4 px-2 rounded-lg">
          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm text-neutral-08">
              รีเซ็ตตำแหน่งไปยัง..
              <span className="text-urgent-fail-02">*</span>
            </p>

            <Select
              onValueChange={(value) => setProvince(value)}
              value={province}
            >
              <SelectTrigger
                className={clsx("py-2 px-5 bg-white border-neutral-03", {
                  " border-red-500 ": isError,
                })}
              >
                <SelectValue placeholder="กรุณาเลือก" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {provinces &&
                    provinces.map((item) => (
                      <SelectItem key={item.id} value={item.name_th}>
                        {item.name_th}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <div className="w-full flex justify-end gap-2">
            <Button variant={"outline"} onClick={() => setOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              onClick={async () => {
                if (province) {
                  setIsError(false);
                  await onSubmitModalLocation(
                    id!,
                    province,
                    location?.latitude || 0,
                    location?.longitude || 0
                  );
                  setOpen(false);
                } else {
                  setIsError(true);
                }
              }}
            >
              รีเซ็ตตำแหน่ง
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
