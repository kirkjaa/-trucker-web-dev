import React, { useEffect } from "react";
import clsx from "clsx";

import useMyProfileForm from "../hooks/useMyProfileForm";

import { Button } from "@/app/components/ui/button";
import UploadImage from "@/app/components/ui/featureComponents/UploadImage";
import { Input } from "@/app/components/ui/input";
import { Icons } from "@/app/icons";
import { ICompanyMe } from "@/app/types/companyType";
import { ERoles } from "@/app/types/enum";
import { IFactoryMe } from "@/app/types/factoryType";

type MyProfileFormProps = {
  data?: ICompanyMe | IFactoryMe;
  setVisibleForm: (open: boolean) => void;
  imageUrl?: string;
  type: ERoles;
};

export default function MyProfileForm({
  data,
  setVisibleForm,
  // imageUrl,
  type,
}: MyProfileFormProps) {
  const {
    image,
    setImage,
    register,
    errors,
    handleSetForm,
    setValue,
    onSubmit,
    handleSubmit,
  } = useMyProfileForm();

  useEffect(() => {
    if (data?.imageUrl) setImage({ src: data?.imageUrl });
    if (data) handleSetForm(data);
  }, []);

  // useEffect(() => {
  //   if (imageUrl) setImage({ src: imageUrl });
  // }, [imageUrl]);

  useEffect(() => {
    setValue("image", image);
  }, [image]);
  return (
    <div className="border-2 rounded-xl">
      <div className="flex flex-col justify-center gap-1 w-full p-4 rounded-xl">
        <UploadImage setFile={setImage} imageUrl={image?.src} />
      </div>

      <div className="flex flex-col gap-4 p-4 w-full">
        <div className="flex flex-col gap-1 w-full">
          <p className="text-sm font-semibold text-neutral-08">
            {type === ERoles.COMPANY ? "ชื่อบริษัท" : "ชื่อโรงงาน"}{" "}
            <span className="text-urgent-fail-02">*</span>
          </p>
          <Input
            className={clsx("h-10 w-full border border-neutral-03", {
              "border-red-500": errors.name,
            })}
            placeholder={type === ERoles.COMPANY ? "ชื่อบริษัท" : "ชื่อโรงงาน"}
            {...register("name")}
          />
          {errors.name && (
            <div className="flex gap-2 items-center">
              <Icons name="ErrorLogin" className="w-4 h-4" />
              <p className="text-sm text-red-500 text-start pt-1">
                {errors.name.message}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <p className="text-sm font-semibold text-neutral-08">ประเภทธุรกิจ</p>
          <Input
            className={clsx("h-10 w-full border border-neutral-03", {
              "border-red-500": errors.businessType,
            })}
            placeholder="ประเภทธุรกิจ"
            {...register("businessType")}
          />
          {errors.businessType && (
            <div className="flex gap-2 items-center">
              <Icons name="ErrorLogin" className="w-4 h-4" />
              <p className="text-sm text-red-500 text-start pt-1">
                {errors.businessType.message}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <p className="text-sm font-semibold text-neutral-08">
            ตำแหน่งที่ตั้ง <span className="text-urgent-fail-02">*</span>
          </p>
          <Input
            className={clsx("h-10 w-full border border-neutral-03", {
              "border-red-500": errors.addressLine1,
            })}
            placeholder="ตำแหน่งที่ตั้ง"
            {...register("addressLine1")}
          />
          {errors.addressLine1 && (
            <div className="flex gap-2 items-center">
              <Icons name="ErrorLogin" className="w-4 h-4" />
              <p className="text-sm text-red-500 text-start pt-1">
                {errors.addressLine1.message}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <p className="text-sm font-semibold text-neutral-08">
            เบอร์โทรศัพท์ <span className="text-urgent-fail-02">*</span>
          </p>
          <Input
            className={clsx("h-10 w-full border border-neutral-03", {
              "border-red-500": errors.phone,
            })}
            placeholder="เบอร์โทรศัพท์"
            {...register("phone")}
          />
          {errors.phone && (
            <div className="flex gap-2 items-center">
              <Icons name="ErrorLogin" className="w-4 h-4" />
              <p className="text-sm text-red-500 text-start pt-1">
                {errors.phone.message}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <p className="text-sm font-semibold text-neutral-08">
            อีเมล <span className="text-urgent-fail-02">*</span>
          </p>
          <Input
            className={clsx("h-10 w-full border border-neutral-03", {
              "border-red-500": errors.email,
            })}
            placeholder="อีเมล"
            {...register("email")}
          />
          {errors.email && (
            <div className="flex gap-2 items-center">
              <Icons name="ErrorLogin" className="w-4 h-4" />
              <p className="text-sm text-red-500 text-start pt-1">
                {errors.email.message}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 flex gap-2">
        <div className="flex w-full justify-end gap-4">
          <Button onClick={() => setVisibleForm(false)} variant="outline">
            ยกเลิก
          </Button>
          <Button
            onClick={handleSubmit(async (data) => {
              const response = await onSubmit(data, type);
              if (response) {
                setVisibleForm(false);
              }
            })}
          >
            บันทึก
          </Button>
        </div>
      </div>
    </div>
  );
}
