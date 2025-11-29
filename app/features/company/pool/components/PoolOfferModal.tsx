import React, { useEffect } from "react";

import usePoolForm from "../hooks/usePoolForm";

import PoolOffer from "./PoolOffer";
import PoolOfferTruck from "./PoolOfferTruck";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import Stepper from "@/app/components/ui/Stepper";
import { EHttpStatusCode } from "@/app/types/enum";
import { IPoolData } from "@/app/types/poolType";

type PoolOfferModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: IPoolData;
};

export default function PoolOfferModal({
  open,
  setOpen,
  data,
}: PoolOfferModalProps) {
  const {
    stepersOffer,
    stepOffer,
    handleClickNextStep,
    handleClickCancel,
    fetchTruckList,
    optionTruckOffer,
    setValueOffer,
    registerOffer,
    errorsOffer,
    onTruckOfferChange,
    selectedTruckOffer,
    handleConfirmOffer,
    handleSubmitOffer,
    setStepOffer,
  } = usePoolForm();

  useEffect(() => {
    if (stepOffer === 2) fetchTruckList();
  }, [stepOffer]);

  useEffect(() => {
    if (data) setValueOffer("postId", data?.id);
  }, [data]);

  useEffect(() => {
    setStepOffer(1);
    setValueOffer("offeringPrice", 0);
  }, [open]);

  useEffect(() => {
    if (selectedTruckOffer) setValueOffer("truckIds", selectedTruckOffer);
  }, [selectedTruckOffer]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[600px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>เสนอราคา</DialogTitle>
        </DialogHeader>
        <div className="bg-modal-01 rounded-xl p-2 min-h-10">
          <Stepper steps={stepersOffer} currentStep={stepOffer} />
        </div>
        {stepOffer === 1 && (
          <PoolOffer
            originProvince={data?.jobDetail?.originProvince}
            destinationProvince={data?.jobDetail?.destinationProvince}
            register={registerOffer}
            errors={errorsOffer}
            truckQuantity={data?.jobDetail?.truckQuantity}
            truckSize={data?.jobDetail?.truckSize}
            jobStartAt={data?.jobDetail?.jobStartAt}
            jobEndAt={data?.jobDetail?.jobEndAt}
          />
        )}

        {stepOffer === 2 && (
          <PoolOfferTruck
            optionTruckOffer={optionTruckOffer}
            selectedTruckOffer={selectedTruckOffer}
            onTruckOfferChange={onTruckOfferChange}
            truckQuantity={data?.jobDetail?.truckQuantity}
            truckSize={data?.jobDetail?.truckSize}
          />
        )}
        <DialogFooter>
          <div className="w-full flex gap-2 justify-end">
            {stepOffer === 1 ? (
              <React.Fragment>
                <Button
                  variant="secondary"
                  onClick={() => handleClickNextStep(true)}
                >
                  ถัดไป
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Button
                  variant="outline"
                  onClick={() => handleClickCancel(true)}
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleSubmitOffer(async (data) => {
                    const response = await handleConfirmOffer(data);
                    if (response.statusCode === EHttpStatusCode.CREATED)
                      setOpen(false);
                  })}
                >
                  ยืนยัน
                </Button>
              </React.Fragment>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
