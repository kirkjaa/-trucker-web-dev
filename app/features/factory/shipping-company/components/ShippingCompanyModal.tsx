import React from "react";

import ShippingCompanyCard from "./ShippingCompanyCard";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import FactoriesAndComponiesImageCard from "@/app/features/admin/components/FactoriesAndComponiesImageCard";
import FactoriesAndComponiesLocationCard from "@/app/features/admin/components/FactoriesAndComponiesLocationCard";

type ShippingCompanyModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  name?: string;
  contractTime?: string;
  contractStart?: Date;
  contractEnd?: Date;
  phone?: string;
  email?: string;
  imageUrl?: string;
  latitude?: string;
  longitude?: string;
};

export default function ShippingCompanyModal({
  open,
  setOpen,
  name,
  contractTime,
  contractStart,
  contractEnd,
  phone,
  email,
  imageUrl,
  latitude,
  longitude,
}: ShippingCompanyModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[900px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>ข้อมูลบริษัท</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap justify-between gap-y-4 gap-x-2">
          <div className="w-full">
            <ShippingCompanyCard
              {...{
                name,
                contractTime,
                contractStart,
                contractEnd,
                phone,
                email,
              }}
            />
          </div>
          <div className="w-[49%]">
            <FactoriesAndComponiesLocationCard
              latitude={latitude || ""}
              longitude={longitude || ""}
            />
          </div>
          <div className="w-[49%]">
            <FactoriesAndComponiesImageCard
              imageUrl={imageUrl}
              name={name || ""}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
