"use client";

import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import clsx from "clsx";

import useDriversForm from "../hooks/useDriversForm";

import DriversFreelanceUploadPanel from "./DriversFreelanceUploadPanel";

import { Button } from "@/app/components/ui/button";
import HeaderWithBackStep from "@/app/components/ui/featureComponents/HeaderWithBackStep";
import UploadImage from "@/app/components/ui/featureComponents/UploadImage";
import { Input } from "@/app/components/ui/input";
import ModalNotification from "@/app/components/ui/ModalNotification";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Icons } from "@/app/icons";
import { EAdminPathName } from "@/app/types/enum";

type DriversFormProps = {
  title: string;
  id?: string;
};

export default function DriversForm({ title, id }: DriversFormProps) {
  // Hook
  const {
    handleClickBackStep,
    pathName,
    getOptionList,
    option,
    errors,
    register,
    handleUpdate,
    handleCreate,
    handleSubmit,
    setValue,
    watch,
    control,
    clearErrors,
    // onDriverCompanyIdChange,
    // driverCompanyId,
    // image,
    // setImage,
    // idCardImage,
    // setIdCardImage,
    // vehicleRegistrationImage,
    // setVehicleRegistrationImage,
    // vehicleLicenseImage,
    // setVehicleLicenseImage,
    // getValues,
    handleGetDriverById,
    searchOption,
    setSearchOption,
    handleConfirm,
    openModalConfirm,
    setOpenModalConfirm,
    // tempData,
  } = useDriversForm();

  //Use Effect
  useEffect(() => {
    console.log(errors);
  }, [errors]);
  useEffect(() => {
    getOptionList();
  }, [searchOption]);

  useEffect(() => {
    if (id) {
      handleGetDriverById(Number(id));
    }
  }, [id]);

  return (
    <React.Fragment>
      <div className="flex flex-col gap-3 ">
        <HeaderWithBackStep
          onClick={handleClickBackStep}
          iconTitle="PaperPlusBulk"
          title={title}
        />
        <div className="bg-modal-01 px-5 py-3 rounded-lg flex justify-between items-center">
          <div className="text-sm  flex gap-2">
            <p className="text-secondary-indigo-main">
              สมัครสมาชิกในรูปแบบของบริษัท โดยการสมัครจะกำหนด Role Admin
              ของบริษัท
            </p>
          </div>
          <div className="flex gap-4 ">
            {!id ? (
              <React.Fragment>
                <Button onClick={handleSubmit(handleConfirm)}>
                  <p className="button"> ยืนยัน</p>
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Button onClick={handleSubmit(handleConfirm)}>
                  <p className="button">บันทึก</p>
                </Button>
              </React.Fragment>
            )}
          </div>
        </div>
        <div className=" rounded-xl ">
          <div
            className={clsx("flex flex-col gap-1  bg-modal-01 p-4 rounded-xl", {
              "w-1/4": pathName.includes(EAdminPathName.DRIVERSINTERNAL),
              "w-full": pathName.includes(EAdminPathName.DRIVERSFREELANCE),
            })}
          >
            {pathName.includes(EAdminPathName.DRIVERSINTERNAL) ? (
              <React.Fragment>
                <p className="text-sm font-semibold text-neutral-08">
                  รูปภาพประจำตัว
                </p>
                <Controller
                  name="image"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <UploadImage
                      setFile={onChange}
                      imageUrl={typeof value === "string" ? value : undefined}
                      discription="กดเพื่อเลือกรูปประจำตัว"
                    />
                  )}
                />
              </React.Fragment>
            ) : (
              <DriversFreelanceUploadPanel control={control} />
            )}
          </div>
        </div>
        <div className="bg-modal-01 p-4 rounded-xl ">
          <p>ข้อมูลระบบ</p>
          <div className="flex flex-row gap-2 p-4 w-full">
            {pathName.includes(EAdminPathName.DRIVERSINTERNAL) && (
              <div className="flex flex-col gap-1 w-1/2">
                <p className="text-sm font-semibold text-neutral-08">
                  บริษัท
                  <span className="text-urgent-fail-02">*</span>
                </p>

                <Select
                  value={watch("organization_id")}
                  onValueChange={(val) => {
                    setValue("organization_id", val);
                    clearErrors("organization_id");
                  }}
                >
                  <SelectTrigger
                    className={clsx("py-2 px-5 bg-white border-neutral-03", {
                      "border-red-500": errors.organization_id,
                    })}
                  >
                    <SelectValue placeholder="กรุณาเลือก" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        type="text"
                        placeholder="ค้นหาโรงงาน..."
                        className="w-full rounded-md border text-sm"
                        value={searchOption}
                        onChange={(e) => setSearchOption(e.target.value)}
                      />
                    </div>
                    <SelectGroup>
                      {option &&
                        option?.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.organization_id && (
                  <div className="flex gap-2 items-center">
                    <Icons name="ErrorLogin" className="w-4 h-4" />
                    <p className="text-sm text-red-500 text-start pt-1">
                      {errors.organization_id.message}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-1 w-1/2">
              <p className="text-sm font-semibold text-neutral-08">
                ชื่อผู้ใช้งาน <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.username,
                })}
                placeholder="ชื่อผู้ใช้งาน"
                disabled={id ? true : false}
                {...register("username")}
              />
              {errors.username && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.username.message}
                  </p>
                </div>
              )}
            </div>
          </div>
          <p>ข้อมูส่วนตัว</p>
          <div className="flex flex-row gap-2 p-4 w-full">
            <div className="flex flex-col gap-1 w-1/2">
              <p className="text-sm font-semibold text-neutral-08">
                ชื่อ <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.first_name,
                })}
                placeholder="ชื่อ"
                {...register("first_name")}
              />
              {errors.first_name && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.first_name.message}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <p className="text-sm font-semibold text-neutral-08">
                นามสกุล <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.last_name,
                })}
                placeholder="นามสกุล"
                {...register("last_name")}
              />
              {errors.last_name && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.last_name.message}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row gap-2 p-4 w-full">
            <div className="flex flex-col gap-1 w-1/2">
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
            <div className="flex flex-col gap-1 w-1/2">
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
        </div>
      </div>
      <ModalNotification
        open={openModalConfirm}
        setOpen={setOpenModalConfirm}
        title={!id ? "ยืนยันการเพิ่มข้อมูล" : "ยืนยันการแก้ไขข้อมูล"}
        description="กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนดำเนินการ"
        buttonText={"ยืนยัน"}
        isConfirmOnly={false}
        icon={<Icons name="CheckCircle" className="w-16 h-16" />}
        onConfirm={() => {
          if (id) {
            handleUpdate(Number(id));
          } else {
            handleCreate();
          }
        }}
      />
    </React.Fragment>
  );
}
