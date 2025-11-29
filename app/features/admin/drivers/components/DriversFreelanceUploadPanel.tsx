import React from "react";
import { Control, Controller } from "react-hook-form";

import { DriverForm } from "../validate/drivers";

import UploadImage from "@/app/components/ui/featureComponents/UploadImage";

type DriversFreelanceUploadPanelProps = {
  control: Control<DriverForm>;
  /* image: any; */
  /* setImage: React.Dispatch<React.SetStateAction<any>>; */
  /* idCardImage: any; */
  /* setIdCardImage: React.Dispatch<React.SetStateAction<any>>; */
  /* vehicleRegistrationImage: any; */
  /* setVehicleRegistrationImage: React.Dispatch<React.SetStateAction<any>>; */
  /* vehicleLicenseImage: any; */
  /* setVehicleLicenseImage: React.Dispatch<React.SetStateAction<any>>; */
};
export default function DriversFreelanceUploadPanel({
  control,
  /* image, */
  /* setImage, */
  /* idCardImage, */
  /* setIdCardImage, */
  /* vehicleRegistrationImage, */
  /* setVehicleRegistrationImage, */
  /* vehicleLicenseImage, */
  /* setVehicleLicenseImage, */
}: DriversFreelanceUploadPanelProps) {
  return (
    <div className="flex flex-wrap">
      <div className="flex flex-col gap-1 w-3/12 bg-modal-01 p-1 rounded-xl">
        <p className="text-sm font-semibold text-neutral-08">รูปภาพประจำตัว</p>
        <Controller
          name="image"
          control={control}
          render={({ field: { value, onChange } }) => (
            <UploadImage
              setFile={onChange}
              imageUrl={typeof value === "string" ? value : undefined}
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-1  w-3/12 bg-modal-01 p-1 rounded-xl">
        <p className="text-sm font-semibold text-neutral-08">
          สำเนาบัตรประชาชน
        </p>
        <Controller
          name="image_id_card"
          control={control}
          render={({ field: { value, onChange } }) => (
            <UploadImage
              setFile={onChange}
              imageUrl={typeof value === "string" ? value : undefined}
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-1  w-3/12 bg-modal-01 p-1 rounded-xl">
        <p className="text-sm font-semibold text-neutral-08">สำเนาทะเบียนรถ</p>
        <Controller
          name="image_truck_registration"
          control={control}
          render={({ field: { value, onChange } }) => (
            <UploadImage
              setFile={onChange}
              imageUrl={typeof value === "string" ? value : undefined}
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-1  w-3/12 bg-modal-01 p-1 rounded-xl">
        <p className="text-sm font-semibold text-neutral-08">สำเนาใบขับขี่</p>

        <Controller
          name="image_driving_license_card"
          control={control}
          render={({ field: { value, onChange } }) => (
            <UploadImage
              setFile={onChange}
              imageUrl={typeof value === "string" ? value : undefined}
            />
          )}
        />
      </div>
    </div>
  );
}
