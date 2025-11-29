import React from "react";

import TruckCapacityAndSize from "./TruckCapacityAndSize";
import TruckDocumentAndRemark from "./TruckDocumentAndRemark";
import TruckJob from "./TruckJob";
import TruckTransportation from "./TruckTransportation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import MenuButton from "@/app/components/ui/featureComponents/MenuButton";
import { Switch } from "@/app/components/ui/switch";
import { useGlobalStore } from "@/app/store/globalStore";
import { TrucksListTable } from "@/app/types/truckType";
import { formatDimension, formatLicensePlate } from "@/app/utils/formatTruck";

type TruckDetailModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: TrucksListTable;
  handleChangeStatus?: (id: string, val: boolean) => void;
};

export default function TruckDetailModal({
  open,
  setOpen,
  data,
  handleChangeStatus,
}: TruckDetailModalProps) {
  const { currentStep } = useGlobalStore();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[1000px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>
            <div className="font-bold text-lg flex gap-10 px-5 text-main-02 border-b">
              <MenuButton
                step={1}
                title="ข้อมูลการขนส่ง"
                icon1="TruckPrimary"
                icon2="TruckLight"
              />
              <MenuButton
                step={2}
                title="ความจุและน้ำหนักบรรทุก"
                icon1="ChartBulkGreen"
                icon2="ChartBulkGray"
              />
              <MenuButton
                step={3}
                title="รอบการวิ่งงาน"
                icon1="PinPrimary"
                icon2="PinSolidGray"
              />
              <MenuButton
                step={4}
                title="เอกสารแนบและหมายเหตุ"
                icon1="DocumentGreen"
                icon2="DocumentBulk"
              />
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="w-full flex bg-modal-01 justify-between  items-center p-4 rounded-lg">
          <p className="title3">รถของโรงงาน</p>
          <div className="flex gap-4">
            <Switch
              checked={data ? data?.isActive : false}
              onCheckedChange={(val) => {
                handleChangeStatus && handleChangeStatus(data!.id!, val);
              }}
            />
            <p>{data?.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}</p>
          </div>
        </div>
        <div className="mt-2">
          {currentStep === 1 ? (
            <TruckTransportation
              brand={data?.brand}
              color={data?.color}
              licensePlate={
                data?.licensePlate &&
                formatLicensePlate(
                  data?.licensePlate.value,
                  data?.licensePlate.province
                )
              }
              truckCode={data?.truckCode}
              companyName={data?.company?.name}
              factoryName={data?.factory?.name}
              drivers={data?.drivers}
            />
          ) : currentStep === 2 ? (
            <TruckCapacityAndSize
              weight={data?.capacity.weight}
              dimension={
                data?.capacity.size &&
                formatDimension(
                  data.capacity.size.width,
                  data.capacity.size.height,
                  data.capacity.size.length,
                  data.capacity.size.unit
                )
              }
              containers={data?.capacity.containers}
            />
          ) : currentStep === 3 ? (
            <TruckJob id={data?.id || ""} />
          ) : (
            <TruckDocumentAndRemark
              documentUrls={data?.documentUrls}
              remark={data?.remark}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
