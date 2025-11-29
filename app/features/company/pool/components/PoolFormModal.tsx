import React, { useEffect } from "react";

import usePoolForm from "../hooks/usePoolForm";

import PoolDetailForm from "./PoolDetailForm";
import PoolDragMapModal from "./PoolDragMapModal";
import PoolRentForm from "./PoolRentForm";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import Stepper from "@/app/components/ui/Stepper";
import { EHttpStatusCode, EPoolType } from "@/app/types/enum";
import { haversine } from "@/app/utils/haversine";

type PoolFormModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: EPoolType;
  fetchDataList: () => void;
};

export default function PoolFormModal({
  open,
  setOpen,
  type,
  fetchDataList,
}: PoolFormModalProps) {
  const {
    step,
    handleClickNextStep,
    stepers,
    handleClickCancel,
    handleSubmit,
    handleConfirm,
    register,
    setValue,
    image,
    setImage,
    errors,
    description,
    setDescription,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    provinces,
    selectedOriginProvince,
    setSelectedOriginProvince,
    selectedDestinationProvince,
    setSelectedDestinationProvince,
    selectedTruckSize,
    setSelectedTruckSize,
    setStep,
    setStepOffer,
    reset,
    openDragMapModal,
    setOpenDragMapModal,
    latLng,
    setLatLng,
    typeLatLng,
    setTypeLatLng,
    getValues,
    startAddress,
    setStartAddress,
    endAddress,
    setEndAddress,
  } = usePoolForm();

  useEffect(() => {
    setStep(1);
    setStepOffer(1);
    reset();
    setImage([]);
    setSelectedOriginProvince("");
  }, [open]);
  useEffect(() => {
    if (typeLatLng === "origin") {
      setValue("jobDetailOriginLatitude", latLng?.latitude);
      setValue("jobDetailOriginLongitude", latLng?.longitude);
    } else {
      setValue("jobDetailDestinationLatitude", latLng?.latitude);
      setValue("jobDetailDestinationLongitude", latLng?.longitude);

      const jobDetailDistance = haversine(
        getValues("jobDetailOriginLatitude") || 0,
        getValues("jobDetailOriginLongitude") || 0,
        latLng?.latitude || 0,
        latLng?.longitude || 0
      );
      setValue("jobDetailDistance", jobDetailDistance);
    }
  }, [latLng]);

  return (
    <React.Fragment>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[600px]" outlineCloseButton>
          <DialogHeader className="w-full pb-[1rem]">
            <DialogTitle>เพิ่มข้อมูลประเภทและราคา</DialogTitle>
          </DialogHeader>
          {type === EPoolType.QUICK ||
            (type === EPoolType.OFFER && (
              <div className="bg-modal-01 rounded-xl p-2 min-h-10">
                <Stepper steps={stepers} currentStep={step} />
              </div>
            ))}

          {step === 1 && (
            <PoolDetailForm
              register={register}
              setValue={setValue}
              errors={errors}
              image={image}
              setImage={setImage}
              description={description}
              setDescription={setDescription}
              type={type}
              provinces={provinces}
              selectedOriginProvince={selectedOriginProvince}
              setSelectedOriginProvince={setSelectedOriginProvince}
              setOpenDragMapModal={setOpenDragMapModal}
              setTypeLatLng={setTypeLatLng}
              setStartAddress={setStartAddress}
            />
          )}
          {step === 2 && (
            <PoolRentForm
              register={register}
              setValue={setValue}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              errors={errors}
              provinces={provinces}
              selectedOriginProvince={selectedOriginProvince}
              setSelectedOriginProvince={setSelectedOriginProvince}
              selectedDestinationProvince={selectedDestinationProvince}
              setSelectedDestinationProvince={setSelectedDestinationProvince}
              selectedTruckSize={selectedTruckSize}
              setSelectedTruckSize={setSelectedTruckSize}
              setOpenDragMapModal={setOpenDragMapModal}
              setTypeLatLng={setTypeLatLng}
              setStartAddress={setStartAddress}
              setEndAddress={setEndAddress}
            />
          )}

          <DialogFooter>
            <div className="w-full flex gap-2 justify-end">
              {step === 1 &&
              (type === EPoolType.QUICK || type === EPoolType.OFFER) ? (
                <React.Fragment>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      handleClickNextStep();
                    }}
                  >
                    ถัดไป
                  </Button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (step === 1) setOpen(false);
                      else handleClickCancel();
                    }}
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    onClick={handleSubmit(async (data) => {
                      const response = await handleConfirm(data);
                      if (response.statusCode === EHttpStatusCode.CREATED) {
                        setOpen(false);
                        fetchDataList();
                      }
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
      <PoolDragMapModal
        open={openDragMapModal}
        setOpen={setOpenDragMapModal}
        setLatLng={setLatLng}
        latLng={latLng}
        startAddress={typeLatLng === "origin" ? startAddress : endAddress}
      />
    </React.Fragment>
  );
}
