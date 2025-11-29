"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

import useUsersPositionForm from "../hooks/useUsersPositionForm";

import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import HeaderWithBackStep from "@/app/components/ui/featureComponents/HeaderWithBackStep";
import { Input } from "@/app/components/ui/input";
import { Switch } from "@/app/components/ui/switch";
import { Icons } from "@/app/icons";
import { EUsersPosition, usersPositionLabel } from "@/app/types/enum";

type UsersPositionFormProps = {
  id?: string;
  title: string;
};

export default function UsersPositionForm({
  id,
  title,
}: UsersPositionFormProps) {
  const {
    handleBack,
    errors,
    register,
    handleCreate,
    handleSubmit,
    handleUpdate,
    setValue,
    permissionForm,
    setPermissionForm,
    isActiveForm,
    setIsActiveForm,
    fetchFormData,
  } = useUsersPositionForm();

  useEffect(() => {
    setValue("isActive", isActiveForm);
  }, [isActiveForm]);

  useEffect(() => {
    setValue("permission", permissionForm);
  }, [permissionForm]);

  useEffect(() => {
    if (id) fetchFormData(id);
    setValue("id", id);
  }, [id]);
  return (
    <div className="flex flex-col gap-3 ">
      <HeaderWithBackStep
        onClick={handleBack}
        iconTitle="BusinessCardPrimary"
        title={title}
      />
      <div className="bg-modal-01 px-5 py-3 rounded-lg flex justify-end items-center">
        <React.Fragment>
          <Button
            onClick={handleSubmit(async (data) =>
              id ? await handleUpdate(data) : await handleCreate(data)
            )}
          >
            <p className="button"> บันทึก</p>
          </Button>
        </React.Fragment>
      </div>
      <div className=" rounded-xl ">
        <div className="flex flex-col gap-1  bg-modal-01 p-4 rounded-xl w-full">
          <div className="flex flex-wrap">
            <div className="flex flex-row gap-2 w-3/12 bg-modal-01 p-1 rounded-xl">
              <Switch
                onCheckedChange={(val) => setIsActiveForm(val)}
                checked={isActiveForm}
              />
              เปิดใช้งาน
            </div>
          </div>
        </div>
        <div className="mt-4 bg-modal-01 p-4 rounded-xl ">
          <p>ข้อมูลทั่วไป</p>
          <div className="flex flex-row gap-2 w-full mt-4">
            <div className="flex flex-col gap-1 w-1/2">
              <p className="text-sm font-semibold text-neutral-08">
                อักษรนำหน้า (ไม่เกิน 4 ตัว, ไม่จำเป็นต้องใส่ # นำหน้า){" "}
                <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.title,
                })}
                placeholder="กรุณากรอกข้อมูล เช่น #AD"
                {...register("title")}
              />
              {errors.title && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.title.message}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <p className="text-sm font-semibold text-neutral-08">
                ชื่อตำแหน่งงาน <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.name,
                })}
                placeholder="ชื่อตำแหน่งงาน"
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
          </div>
          <div className="mt-4">
            <p>การเข้าถึงข้อมูล</p>
            <div className="flex flex-col gap-2 mt-2">
              {Object.entries(EUsersPosition).map(([key, value]) => (
                <div className="w-full" key={key}>
                  <Checkbox
                    className="mr-4"
                    checked={permissionForm[value]}
                    onCheckedChange={(checked: boolean) => {
                      setPermissionForm({
                        ...permissionForm,
                        [value]: checked,
                      });
                    }}
                  />
                  {usersPositionLabel[value]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
