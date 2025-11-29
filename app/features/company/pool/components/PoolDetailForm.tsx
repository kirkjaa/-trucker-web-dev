import React, { useEffect } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import clsx from "clsx";

import DragAndDrop from "@/app/components/ui/featureComponents/DragAndDrop";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { Icons } from "@/app/icons";
import { IProvince } from "@/app/types/addressType";
import { EPoolType } from "@/app/types/enum";
import { PoolFormInputs } from "@/app/utils/validate/pool-validate";

type PoolDetailFormProps = {
  register: UseFormRegister<PoolFormInputs>;
  setValue: UseFormSetValue<PoolFormInputs>;
  image: any[];
  setImage: React.Dispatch<React.SetStateAction<any[]>>;
  errors: FieldErrors<PoolFormInputs>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  type: EPoolType;
  provinces: IProvince[];
  selectedOriginProvince: string;
  setSelectedOriginProvince: React.Dispatch<React.SetStateAction<string>>;
  setOpenDragMapModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTypeLatLng: React.Dispatch<
    React.SetStateAction<"origin" | "destination" | undefined>
  >;
  setStartAddress?: React.Dispatch<React.SetStateAction<string | undefined>>;
};
export default function PoolDetailForm({
  register,
  setValue,
  image,
  setImage,
  errors,
  description,
  setDescription,
  type,
  provinces,
  selectedOriginProvince,
  setSelectedOriginProvince,
  setOpenDragMapModal,
  setTypeLatLng,
  setStartAddress,
}: PoolDetailFormProps) {
  useEffect(() => {
    setValue("description", description);
  }, [description]);

  useEffect(() => {
    setValue("image", image[0]);
  }, [image]);

  useEffect(() => {
    setValue("type", type);
  }, [type]);
  useEffect(() => {
    if (type === EPoolType.NORMAL) {
      setValue("jobDetailOriginProvince", selectedOriginProvince);
      if (selectedOriginProvince) {
        setOpenDragMapModal(true);
        setTypeLatLng("origin");
        if (setStartAddress) setStartAddress(selectedOriginProvince);
      }
    }
  }, [selectedOriginProvince]);

  return (
    <div className="bg-modal-01 p-2 rounded-xl">
      <div className="flex flex-col gap-1  w-full bg-modal-01 p-1 rounded-xl">
        <p className="text-sm font-semibold text-neutral-08">รูปภาพ</p>

        <DragAndDrop files={image} setFiles={setImage} maxFiles={1} isPreview />
      </div>
      <div className="flex flex-col gap-1 w-full p-2">
        <p className="text-sm font-semibold text-neutral-08">
          หัวข้อ <span className="text-urgent-fail-02">*</span>
        </p>
        <Input
          className={clsx("h-10 w-full border border-neutral-03", {
            "border-red-500": errors.subject,
          })}
          placeholder="หัวข้อ"
          {...register("subject")}
        />
        {errors.subject && (
          <div className="flex gap-2 items-center">
            <Icons name="ErrorLogin" className="w-4 h-4" />
            <p className="text-sm text-red-500 text-start pt-1">
              {errors.subject.message}
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 w-full p-2">
        <p className="text-sm font-semibold text-neutral-08">
          รายละเอียด <span className="text-urgent-fail-02">*</span>
        </p>
        <Textarea
          value={description}
          className={clsx("h-28 w-full border border-neutral-03 mt-3", {
            "border-red-500": errors.description,
          })}
          placeholder="แสดงความคิดเห็น"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setDescription(e.target.value);
          }}
        />
        {errors.description && (
          <div className="flex gap-2 items-center">
            <Icons name="ErrorLogin" className="w-4 h-4" />
            <p className="text-sm text-red-500 text-start pt-1">
              {errors.description.message}
            </p>
          </div>
        )}
      </div>
      {type === EPoolType.NORMAL && (
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
      )}
    </div>
  );
}
